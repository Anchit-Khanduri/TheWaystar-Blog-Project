require("dotenv").config();
const express = require("express");
const path = require('path');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/userModel");
const Blog = require("../models/createBlogModel");


const userRouter = express.Router();

// Middleware to set the user from token
async function setUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload._id);
    res.locals.user = user || null;
  } catch (err) {
    console.error("JWT error:", err);
    res.locals.user = null;
  }
  next();
}

userRouter.use(setUser);






// Index Login Page
userRouter.get('/',(req,res)=>{
    res.render("index");
})

// Login Page
userRouter.get('/login',(req,res)=>{
    res.render("login");
})

// Home Route
userRouter.get("/home",async(req, res) => {
  const blogData = await Blog.find({});
  res.render("home", { user: res.locals.user,blogData});
});


//Create Blog
userRouter.get("/create-blog",(req,res)=>{
    res.render("createBlog");
})

//Account Blog
userRouter.get("/myaccount",async(req,res)=>{
    res.render("myaccount",{user: res.locals.user,});
})

// Post Blog
userRouter.post("/create-blog",async(req,res)=>{
    try{
        const {blogName,blogDescription} = req.body;
            
        const blogData = await Blog.create({
        blogName,
        blogDescription,
        createdBy: req.user._id,
        });
    return res.status(201).redirect("/home");

    }catch(err){
    console.error("Blog Creation Failed error:", err.message || err); 
    return res.status(500).send("Blog Creation Failed error failed");  
    }
})


// My Blogs Route
userRouter.get('/myBlogs/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const blogs = await Blog.find({ createdBy:userId });

    res.render('myBlogs', { blogs });
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).send("Something went wrong.");
  }
});


// Delete Blog
userRouter.post("/myBlogs/:id",async(req,res)=>{
    const blogId = req.params.id;
    try{
      await Blog.findByIdAndDelete(blogId);
      res.status(204).redirect("/home");
    }catch(err){
      res.status(500).send("Error deleting");
    }
})




// Logout Route
userRouter.get("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the auth token
  res.redirect("/login");   // Redirect to login or homepage
});


// Delete User
userRouter.post("/myaccount/:id",async(req,res)=>{
    const userId = req.params.id;
    try{
      await User.findByIdAndDelete(userId);
      await Blog.deleteMany({createdBy:userId});

      res.status(204).redirect("/login");
    }catch(err){
      res.status(500).send("Error deleting");
    }
})



// login Route
userRouter.post("/login", async (req, res) => {
  const { useremail, userpassword } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(useremail, userpassword);
    return res.status(201).cookie("token", token, { httpOnly: true }).redirect("/home");
  } catch (error) {
    return res.status(401).render("login",{error:"Invalid Credential"});
    
  }
});



// Register Route

userRouter.post("/register", async (req, res) => {
  try {
    // Log req.body to ensure data is coming through correctly
    console.log(req.body); // Debugging

    const { username, useremail, userpassword, userDOB } = req.body;

    // Check if user already exists by email
    const existing = await User.findOne({ email: useremail });
    if (existing) return res.status(409).send("Email already exists");

    // Create new user in the database
    const user = await User.create({
      username,
      useremail,
      userpassword,
      userDOB,
    });

    // Create JWT token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    // Send token as a cookie and redirect to /home
    return res.status(201).cookie("token", token, { httpOnly: true }).redirect("/home");

  } catch (err) {
    console.error("Signup error:", err.message || err); // Log detailed error message
    return res.status(500).send("Signup failed");
  }
});








module.exports = userRouter;
