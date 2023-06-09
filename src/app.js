const express = require('express')
require('dotenv').config()
require('./db/mongoose')

const userRouter = require('./routes/User Route')
const taskRouter = require('./routes/Task Route')

const app = express()

// Express middleware

//  code for stripping down the service from servers (below)

// app.use((req, res, next) => {
//     res.status(503).send(`Server Under Maintenance`)
// })   

app.use(express.json())
app.use(userRouter) // integrated our routes in express app 
app.use(taskRouter) 

module.exports = app