import { Request, Response } from "express";
import prisma from "../db/DB";
import { userInputSchema, loginInputSchema, UserInput, LoginInput } from "../validators/auth.validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @route   POST /register
 * @desc    Register a new user with email and username as unique fields
 * @access  Public
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the request body using Zod
    const parsedInput = userInputSchema.safeParse(req.body);
    if (!parsedInput.success) {
      res.status(400).json({
        message: "Validation failed",
        success: false,
        errors: parsedInput.error.errors,
      });
      return;
    }

    const { username, email, password, name }: UserInput = parsedInput.data;

    // Check if either email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      res.status(409).json({
        message: "Username or email already exists",
        success: false,
      });
      return;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return the newly created user (excluding sensitive fields like password)
    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

/**
 * @route   POST /login
 * @desc    Login with either username or email and get a JWT token
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the request body using Zod
    const parsedInput = loginInputSchema.safeParse(req.body);
    if (!parsedInput.success) {
      res.status(400).json({
        message: "Validation failed",
        success: false,
        errors: parsedInput.error.errors,
      });
      return;
    }

    const { identifier, password }: LoginInput = parsedInput.data;

    // Find the user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({
        message: "Invalid password",
        success: false,
      });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    // Return the user (excluding sensitive fields like password)
    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
