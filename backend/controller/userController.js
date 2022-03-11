const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const nodemailer = require("nodemailer");

// @desc Register user
// @route POST api/user
// @access Public
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please fill in all fields')
    }
    //check if user exists
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

// Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    //Create user
    const user = await User.create({
        name,
        email,
        password: hashPassword
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
       nodemailer.sendConfirmationEmail(
        user.username,
        user.email,
        user.confirmationCode
 );
    } else {
        res.status(400)
        throw new Error('Invalid valid data')
    }

})

// @desc Login user
// @route POST api/get/login
// @access Public
const loginUser  = asyncHandler(async(req, res)  => {
    const {email, password} = req.body
    
    //check for user user email
    const user = await User.findOne({email})
    if (user.status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            token: generateToken(user._id)
        })
    } else{
        res.status(400)
        throw new Error('Invalid credentials')
    } 
})

// @desc Get user data
// @route GET api/get/me
// @access Private
const getMe  = asyncHandler(async(req, res)  => {
    const { id, name, email} = await User.findById(req.user.id)

    res.status(200).json({
        id,
        name,
        email,
    })
})

//Generate a token
const generateToken = ( id ) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {  
    registerUser, 
    loginUser, getMe
 }
