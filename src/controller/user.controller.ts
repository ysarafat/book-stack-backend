import { NextFunction, Request, Response } from "express";
import Users from "../model/user";
import createCustomError from "../utils/error";

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

export { getAllUser };
