const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/users', async (req, res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(e){
        res.status(500).send();
    }
})

app.get('/users/:id', async (req, res)=>{
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
        console.log(e)
        res.status(500).send();
    }
})

app.get('/tasks', async(req, res)=>{
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    }catch(e){
        res.status(500).send();
    }
})

app.get('/tasks/:id', async (req, res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findById(_id);
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send();
    }
})

app.post('/users', (req, res)=>{
    const user = new User(req.body)
    user.save()
    .then(()=>{
        res.send(user);
    })
    .catch(e=>{
        res.status(400).send(e);
    })
})

app.post('/tasks', (req, res)=>{
    const task = new Task(req.body);

    task.save()
    .then(()=>{
        res.send(task);
    })
    .catch(e=>{
        res.status(400).send(e);
    })
})

app.listen(port, ()=>{
    console.log(`Server started at ${port}`);
})