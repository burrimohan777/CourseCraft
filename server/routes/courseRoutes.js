const express = require("express")
const { protect, authorize } = require("../middleware/authMiddleware")
const { getCourses, createCourses, deleteCourses, updateCourses, getCourseById } = require("../controllers/courseController")

const courseRoute = express.Router()

courseRoute.get("/",getCourses)

courseRoute.post("/",protect, authorize('instructor','admin'),createCourses)

courseRoute.put("/:id",getCourseById)

courseRoute.get("/:id",protect, authorize('instructor','admin'),updateCourses)

courseRoute.delete("/:id",protect, authorize('instructor','admin'),deleteCourses)

module.exports = courseRoute