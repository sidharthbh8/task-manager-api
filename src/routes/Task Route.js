const express = require('express')
const auth = require('../middlewares/auth')
const Task = require('../models/tasks')

const router = new express.Router()

// async-await repsentation of all task model
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.get('/tasks', auth, async (req, res) => {
    try{
        const tasks = await Task.find({owner: req.user._id})
        res.status(200).send(tasks)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id
    try{
        const task = await Task.findOne({ _id:id, owner: req.user._id})
        if(!task){
            res.status(404).send("not found")
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.findById(id).then((task) => {
    //     if(!task){
    //         res.status(404)
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).sendrouter
    // })
})

router.patch('/tasks/:id', auth, async(req, res) => {

    const allowedUpdate = ['description', 'status']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => allowedUpdate.includes(update))
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        if(!task){
            res.status(404).send('not found')
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()

        if(!isValid){
            res.status(400).send('property you trying to update does not exist')
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)

    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            res.status(404).send("not found")
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router