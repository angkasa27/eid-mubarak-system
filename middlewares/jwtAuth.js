import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

export const jwtAuth = () => (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const verify = jsonwebtoken.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
      req.jwt = verify;
      next();
    } else {
      throw { message: "TOKEN_REQUIRED" };
    }
  } catch (error) {
    switch (error.message) {
      // case "jwt malformed":
      //   error.message = "TOKEN_INVALID";
      //   break;
      case "jwt expired":
        error.message = "ACCESS_TOKEN_EXPIRED";
        break;
      case "TOKEN_REQUIRED":
        error.message = "TOKEN_REQUIRED";
        break;
      default:
        error.message = "TOKEN_INVALID";
        break;
    }

    return res.status(401).json({
      status: false,
      message: error.message,
    });
  }
};
