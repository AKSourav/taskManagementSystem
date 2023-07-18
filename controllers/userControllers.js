const asyncHandler= require('express-async-handler');
const User = require('../models/userModel');
const generateToken =require('../config/generateToken');

const registerUser = asyncHandler(async (req,res)=>{
    const {username, name, email, password, admin} =req.body;

    if(!username || !name || !email || !password)
    {
        res.status(401);
        throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({$or:[{email},{username}]});

    if(userExists)
    {
        res.status(401);
        throw Error("User already Exists with same email or same username");
    }

    try{
        const user = await User.create({
            username,
            name,
            email,
            password,
            admin
        });
    
        if(user)  //Successfully created new user
        {
            res.status(201).json({
                _id: user._id,
                username:username.toLowerCase(),
                name: user.name,
                email: user.email,
                admin:admin,
                token: generateToken(user._id),
            })
        }
        else //if not Successfully created
        {
            res.status(400);
            throw new Error("Failed to create the User");
        }
    } catch (error){
        throw new Error(error);
    }
});


const authUser =asyncHandler(async (req,res)=>{
    const {email_username,password} = req.body;
    // console.log(email_username);

    try{
        const user = await User.findOne({$or:[{email:email_username.toLowerCase()},{username:email_username.toLowerCase()}]});
    
        if(user && (await user.matchPassword(password))) // Checking user and natching password if found!
        {
            res.status(201).json({
                _id: user._id,
                username:user.username,
                name: user.name,
                email: user.email,
                admin:user.admin,
                tasksdone:user.tasksdone,
                token: generateToken(user._id),
            })
        }
        else
        {
            res.status(401);
            throw new Error("Invalid Email/Username or Password");
        }
    } catch(error)
    {
        console.log(error);
        throw new Error(error);
    }
});

//   /api/user?search=<anyusename>&searchQuery=<selectedAdmin>
const allUsers = asyncHandler(async (req,res)=>{
    // console.log("all users")
    const searchQuery=req.query.searchQuery;
    // console.log(searchQuery)
    const keyword = searchQuery ? {
        $or: [
            {username : {$regex: searchQuery, $options: "i"}},
            // {name : {$regex: searchQuery, $options: "i"}},
            // {email : {$regex: searchQuery, $options: "i"}},
        ]
    }
    :{};

    var users=[];
    try{
        users = await User.find(keyword).find({_id: { $ne: req.user._id }}).select("-password");
        res.json(users);
    }
    catch(error)
    {
        console.log(error);
        res.status(400);
        throw new Error(error)
    }
})


module.exports= {registerUser, authUser, allUsers};