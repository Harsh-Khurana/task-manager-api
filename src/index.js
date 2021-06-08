const express = require('express');
require('./db/mongoose');
const userApi = require('./routes/user');
const taskApi = require('./routes/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userApi);
app.use('/tasks', taskApi);

app.listen(port, ()=>{
    console.log(`Server started at ${port}`);
})