// middlewares/authMiddleware.js
export const isStudent = (req, res, next) => {
    if (req.user?.usertype === 'student') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Students only' });
    }
  };
  