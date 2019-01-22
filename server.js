const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const bodyParser = require('body-parser')
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const db = require('./config/keys').mongoURI;
mongoose
.connect(db)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.get('/', (req,res) => res.send('Hello Worlds!'));

//Use routes
app.use('/api/users', users);

app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
