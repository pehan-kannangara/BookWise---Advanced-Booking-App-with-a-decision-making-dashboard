import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

// Ensure environment variables are loaded
import dotenv from "dotenv";
dotenv.config(); // Initialize dotenv to load environment variables

const ACCESS_TOKEN_EXPIRATION = "1h"; // Access token expiration
const REFRESH_TOKEN_EXPIRATION = "7d"; // Refresh token expiration

// Helper function to get JWT secret with error handling
const getJwtSecret = () => {
  const secret = process.env.JWT; // Fetch the JWT secret from environment variables
  if (!secret) {
    throw new Error("JWT secret key must have a value"); // Explicit error if secret is missing
  }
  return secret; // Return the secret key
};

// Register new users
export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10); // Generate salt for hashing
    const hash = bcrypt.hashSync(req.body.password, salt); // Hash the password

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });

    await newUser.save(); // Save the new user
    res
      .status(201)
      .json({ success: true, message: "User created successfully" }); // Successful response
  } catch (err) {
    console.error("Registration error:", err); // Log errors
    next(createError(500, "Error creating user")); // Handle registration errors
  }
};

// User login
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return next(createError(404, "User not found")); // User not found
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(createError(401, "Wrong username or password")); // Incorrect password
    }

    // Generate access token with the correct JWT secret
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      getJwtSecret(), // Use the helper function to get the JWT secret
      { expiresIn: ACCESS_TOKEN_EXPIRATION } // Set expiration time
    );

    const { password, isAdmin, ...otherDetails } = user._doc; // Remove sensitive information

    res
      .cookie("access_token", accessToken, {
        httpOnly: true, // Ensure security
        secure: process.env.NODE_ENV === "production", // Secure in production
        maxAge: 3600000, // Token lifespan (1 hour in milliseconds)
      })
      .status(200)
      .json({ success: true, user: { ...otherDetails } }); // Return user data
  } catch (err) {
    console.error("Login error:", err); // Log errors
    next(createError(500, "Internal server error")); // Handle server errors
  }
};

// Refresh token endpoint
export const refreshToken = (req, res, next) => {
  const refreshToken =
    req.cookies.refresh_token || req.headers.authorization?.split(" ")[1];

  if (!refreshToken) {
    return next(createError(401, "Refresh token not provided")); // No refresh token
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH, // Ensure the refresh token secret is correct
    (err, decoded) => {
      if (err) {
        return next(createError(403, "Invalid or expired refresh token")); // Invalid token
      }

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id, isAdmin: decoded.isAdmin },
        getJwtSecret(), // Use the helper function to get the JWT secret
        { expiresIn: "1h" } // New token expiration time
      );

      res
        .cookie("access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000, // 1 hour in milliseconds
        })
        .status(200)
        .json({ success: true, token: newAccessToken });
    }
  );
};
