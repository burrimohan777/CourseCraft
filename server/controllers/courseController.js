const Course = require('../models/course');

async function getCourses(req,res){
    try{
        const courses = await Course.find()
        return res.status(200).send(courses)
    }catch(error){
        return res.status(500).send({
            message: "Unable to access course" 
        })
    }
}

async function createCourses(req,res){
    try{
        const {title, description, category, level, price, duration} = req.body
        if(!title || !description || !category || !level || !price || !duration){
            return res.status(400).send({
                message : "Bad Request"
            })
        }
        const existingCourse = await Course.findOne({title : title})

        if(existingCourse){
            return res.status(400).send({
                message : "Bad request, course Already exists"
            })
        }
        const course = new Course({
            title : title,
            description:description,
            instructor:req.user._id,
            category:category,
            level:level,
            price:price,
            duration:duration,
        })

        await course.save()

        return res.status(200).send({
            "message" :"New Course Created"
        })
    }catch(error){
        return res.status(500).send({
            message: "Unable to access course" 
        })
    }
}


function deleteCourses(req,res){

}

function updateCourses(req,res){

}
function getCourseById(req,res){

}

module.exports = {
    getCourses,
    createCourses,
    deleteCourses,
    updateCourses,
    getCourseById
}