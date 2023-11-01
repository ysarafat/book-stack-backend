import { createHmac, randomBytes } from "crypto";
import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import User from "../model/user";
import createCustomError from "../utils/error";
interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name, email, password }: User = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createCustomError(400, "User already exists!"));
    }
    // generate salt
    const salt = randomBytes(16).toString("hex");
    // generate hash
    const hash = createHmac("sha512", salt).update(password).digest("hex");
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hash,
      salt,
    });

    await newUser.save();
    if (!newUser) {
      return next(createCustomError(500, "Something went wrong!"));
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "User registered successfully!",
    });
  } catch (error: any) {
    next(createCustomError(500, "Something went wrong!"));
  }
};
// user login
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: User = req.body;
    const existingUser: any = await User.findOne({ email });
    if (!existingUser) {
      return next(createCustomError(404, "User not found!"));
    }
    if (
      existingUser.password !==
      createHmac("sha512", existingUser.salt).update(password).digest("hex")
    ) {
      return next(createCustomError(401, "Invalid password!"));
    }
    const token = Jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    if (!token) {
      return next(createCustomError(500, "Something went wrong!"));
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "User login successfully!",
      access_token: token,
    });
  } catch (error: any) {
    next(createCustomError(500, "Something went wrong!"));
  }
};
export { userLogin, userRegister };
