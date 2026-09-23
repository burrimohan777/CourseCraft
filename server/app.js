const express = require("express")
const connectDB = require("./config/db")
const dotenv = require("dotenv")
const dns = require("dns")
const courseRoute = require("./routes/courseRoutes")
const authRoute = require("./routes/authRoutes")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())
dotenv.config()

app.use("/api/auth",authRoute)
app.use("/api/courses", courseRoute)

app.listen(3000, ()=>{
    console.log("Listening to the PORT")
})

connectDB()
