const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.get('/', async(req, res)=>{
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    }catch(e){
        res.status(500).send();
    }
})

router.get('/:id', async (req, res)=>{
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

router.post('/', async (req, res)=>{
    const task = new Task(req.body);

    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send();
    }
})

router.patch('/:id', async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdate = updates.every(update=>allowedUpdates.includes(update));

    if(!isValidUpdate){
        return res.status(400).send({ error : 'Invalid Updates!' });
    }

    try{
        const task = Task.findById(req.params.id);
        if(!task){
            return res.status(404).send();
        }
        updates.forEach(update=>task[update] = req.body[update]);
        await task.save();

        res.send(task);
    }catch(e){
        res.status(400).send();
    }
})

router.delete('/:id', async (req, res)=>{
    try{
        const task = await Task.findByIdAndRemove(req.params.id);
        
        if(!task){
            res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(400).send();
    }
})

module.exports = router;