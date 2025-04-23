import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Google Auth Setup using Service Account
const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/calendar']
);

// ✅ Calendar Instance
const calendar = google.calendar({ version: 'v3', auth });

// 📅 Create Google Calendar Event
export const createGoogleCalendarEvent = async ({ summary, startTime, endTime, description = '', location = '' }) => {
  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary,
        description,
        location,
        start: {
          dateTime: new Date(startTime).toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: new Date(endTime).toISOString(),
          timeZone: 'Asia/Kolkata',
        }
      }
    });

    return response.data.htmlLink; // 🔗 Event join/view link
  } catch (error) {
    console.error('Google Calendar Error:', error.message);
    return null;
  }
};
