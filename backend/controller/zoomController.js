import axios from 'axios';
import User from '../models/User.js';

export const zoomOAuthCallback = async (req, res) => {
  const { code } = req.query;
  const redirectUri = 'http://localhost:8080/api/zoom/callback';

  try {
    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      },
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    const { access_token, refresh_token } = response.data;

    // Save to teacher's user profile (assuming req.user is set after login)
    const user = await User.findById(req.user._id);
    user.zoomAccessToken = access_token;
    user.zoomRefreshToken = refresh_token;
    await user.save();

    res.redirect('/dashboard'); // or anywhere in frontend
  } catch (error) {
    console.error('OAuth Callback Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Zoom connection failed.' });
  }
};
