const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

// created a model for storing tasks
// Task variable here works like a constructor
const Task = mongoose.model('Tasks', taskSchema)

module.exports = Task
