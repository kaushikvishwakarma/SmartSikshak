import Attendance from '../models/Attendance.js';
import Subject from '../models/Subject.js';
import Class from '../models/Class.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const markBulkAttendance = async (req, res) => {
  try {
    const {
      teacherId,
      classId,
      subjectId,
      date,
      period,
      session = 'full-day',
      mode = 'manual',
      source = 'manual-entry',
      attendance = []
    } = req.body;

    const academicSession = "2024-25"; // Replace with logic if dynamic
    const formattedDate = new Date(date);

    const operations = attendance.map(async (entry) => {
      const { studentId, status, remarks } = entry;

      // Check if attendance already exists for that student + subject + date
      const existing = await Attendance.findOne({
        student: studentId,
        subject: subjectId,
        date: formattedDate
      });

      if (existing) {
        // Update existing attendance
        existing.status = status;
        existing.remarks = remarks;
        existing.logs.push({
          timestamp: new Date(),
          comment: `Updated by teacher ${teacherId}`,
        });
        return await existing.save();
      } else {
        // Create new attendance
        return await Attendance.create({
          student: studentId,
          subject: subjectId,
          class:classId,
          academicSession,
          semester: "Sem 4", // Optional: populate based on subject/class
          date: formattedDate,
          period,
          session,
          mode,
          source,
          status,
          remarks,
          markedBy: teacherId,
          logs: [{
            timestamp: new Date(),
            comment: `Marked by teacher ${teacherId}`
          }]
        });
      }
    });

    await Promise.all(operations);

    res.status(200).json({ message: 'Attendance marked successfully' });

  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Failed to mark attendance', error });
  }
};
// 1. Get attendance for a particular date
// export const getAttendanceByDate = async (req, res) => {
//     const { classId, subjectId, date } = req.params;
  
//     try {
//       const record = await Attendance.findOne({
//         class:classId,
//        subject:subjectId,
//         date: new Date(date),
//       }).populate('attendance.studentId', 'name');
  
//       if (!record) return res.status(404).json({ message: 'No attendance found for that date.' });
  
//       res.json(record);
//     } catch (err) {
//       console.error('Error fetching date attendance:', err);
//       res.status(500).json({ message: 'Server error' });
//     }
//   };
export const getAttendanceByDate = async (req, res) => {
    const { teacherId, classId, subjectId, date } = req.query;
  
    try {
      // Find existing attendance
      const existing = await Attendance.findOne({
        teacher: teacherId,
        class: classId,
        subject: subjectId,
        date: new Date(date),
      }).populate('attendance.student', 'name');
  
      if (existing) {
        const studentsWithStatus = existing.attendance.map((entry) => ({
          _id: entry.student._id,
          name: entry.student.name,
          status: entry.status,
          note: entry.remarks || '',
          attendancePercentage: entry.percentage || null,
        }));
  
        return res.json({
          attendanceId: existing._id,
          students: studentsWithStatus,
        });
      }
  
      // If no attendance record, return student list with empty status
      const allStudents = await User.find({
        usertype:'student',
        class: classId,
        subject: subjectId,
      }).select('_id name');
  
      const formattedStudents = allStudents.map((s) => ({
        _id: s._id,
        name: s.name,
        status: '',
        note: '',
        attendancePercentage: null,
      }));
  
      return res.json({
        attendanceId: null,
        students: formattedStudents,
      });
  
    } catch (err) {
      console.error('Error fetching date attendance:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  // 2. Get attendance for the past N days
  export const getAttendanceForLastNDays = async (req, res) => {
    const { classId, subjectId } = req.params;
    const days = parseInt(req.query.days) || 10;
  
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
  
      const records = await Attendance.find({
        class: classId,
        subject: subjectId,
        date: { $gte: startDate },
      })
        .sort({ date: -1 })
        .populate('attendance.student', 'name');
  
      res.json(records);
    } catch (err) {
      console.error('Error fetching last N days attendance:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const updateAttendanceById = async (req, res) => {
    const { id } = req.params;
    const { attendance } = req.body;
  
    try {
      const record = await Attendance.findById(id);
      if (!record) return res.status(404).json({ message: 'Attendance not found' });
  
      // Update attendance entries
      record.attendance = attendance.map((entry) => ({
        student: entry.student,
        status: entry.status,
        remarks: entry.remarks || '',
      }));
  
      await record.save();
      res.json({ message: 'Attendance updated successfully' });
  
    } catch (err) {
      console.error('Error updating attendance:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  // GET /api/student/:studentId/attendance/recent
// router.get('/student/:studentId/attendance/recent',
  export const RecentAttendance= async (req, res) => {
  const { studentId } = req.params;

  try {
    const recentAttendances = await Attendance.find({ student: studentId })
      .populate('subject', 'name')
      .populate('markedBy', 'name')
      .sort({ date: -1 })
      .limit(100); // fetch more in case of multiple entries per day

    // Group by date and reduce to 10 unique dates
    const grouped = {};
    for (const entry of recentAttendances) {
      const dateStr = new Date(entry.date).toISOString().split('T')[0];
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(entry);
    }

    const last10Days = Object.entries(grouped).slice(0, 10).map(([date, records]) => ({
      date,
      records,
    }));

    res.json({ success: true, data: last10Days });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

  