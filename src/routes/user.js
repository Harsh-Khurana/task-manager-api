const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(e){
        res.status(500).send();
    }
})

router.get('/:id', async (req, res)=>{
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

router.post('/', async (req, res)=>{
    const user = new User(req.body);

    try{
        await user.save();
        return res.status(201).send(user);
    }catch(e){
        res.status(400).send();
    }
})

router.patch('/:id', async (req, res)=>{
    const update = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidUpdate = update.every(update=>allowedUpdates.includes(update));

    if(!isValidUpdate){
        return res.status(400).send({ error : 'Invalid Updates!' });
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true });
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
        res.status(400).send();
    }
})

router.delete('/:id', async (req, res)=>{
    try{
        const user = await User.findByIdAndRemove(req.params.id);
        
        if(!user){
            res.status(404).send();
        }
        res.send(user);
    }catch(e){
        res.status(400).send();
    }
})

module.exports = router;