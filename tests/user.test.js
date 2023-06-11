const request = require('supertest')
const User = require('../src/models/users')
const app = require('../src/app')

const userOne = {
    name: 'Sid',
    email: 'sid@example.com',
    password: '56What!!'
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

const mongoose = require('mongoose')
afterAll(() => {
    mongoose.connection.close();
})