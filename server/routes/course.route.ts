import express from "express";
import {
  addAnswer,
  addQuestions,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCourses,
  getAllCoursesForAdmin,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";

const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizedRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizedRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", isAuthenticated, addQuestions);

courseRouter.put("/add-answer", isAuthenticated, addAnswer);

courseRouter.put("/add-review/:id", isAuthenticated, addReview);

courseRouter.put(
  "/add-reply",
  isAuthenticated,
  authorizedRoles("admin"),
  addReplyToReview
);

courseRouter.get(
  "/get-courses",
  isAuthenticated,
  authorizedRoles("admin"),
  getAllCoursesForAdmin
);

courseRouter.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizedRoles("admin"),
  deleteCourse
);

export default courseRouter;
