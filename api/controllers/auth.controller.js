import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";
import { sendCookie } from "../utils/cookie.js";

export const registration = async (req, res) => {
  const { email, password, fullName, role } = req.body;

  try {
    // Validation
    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Please enter full name",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter email",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter a password",
      });
    }

    // Check if email already exists
    const isEmailExist = await Auth.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Encrypt password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await Auth.create({
      fullName,
      email,
      password: hashPassword,
      role: role,
    });

    // Send cookie and response

    sendCookie(user, res, "Account created successfully.", 201);
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//login
export const login = async (req, res) => {
  // Fetch all the data from request body
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password!",
      });
    }

    // Check if email exists
    const user = await Auth.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email already exist! Please login!",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch, "woking");
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "your_jwt_secret", // Ensure you have a secure secret key
      {
        expiresIn: "3d", // Token expires in 3 days
      }
    );

    // Return success response with token and user details
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred during login",
    });
  }
};

//verify owner
export const verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Auth.findOne({ email: email });

    if (user) {
      // Mark the user as verified and clear the verification token
      res.json({ message: "Email verified successfully!" });
    } else {
      res.status(404).json({ message: "Email not verified!." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// update the  profile iamge
export const updateDetails = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    const updateUser = await Auth.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          profilePicture: req.body.profilePicture,
        },
      },
      {
        new: true,
        runValidators: true, // Ensures validation is run
      }
    ).lean(); // Converts mongoose document to plain JavaScript object

    // Separate the password
    const { password, ...rest } = updateUser;

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      user: rest,
    });
  } catch (error) {
    next(error);
  }
};

// logout the user
export const logout = async (req, res) => {
  console.log("logout");
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logout successful!",
  });
};

export const getProfile = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await Auth.findOne({ _id: req.params.id });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
