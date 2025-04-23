import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protect = async (req, res, next) => {
  try {
    // 🧠 Try getting token from Authorization header (Bearer token)
    let token = req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : null;

    // 🔄 If not in header, try from cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('Protect Middleware Error:', err);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// export const protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     // const user = await User.findById(decoded.id).select('-password');
// // if (!user) return res.status(401).json({ message: 'User not found' });

// // req.user = {
// //   id: user._id,
// //   name: user.name,
// //   email: user.email,
// //   usertype: user.usertype // <-- make sure this is included!
// // };
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Not authorized, token failed' });
//   }
// };

export const isMentor = (req, res, next) => {
  if (req.user?.usertype === 'mentor') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Mentors only' });
  }
};
