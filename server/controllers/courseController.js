
const Course = require("../models/course");

function canManageCourse(course, user) {
  if (!course || !user) return false;

  if (user.role === "admin") return true;

  return (
    course.instructor &&
    course.instructor.toString() === user._id.toString()
  );
}

async function getCourse(req, res) {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (error) {
    console.error("Get courses error:", error.message);
    return res.status(500).json({
      message: "Unable to access courses",
    });
  }
}

async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email role"
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error("Get course error:", error.message);
    return res.status(500).json({
      message: "Unable to access course",
    });
  }
}

async function createCourse(req, res) {
  try {
    const {
      title,
      description,
      category,
      level,
      price,
      duration,
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      !level?.trim() ||
      price === undefined ||
      price === null ||
      price === "" ||
      duration === undefined ||
      duration === null ||
      duration === ""
    ) {
      return res.status(400).json({
        message: "Please provide all required course fields",
      });
    }

    const numericPrice = Number(price);
    const numericDuration = Number(duration);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0 ||
      !Number.isFinite(numericDuration) ||
      numericDuration < 1
    ) {
      return res.status(400).json({
        message: "Price or duration is invalid",
      });
    }

    const existingCourse = await Course.findOne({
      title: title.trim(),
    });

    if (existingCourse) {
      return res.status(409).json({
        message: "A course with this title already exists",
      });
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      level: level.trim(),
      price: numericPrice,
      duration: numericDuration,
      instructor: req.user._id,
    });

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error.message);
    return res.status(500).json({
      message: "Unable to create course",
    });
  }
}


async function updateCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const isOwner =
      course.instructor &&
      course.instructor.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You can only edit courses you created",
      });
    }

    const editableFields = [
      "title",
      "description",
      "category",
      "level",
      "price",
      "duration",
    ];

    for (const field of editableFields) {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    }

    await course.save();

    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return res.status(500).json({
      message: "Unable to update course",
    });
  }
}

async function deleteCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const isOwner =
      course.instructor &&
      course.instructor.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You can only delete courses you created",
      });
    }

    await course.deleteOne();

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return res.status(500).json({
      message: "Unable to delete course",
    });
  }
}

module.exports = {
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
  getCourseById,
};