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
    await request(app).post('/users').send({
        name: 'Lamar Davis',
        email: 'lamard@gmail.com',
        password: 'comeonchop'
    }).expect(201)
})

test('should login existing user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
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