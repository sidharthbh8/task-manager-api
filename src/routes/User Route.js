const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/users')
const auth = require('../middlewares/auth')

const router = new express.Router()

// app.post('/users', (req, res) => {
//     const user = new User(req.body)
//     user.save().then(() => {
//         res.status(201).send(user)
//     }).catch((e) => {
//         // res.status(400)
//         // res.send(e)
//         res.status(400).send(e)
//     })
// })

// async-await representation of above .then
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// login user credentials
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

// logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send(`User Logged Out from session`)
    } catch (e) {
        res.status(500).send(`some error occured`)
    }
})

// logout all sessions
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send(`All sessions logged out`)

    } catch (error) {
        res.status(500).send(`some error occured`)
    }
})

// app.get('/users', (req,res) => {
//     User.find({}).then((users) => {
//         res.send(users)
//     }).catch((e) => {
//         res.status.send(e)
//     })
// })

// async-await repsentation of the above .then
router.get('/users/me', auth, async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// router.get('/users/:id', (req,res) => {
//     const id = req.params.id
//     User.findById(id).then((user) => {
//         if(!user){
//             res.status(404)
//         }
//         res.send(user)
//     }).catch((e) => {
//         res.status(500).send(e)
//     })
// })

// async-await representation of above .then 
// router.get('/users/:id', async (req,res) => {
//     const id = req.params.id
//     try{
//         const user = await User.findById(id)
//         if(!user){
//             res.status(404).send("not found")
//         }
//         res.status(200).send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdate = ['name', 'email', 'password', 'age'] // contains all the properties that can get updated and exist
    const updates = Object.keys(req.body)   // takes all the data that user provided to update in database and takee the property name that user wanted to update
    const isValid = updates.every((update) => allowedUpdate.includes(update))   // check that all the property that user wanted to upate are there in the allowedUpdate
    try {
        // const user = await User.findByIdAndUpdate(req.params.id)
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!req.user) {
            res.status(404).send('not found')
        }

        if (!isValid) {
            res.status(400).send("property you are updating is not valid")
        }
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user)
        // if(!user){
        //     res.status(404).send("not found")
        // }

        await User.deleteOne({ _id: req.user._id })
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
        console.log(req.user);
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000  // 1Mb
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload Image only'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/me/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user| !user.avatar){ throw new Error('User not found with this Id')}
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    }
    catch (e) {
        res.status(404)
        throw new Error(e)
    }
})

module.exports = router;