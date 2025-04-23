import axios from 'axios';
import asyncHandler from 'express-async-handler';
import Timetable from '../models/Timetable.js';
import User from '../models/User.js';
// import {  sendNotificationToUsers  } from '../confi/sendNotificationToUsers.js';
// import dayjs from 'dayjs';

function doTimesOverlap(startA, endA, startB, endB) {
  return (startA < endB && startB < endA);
}

const createZoomMeeting = async (teacherId, topic, startTime, duration) => {
  const teacher = await User.findById(teacherId);

  if (!teacher || !teacher.zoomAccessToken) {
    throw new Error('Teacher Zoom token not found. Please reconnect Zoom.');
  }

  const zoomPayload = {
    topic,
    type: 2, // Scheduled meeting
    start_time: new Date(startTime).toISOString(),
    duration, // in minutes
    timezone: 'Asia/Kolkata',
    settings: {
      join_before_host: false,
      mute_upon_entry: true,
      approval_type: 0,
      registration_type: 1,
      audio: 'both',
    }
  };

  const config = {
    method: 'post',
    url: 'https://api.zoom.us/v2/users/me/meetings',
    headers: {
      Authorization: `Bearer ${teacher.zoomAccessToken}`,
      'Content-Type': 'application/json'
    },
    data: zoomPayload
  };

  const { data } = await axios(config);
  return data;
};

// 📅 Create Timetable + Zoom (Optional)
export const createTimetable = asyncHandler(async (req, res) => {
  const {
    subject,
    className,
    teacher,
    room,
    day,
    startTime,
    endTime,
    recurrence,
    withZoom // Flag to decide whether to create Zoom meeting
  } = req.body;

  // Clash Check
  const existingEntries = await Timetable.find({ day });
  const clash = existingEntries.find(entry =>
    (entry.className === className || entry.teacher.toString() === teacher || entry.room === room) &&
    doTimesOverlap(new Date(entry.startTime), new Date(entry.endTime), new Date(startTime), new Date(endTime))
  );

  if (clash) {
    return res.status(400).json({ error: 'Clash detected with another class', clashDetails: clash });
  }

  let zoomLink = null;
  let zoomStartUrl = null;
  let zoomMeetingId = null;

  // If teacher wants Zoom meeting, create it
  if (withZoom) {
    const durationInMin = (new Date(endTime) - new Date(startTime)) / (1000 * 60);
    const zoomMeeting = await createZoomMeeting(teacher, subject, startTime, durationInMin);

    zoomLink = zoomMeeting.join_url;
    zoomStartUrl = zoomMeeting.start_url;
    zoomMeetingId = zoomMeeting.id;
  }

  
  // Timetable save
  const newEntry = await Timetable.create({
    subject,
    className,
    teacher,
    room,
    day,
    startTime,
    endTime,
    recurrence,
    zoomLink, // If no Zoom meeting, this will be null
    zoomStartUrl, // If no Zoom meeting, this will be null
    zoomMeetingId // If no Zoom meeting, this will be null
  });

  res.status(201).json({
    message: 'Class scheduled successfully',
    timetable: newEntry
  });
});

export const getAllTimetables = asyncHandler(async (req, res) => {
  const timetables = await Timetable.find().populate('subject teacher');
  res.status(200).json(timetables);
});

export const getTimetableByUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  let filter = {};

  if (user.role === 'student') {
    filter.className = user.className;
  } else if (user.role === 'teacher') {
    filter.teacher = req.user._id;
  }

  const timetable = await Timetable.find(filter).populate('subject teacher');
  res.status(200).json(timetable);
});

export const updateTimetable = asyncHandler(async (req, res) => {
  const classId = req.params.id;
  const update = req.body;

  const updatedClass = await Timetable.findByIdAndUpdate(classId, update, { new: true });
  res.json({ message: 'Class updated', class: updatedClass });
});

export const deleteTimetable = asyncHandler(async (req, res) => {
  const classId = req.params.id;
  await Timetable.findByIdAndDelete(classId);
  res.json({ message: 'Class deleted' });
});

export const getTodaysClasses = asyncHandler(async (req, res) => {
  const user = req.user;
  const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const currentDay = new Date(today).toLocaleString('en-US', { weekday: 'long' });

  let query = { day: currentDay };

  if (user.role === 'student') {
    query.className = user.className;
  } else if (user.role === 'teacher') {
    query.teacher = user._id;
  }

  const classes = await Timetable.find(query).populate('subject teacher');
  res.status(200).json({ today: currentDay, classes });
});

export const getSubjectWiseClasses = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const timetable = await Timetable.find({ subject: subjectId }).sort({ day: 1, startTime: 1 }).populate('subject teacher');
  res.status(200).json({ subject: subjectId, timetable });
});


// import asyncHandler from 'express-async-handler';
// import Timetable from '../models/Timetable.js';
// import User from '../models/User.js';
// import { sendNotificationToUsers } from '../config/notification.js';
// import { createGoogleCalendarEvent } from '../utils/googleCalendar.js';
// import { generateZoomLink, createZoomMeeting } from '../config/zoom.js';
// import dayjs from 'dayjs';

// // 🧠 Helper to check if two time slots overlap
// function doTimesOverlap(startA, endA, startB, endB) {
//   return (startA < endB && startB < endA);
// }

// // ✅ Create Timetable with Auto Clash Prevention
// export const createTimetable = asyncHandler(async (req, res) => {
//   const {
//     subject,
//     className,
//     teacher,
//     room,
//     day,
//     startTime,
//     endTime,
//     recurrence,
//     useGoogleCalendar,
//     useZoom
//   } = req.body;

//   const existingEntries = await Timetable.find({ day });

//   const clash = existingEntries.find(entry =>
//     (entry.className === className || entry.teacher.toString() === teacher || entry.room === room) &&
//     doTimesOverlap(new Date(entry.startTime), new Date(entry.endTime), new Date(startTime), new Date(endTime))
//   );

//   if (clash) {
//     return res.status(400).json({
//       error: 'Clash detected with another class',
//       clashDetails: clash
//     });
//   }

//   let calendarEventLink = null;
//   if (useGoogleCalendar) {
//     calendarEventLink = await createGoogleCalendarEvent({
//       summary: subject,
//       startTime,
//       endTime
//     });
//   }

//   let zoomMeetingLink = null;
//   if (useZoom) {
//     const zoom = await createZoomMeeting({ topic: subject, startTime });
//     zoomMeetingLink = zoom.join_url;
//   }

//   const newEntry = await Timetable.create({
//     subject,
//     className,
//     teacher,
//     room,
//     day,
//     startTime,
//     endTime,
//     recurrence,
//     calendarEventLink,
//     zoomMeetingLink
//   });

//   res.status(201).json({
//     message: 'Class scheduled successfully',
//     timetable: newEntry
//   });
// });

// // 📋 Get All Timetables
// export const getAllTimetables = asyncHandler(async (req, res) => {
//   const timetables = await Timetable.find().populate('subject teacher');
//   res.status(200).json(timetables);
// });

// // 👤 Get Timetable for Logged-in User
// export const getTimetableByUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);
//   let filter = {};

//   if (user.role === 'student') {
//     filter.className = user.className;
//   } else if (user.role === 'teacher') {
//     filter.teacher = req.user._id;
//   }

//   const timetable = await Timetable.find(filter).populate('subject teacher');
//   res.status(200).json(timetable);
// });

// // ✏️ Update Timetable
// export const updateTimetable = asyncHandler(async (req, res) => {
//   const classId = req.params.id;
//   const update = req.body;

//   const updatedClass = await Timetable.findByIdAndUpdate(classId, update, { new: true });
//   res.json({ message: 'Class updated', class: updatedClass });
// });

// // ❌ Delete Timetable
// export const deleteTimetable = asyncHandler(async (req, res) => {
//   const classId = req.params.id;
//   await Timetable.findByIdAndDelete(classId);
//   res.json({ message: 'Class deleted' });
// });

// // 📆 Get Today’s Classes
// export const getTodaysClasses = asyncHandler(async (req, res) => {
//   const user = req.user;
//   const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
//   const currentDay = new Date(today).toLocaleString('en-US', { weekday: 'long' });

//   let query = { day: currentDay };

//   if (user.role === 'student') {
//     query.className = user.className;
//   } else if (user.role === 'teacher') {
//     query.teacher = user._id;
//   }

//   const classes = await Timetable.find(query).populate('subject teacher');
//   res.status(200).json({ today: currentDay, classes });
// });

// // 📚 Get Timetable by Subject
// export const getSubjectWiseClasses = asyncHandler(async (req, res) => {
//   const { subjectId } = req.params;
//   const timetable = await Timetable.find({ subject: subjectId }).sort({ day: 1, startTime: 1 }).populate('subject teacher');
//   res.status(200).json({ subject: subjectId, timetable });
// });
