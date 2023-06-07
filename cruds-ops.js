// CRUD Operations in MongoDB

const { MongoClient, ObjectId } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'

// const id = new ObjectId()
// console.log(id);
// console.log(id.getTimestamp());

// MongoClient.connect(connectionURL, {useUnifiedTopology: true}, (error, client) => {
//     if(error){
//         return console.log("Unable to connect with the database");
//     }
//     console.log("Connection Success!");
// })

const client = new MongoClient(connectionURL);
const db = client.db(database);
// db.collection('Roles').insertOne(
//     {
//         _id: id,
//         name: 'Vikram',
//         age: 15
//     }
// ).then((result, error) => {
//     if (error) {
//         console.log('unable to insert');
//     }
//     console.log(result.insertedId);
// })

// db.collection('Roles').insertMany([
//     {
//         name: 'Sibal',
//         age: 81,
//         CEO: true
//     },
//     {
//         name: 'Reddy',
//         age: 18,
//         CEO: false,
//         CTO: true
//     }
// ]).then((result, error) => {
//     if(error){
//         return console.log('unable to insert');
//     }
//     console.log(result.insertedIds);
// })

// db.collection('users').findOne({
//     name: 'sanyam'
// }).then((result, error) => {
//     if(error){
//         return console.log('unable to find the info');
//     }   
//     console.log(result);
// })

// db.collection('users').findOne({
//     _id: new ObjectId("6401b63bfa1a724f1756d4f9")
// }).then((result, error) => {
//     if(error){
//         return console.log('unable to find the info');
//     }   
//     console.log(result);
// })

// db.collection('users').find({
//     age: 27
// }).toArray().then((res) => console.log(res))

// db.collection('users').countDocuments({ age: 25 })
// .then((res) => console.log(res))

// const update = db.collection('users').updateOne({
//     _id: new ObjectId("6401b63bfa1a724f1756d4fa")
// },{
//     $set:{
//         name: "Mike"
//     }
// }).then((res,err) => {
//     if(err){
//         console.log("error");
//     }
//     console.log(res);
// })

// db.collection('users').updateMany({ age: 25 }, {
//     $set:{
//         age: 23
//     }
// }).then((res) => {
//     console.log(res.modifiedCount);
// })

// db.collection('users').deleteMany({
//     age: 37
// }).then((res) => {
//     console.log(res.deletedCount);
// }).catch((err) =>{
//     console.log(err);
// })

db.collection('Roles').deleteOne({
    name: "Vikram"
}).then((res) =>{
    console.log(res.deletedCount);
}).catch((err) => {
    console.log(err);
})
