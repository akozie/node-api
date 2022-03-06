const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')

// @desc Get goals
// @route GET api/get/goals 
// @access private
const getGoals  = asyncHandler(async (req, res)  => {
    const goals = await Goal.find()

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
       text: req.body.text
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
    goal.remove()
    res.status(200).json({id: req.params.id})
})

module.exports = {  
    getGoals, 
    setGoal,  updateGoals,  deleteGoals
 }