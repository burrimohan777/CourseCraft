const Course = require('../models/course')

async function getCourse(req,res){
    try{
        const courses = await Course.find()
        return res.status(200).send(courses)
    }
    catch(error){
        return res.status(500).send({
            "message":"Unable to access course"
        })
    }
}

async function createCourse(req,res){
    try{
        const {title,description,category, level, price, duration} =req.body
        if(!title || !description || !category || !level || !price || !duration){
            return res.status(400).send({
                "message" : "Bad Request"
            })
        }
        const existingCourse = await Course.findOne({title : title})

        if(existingCourse){
            return res.status(400).send({
                "message" : "Bad Request, Course already Exists"
            }) 
        }

        const course = new Course({
            title : title,
            description : description,
            instructor : req.user._id,
            category : category,
            level : level,
            price : price,
            duration : duration,
        })
        await course.save()

        return res.status(200).send({
            "message" : "New course created"
        })

    }
    catch(error){
        return res.status(500).send({
            "message":"uable to create course"
        })
    }
}

async function deleteCourse(req,res){
    try{
        const {id} = req.params
        const course = await Course.findById(id)

        if(!course){
            return res.status(404).send({
                message : "Course not found"
            })
        }

        if (
            req.user.role !== "instructor" &&
            (!course.instructor || !course.instructor.equals(req.user._id))
        ) {
            return res.status(403).send({
                message: "You can only delete courses you created"
            })
        }

        await course.deleteOne({_id:id})

        return res.status(200).send({
            message : "Course deleted"
        })

    }catch(error){
        return res.status(500).send({
            message: "Unable to delete course"
        })
    }
}

async function updateCourse(req,res){
    try{
        const{id} = req.params

        const course = await Course.findById(id)

        if(!course){
            return res.status(404).send({
                message : "Course not found"
            })
        }

        const editableFields = [
            "title",
            "description",
            "category",
            "level",
            "price",
            "duration"
        ]

        editableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                course[field] = req.body[field]
            }
        })
        await course.save()

        return res.status(200).send({
            message : "Course Updated"
        })

    }catch(error){
        return res.status(500).send({
            message: "Unable to update course"
        })
    }
    
}

async function getCourseById(req,res){
    try{
        const {id} = req.params
        const course = await Course.findById(id).populate(
            "instructor",
            "name email role"
        )
        if(!course){
            return res.status(400).send({
                "message": "Bad Request: Course not found"
            })
        }
        return res.status(200).send(course)
    }
    catch(error){
        console.log("hello")
    } 
}

module.exports={
    getCourse,
    createCourse,
    deleteCourse,
    updateCourse,
    getCourseById
}