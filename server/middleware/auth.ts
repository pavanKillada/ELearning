import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catch_async_errors";
import ErrorHandler from "../utils/error_handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
require("dotenv").config();

// Authenticated user
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(new ErrorHandler("User is not Authenticated", 401));
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    req.user = JSON.parse(user);

    next();
  }
);

// validate user role
export const authorizedRoles = (...roles: string[]) => {
    return (req:Request, res:Response, next:NextFunction)=>{
        if(!roles.includes(req.user?.role || '')){
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403))
        }
        next();
    }
}