const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc Get goals
// @route GET api/get/goals 
// @access private
const getGoals  = asyncHandler(async (req, res)  => {
    const goals = await Goal.find({user: req.user.id})

    res.status(200).json(goals)
})


// @desc Set goals
// @route POST api/get/goals 
// @access private
const setGoal  = asyncHandler(async (req, res)  => {
   if(!req.body.text){
       res.status(400)
       throw new Error('Please  add  a text')
   }
   const goal = await Goal.create({
       text: req.body.text,
       user: req.user.id
   })

    res.status(200).json(goal) 
})


// @desc Update goals
// @route PUT api/get/goals/:id
// @access private
const updateGoals  = asyncHandler(async (req, res)  => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }
    const user = await User.findById(req.user.id)

    //check user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //Make sure the logged in user matches the goal user
    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }
    const updatedGoals = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    res.status(200).json(updatedGoals)
})


// @desc Delete goals
// @route DELETE api/get/goals 
// @access private
const deleteGoals  = asyncHandler(async (req, res)  => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }
    const user = await User.findById(req.user.id)

    //check user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //Make sure the logged in user matches the goal user
    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }
    goal.remove()
    res.status(200).json({id: req.params.id})
})


// @desc Change password
// @route POST api/user/change
// @access private
// const changePassword  = asyncHandler(async (req, res)  => {
//     const password = await Goal.findById(req.params.password)
//     if (!password) {
//         res.status(400)
//         throw new Error('Password not found')
//     }
//     const user = await User.findById(req.user.id)

//     //check user
//     if (!user) {
//         res.status(401)
//         throw new Error('User not found')
//     }

//     if (password.isModified("password")) {
//         return next();
//       }
//       const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
//       this.password = hash


//     //Make sure the logged in user matches the goal user
//     if (password.user.toString() !== user.id) {
//         res.status(401)
//         throw new Error('User not authorized')
//     }
//     const updatedPassword = await Goal.findByIdAndUpdate(req.params.id, req.body, {
//         new: true
//     })
//     res.status(200).json(updatedGoals)
// })

module.exports = {  
    getGoals, 
    setGoal,  updateGoals,  deleteGoals
 }