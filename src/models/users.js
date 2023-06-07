const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email!!!')
            }
        }
    },
    password: {
        type:String,
        required: true,
        trim: true,
        validate(value){
            if(value.length<6 || value==='password'){
                throw new Error('Password length cant be less than 6 and shouldnt contain word password')
            }
        }
    },
    age: {
        type: Number,
        validate(value){
            if(value<0){
                throw new Error('Age cant be negative')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer,
    }
})

// middleware mongoose 
// hash the plain text password before saving
userSchema.pre('save', async function(next){

    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// delete all tasks when user delete itself 
userSchema.pre('remove', async function(next){
    const user = this
        await Task.deleteMany({owner: user._id})

    next()
}) 

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email:email })
    if(!user){
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
}

//we are creating a model and giving it a name User
// User variable is a constructor 
const User = mongoose.model('User', userSchema)

module.exports = User