export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.usertype)) {
        return res.status(403).json({
          success: false,
          message: `Access denied: ${req.user?.usertype || 'Unknown'} is not authorized.`,
        });
      }
      next();
    };
  };
  