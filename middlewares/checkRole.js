export const checkRole =
  (roles = []) =>
  (req, res, next) => {
    try {
      if (roles.includes(req.jwt.role)) next();
      else throw { message: "UNAUTHORIZED_ROLE" };
    } catch (error) {
      return res.status(401).json({
        status: false,
        message: error.message,
      });
    }
  };
