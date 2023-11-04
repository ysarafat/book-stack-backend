import { NextFunction, Request, Response } from "express";
import Users from "../model/user";
import createCustomError from "../utils/error";

// get all user
const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await Users.find({}).select("-password -salt -__v");
    if (!users) {
      return next(createCustomError(404, "Users not found!"));
    }
    res.status(200).json({
      success: true,
      status: 200,
      data: users,
    });
  } catch (error) {
    next(createCustomError(500, "Something went wrong!"));
  }
};

// get a user
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id).select("-password -salt -__v");
    if (!user) {
      return next(createCustomError(404, "User not found!"));
    }
    res.status(200).json({
      success: true,
      status: 200,
      data: user,
    });
  } catch (error: any) {
    next(createCustomError(500, error.message || "Something went wrong!"));
  }
};
export { getAllUser, getUser };
