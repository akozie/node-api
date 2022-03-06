const express = require('express')
const router  = express.Router()
const {getGoals, setGoal,  updateGoals, deleteGoals}  = require('../controller/goalsController')

router.route('/').get(getGoals).post(setGoal)
router.route('/:id').put(updateGoals).delete(deleteGoals)


module.exports = router