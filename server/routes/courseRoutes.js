
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
  getCourseById,
} = require("../controllers/courseController");

const courseRoute = express.Router();

courseRoute.get("/", getCourse);

courseRoute.post("/", protect, createCourse);

courseRoute.get("/:id", getCourseById);

courseRoute.put("/:id", protect, updateCourse);

courseRoute.delete("/:id", protect, deleteCourse);

module.exports = courseRoute;
