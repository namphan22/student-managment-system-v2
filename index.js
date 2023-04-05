const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const multer = require('multer')
const path = require('path');
require('dotenv').config();
const uploadCloudinaryController = require('./controllers/uploadVideo')
const connectDB = require('./utils/connectDB');
const connectRedis = require('./utils/connectRedis');

const cloudinary = require('./config/cloudinary');
const userRoute = require('./routes/userRoute');
const courseRoute = require('./routes/courseRoute');
const adminRoute = require('./routes/adminRoute');
const config = require('./config/config');
const app = express();
const bodyParser = require('body-parser');
const { redisClient, RedisStore } = require('./config/redis-config');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: false,
    store: new RedisStore({
        client: redisClient,
    }),
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 6000000//the time expires of cookie is 2 min
    }
}));
const upload = multer({
    storage: multer.diskStorage({})
})
app.post('/upload-video', upload.single('video'),uploadCloudinaryController.uploadVideo)


// for user route
app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use('/course', courseRoute)
app.use('/', courseRoute);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT} port`);
    connectDB();
    connectRedis();

})