// utils/zoom.js
import axios from 'axios';
import jwt from 'jsonwebtoken';

// Replace these with your actual API key and secret from Zoom
const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;

const generateZoomToken = () => {
  const payload = {
    iss: ZOOM_API_KEY,
    exp: ((new Date()).getTime() + 5000)
  };
  return jwt.sign(payload, ZOOM_API_SECRET);
};

// Create a Zoom Meeting
export const createZoomMeeting = async ({ topic, startTime }) => {
  const token = generateZoomToken();
  const res = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
    topic,
    type: 2,
    start_time: startTime,
    duration: 60,
    timezone: 'Asia/Kolkata',
    settings: {
      join_before_host: true,
      approval_type: 0,
      registration_type: 1,
      enforce_login: false,
      waiting_room: false,
    },
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return res.data;
};

// Optional helper if you want to generate a basic Zoom link without creating a meeting
export const generateZoomLink = (meetingId) => {
  return `https://zoom.us/j/${meetingId}`;
};
