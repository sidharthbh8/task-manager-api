const Task = require('./src/models/tasks')
require('./src/db/mongoose')


// .then method
Task.findByIdAndRemove({_id:'6410aa7f252f7a225f6d9d95'})
.then((task) => {
    console.log(task);
    return Task.countDocuments({status: false})
}).then((incomplete) => {
    console.log(incomplete)
}).catch((e) => {
    console.log(e);
})


// Async Await Method
const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndRemove({_id: id})
    const completeTasks = await Task.countDocuments({status: true})
    return completeTasks
}

deleteTaskAndCount('64175aeac486eff29db0b7b6')
.then((res) => console.log(res))
.catch((e) => console.log(e))
