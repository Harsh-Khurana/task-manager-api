const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middlewares/auth');

// GET /tasks?completed=true&limit=10&skip=1&sortBy=createdAt:desc
router.get('/', auth, async(req, res)=>{
    const match = {};
    const sort = {};

    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }

    if(req.query.sortBy){
        const [property, order] = req.query.sortBy.split(':');
        sort[property] = order === 'desc' ? -1 : 1;
    }

    try{
        // const tasks = await Task.find({ owner: req.user._id, completed: req.query.completed })
        // .limit(req.query.limit).skip(req.query.skip).sort({ property: order });
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    }catch(e){
        res.status(500).send();
    }
})

router.get('/:id', auth, async (req, res)=>{
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send();
    }
})

router.post('/', auth, async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send();
    }
})

router.patch('/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdate = updates.every(update=>allowedUpdates.includes(update));

    if(!isValidUpdate){
        return res.status(400).send({ error : 'Invalid Updates!' });
    }

    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
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

router.delete('/:id', auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        
        if(!task){
            res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(400).send();
    }
})

module.exports = router;