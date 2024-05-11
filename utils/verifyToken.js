import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  //cookies or authorization header ekn token ek retrive krnw
  const token =
    req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    // If no token, return a 401 error
    return next(createError(401, "Authentication required"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      // Check for specific errors (like token expiration)
      if (err.name === "TokenExpiredError") {
        return next(createError(403, "Token has expired"));
      } else if (err.name === "JsonWebTokenError") {
        return next(createError(403, "Invalid token"));
      } else {
        return next(createError(403, "Token verification failed"));
      }
    }

    req.user = user; // Attach user information to the request
    next(); // Proceed to the next middleware or route handler
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
