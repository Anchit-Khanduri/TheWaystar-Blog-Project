require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {checkForAuthenticationCookie } = require("./middleware/userAuthentication");
const userRouter = require("./routes/userRouter");
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb://localhost:27017/thewaystar-blog-project";

mongoose.connect(MONGO_URI)
    .then(()=>{
        console.log("Mongo Connected");
    })
    .catch((error)=>{
        console.log("Error: ",error);
    })

const app = express();
app.use(express.json());
app.set('views', './views');  
app.set('view engine', 'ejs'); 
app.use(express.static(path.join(__dirname, "public")));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))


app.use("/",userRouter);


app.listen(PORT,()=>{
    console.log("Server Started");
})
