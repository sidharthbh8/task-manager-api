const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
}).then(() => console.log('connected to database'))
.catch((e) => console.log('failed to connect to database'))

//adding documents in collection 

// const me = new User({
//     name: 'Jhonny Shukla',
//     email:'jhonny@sanjubawa.com',
//     password:'1234567',
//     age: 34
// })

// me.save().then(() =>{
//     console.log(me);
// })

// const task = mongoose.model('Tasks', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     status: {
//         type: Boolean,
//         default: false
//     }
// })

//adding tasks document in collection

// const work = new task({
//     description: 'Lawn Moaning',
//     status: true
// })
// work.save().then(() => {
//     console.log(work);
// })