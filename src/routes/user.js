const express = require('express');
const multer = require('multer');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middlewares/auth');
const sharp = require('sharp');

router.post('/', async (req, res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        const token = await user.generateAuthToken();
        return res.status(201).send({ user, token });
    }catch(e){
        res.status(400).send(e);
    }
})

router.post('/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    }catch(e){
        res.status(400).send();
    }
})

router.post('/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(token=>{
            return token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch(e){
        console.log(e)
        res.status(500).send();
    }
})

router.post('/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(e){
        console.log(e)
        res.status(500).send();
    }
})

router.get('/me', auth, async (req, res)=>{
    res.send(req.user);
})

router.patch('/me', auth, async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'a ', 'email', 'password'];
    const isValidUpdate = updates.every(update=>allowedUpdates.includes(update));

    if(!isValidUpdate){
        return res.status(400).send({ error : 'Invalid Updates!' });
    }

    try{
        updates.forEach(update=>req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    }catch(e){
        res.status(400).send();
    }
})

router.delete('/me', auth, async (req, res)=>{
    try{
        await req.user.remove();
        res.send(req.user);
    }catch(e){
        res.status(400).send();
    }
})

const upload = multer({
    limits: {
        fileSize: 1024*1024
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
})

router.post('/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();

    res.send();
}, (error, req, res, next)=>{
    res.status(400).send({ error: error.message })
})

router.delete('/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined;
    await req.user.save();

    res.send();
})

router.get('/:id/avatar', async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-type', 'image/png');
        res.send(user.avatar);
    } catch(e){
        res.status(404).send();
    }
})

module.exports = router;