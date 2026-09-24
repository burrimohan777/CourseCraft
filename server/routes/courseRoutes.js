const express = require("express")
const { protect, authorize } = require("../middleware/authMiddleware")
const { getCourse, createCourse, deleteCourse, updateCourse, getCourseById } = require("../controllers/courseController")

const courseRoute = express.Router()

courseRoute.get("/",getCourse)

courseRoute.post("/",protect, authorize('instructor','admin'),createCourse)

courseRoute.put("/:id",getCourseById)

courseRoute.get("/:id",protect, authorize('instructor','admin'),updateCourse)

courseRoute.delete("/:id",protect, authorize('instructor','admin'),deleteCourse)

module.exports = courseRoute