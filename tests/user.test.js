const request = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../src/models/users')
const app = require('../src/app')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Sid',
    email: 'sid@example.com',
    password: '56What!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async() => {
    await User.deleteMany()
    const user = new User(userOne)
    await user.save()
})

test('should sign up a new user', async() => {
    const response = await request(app).post('/users').send({
        name: 'Lamar Davis',
        email: 'lamard@gmail.com',
        password: 'comeonchop'
    }).expect(201)

    //checking if data successfully stored in database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //checking assertions about response
    expect(response.body).toMatchObject({
        user:{
            name: 'Lamar Davis',
            email: 'lamard@gmail.com'
        },
        token: {}
    })
})

test('should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login user does not exist', async() => {
    await request(app).post('/users/login').send({
        email: 'chintu@example.com',
        password: 'chintubhaieh@@'
    }).expect(400)
})

test('should get profile of user', async() => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get profile of user', async() => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete account of user', async() => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete account of user', async() => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

afterAll(() => {
    mongoose.connection.close();
})