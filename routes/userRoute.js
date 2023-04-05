const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/userController');
// const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const config = require("../config/config");
const auth = require("../middleware/auth");
const storage = require('../utils/uploadMulter');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../public/imageUsers'))
//     },
//     filename: function (req, file, cb) {
//         const name = `${Date.now()}-${file.originalname}`;
//         cb(null, name);
//     }

// });
const upload = multer({ storage: storage });


// ROUTE
userRoute.get('/register', auth.isLogOut, userController.loadRegister);
userRoute.post('/register', upload.single('image'), userController.insertUser);
userRoute.get('/verify', userController.sendMail);
// route for login section
userRoute.get('/login', auth.isLogOut, userController.loadLogin);
userRoute.get('/', auth.isLogOut, userController.loadLogin);
userRoute.post('/login', userController.verifyLogin);
userRoute.get('/home', auth.isLogin, userController.loadHome);

// route for logout section
userRoute.get('/logout', userController.userLogout);

// route for reset password
userRoute.get('/forget-password', auth.isLogOut, userController.loadResetPassword);
userRoute.post('/forget-password', userController.forgetPasswordVerify);
userRoute.get('/reset-password', auth.isLogOut, userController.forgetPasswordIntoMailLoad);
userRoute.post('/reset-password', userController.newPasswordVerify);
userRoute.get('/edit-infor', auth.isLogin, userController.editInfoLoad);
userRoute.post('/edit-infor', upload.single('image'),userController.editInforHandle);
module.exports = userRoute;
