require('dotenv').config({ path: '.env.test' });
const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require("../src/math");

test('should calculate total with tip', () => {

    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('Should convert 32 F to 0 C', () => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

test('using async-await for adding two numbers', async() =>{
    const sum = await add(17, 11)
    expect(sum).toBe(28)
})