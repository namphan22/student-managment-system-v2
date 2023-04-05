const fs = require('fs');
const User = require('../models/userModal');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const mailer = require('../utils/mailer');
const randomstring = require('randomstring');
const resetPassword = require('../utils/resetPasswordSend');
const path = require('path');
const courseController = require('./courseController');
const mongoose = require('mongoose');
const securityPassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);

    }


}
const loadRegister = async (req, res) => {
    try {
        res.render('users/register', { isLoggedIn: false });

    } catch (error) {
        console.log('error');

    }
}
const insertUser = async (req, res) => {
    try {
        const spassword = await securityPassword(req.body.password);
        const user = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
            password: spassword,
            isAdmin: 0
        });
        // const userData = await user;
        console.log(user);
        if (!user) {

            res.render('users/register', {
                message: 'Your registration has failed'
            });

        } else {
            //  console.log(req.body.firstname,req.body.email,user._id.valueOf());
            mailer.sendverifyEmail(req.body.firstname, req.body.email, user._id);
            res.render('users/register.ejs', {
                message: 'Your registration has been successfully!,Please verify your Email,Check mail right now', isLoggedIn: false
            });
            //  res.render('users/register',{message:'Your registration has failed'});
        }

    } catch (error) {
        console.log(error);

    }
}
const sendMail = async (req, res) => {
    try {
        const updateVerifyMail = await User.updateOne({
            _id: req.query.id
        }, {
            $set: {
                isVerified: 1
            }
        });

        console.log(updateVerifyMail);
        if (updateVerifyMail) {
            res.render('users/email-verified');

        }
    } catch (error) {
        console.log(error.message);

    }

}
const loadLogin = async (req, res) => {
    try {
        const loadLogin = await res.render('users/login', {
            isLoggedIn: false

        });
    } catch (error) {
        console.log('Error', error.message);

    }
}
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        //  const spassword = await securityPassword(req.body.password);
        const userData = await User.findOne({
            email: email
        }); // return first document satisfying with the above condition

        if (userData) {
            const isValidPassword = await bcrypt.compare(password, userData.password);
            console.log(isValidPassword);
            if (isValidPassword) {
                if (userData.isVerified === 0) {
                    res.render('users/login', {
                        message: "Please verify your email,let's Check it righ now", isLoggedIn: true
                    });

                } else {
                    req.session.user_id = userData._id;
                    req.session.user_infor = userData.firstname;
                    console.log('oke');
                    res.redirect('/home');
                }

            } else {
                res.render('users/login', {
                    message: "Your password is incorrect!", isLoggedIn: false
                });
            }

        } else {
            res.render('users/login', {
                message: "Both typed email and passowrd aren't correctly", isLoggedIn: false
            });
        }

    } catch (error) {
        console.log('error', error.message);

    }
}
const loadHome = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        const courseData = await courseController.getAllCourseData();
        // console.log(courseData);
        res.render('users/home', { isLoggedIn: true, user: userData, status: false, course: courseData });

    } catch (error) {
        console.log('error');

    }
}
const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');

    } catch (error) {
        console.log(error.message);

    }
}
const loadResetPassword = async (req, res) => {
    try {
        await res.render('users/forget-password', {
            isLoggedIn: false
        });

    } catch (error) {
        console.log(error.message);

    }
}
const forgetPasswordVerify = async (req, res) => {
    try {
        const incomingEmail = req.body.email;
        const EmailInDatabase = await User.findOne({
            email: incomingEmail
        })
        if (!EmailInDatabase) {
            res.render('users/forget-password', {
                message: 'Please typing a correct gmail!',
                isLoggedIn: false
            })
        } else {
            const randomCode = randomstring.generate({
                length: 14,
                charset: 'alphabetic'
            })
            const updateData = await User.updateOne({ email: incomingEmail }, { $set: { token: randomCode } });
            resetPassword.sendResetPassword(EmailInDatabase.firstname, EmailInDatabase.email, randomCode);
            console.log('đã gửi');
            res.render('users/forget-password', {
                isLoggedIn: false,
                message: "Please check your mail to get a reset password"
            })


        }

    } catch (error) {
        

    }

}
const forgetPasswordIntoMailLoad = async (req, res) => {
    try {
        const token = req.query.token;

        const tokenData = await User.findOne({ token: token });
        if (tokenData) {
            res.render('users/new-password', {
                isLoggedIn: false,
                user_id: tokenData._id
            });


        }
        else {
            res.render('users/404', { message: 'The token is invalid' });
        }


    } catch (error) {
        console.log(error.message);


    }
}
const newPasswordVerify = async (req, res) => {
    try {
        const newPassWord = req.body.newpassword;
        const getUserId = req.body.userId.trim();
        console.log(newPassWord);
        console.log(getUserId);
        const sNewPassWord = await securityPassword(newPassWord);
        const newData = await User.findByIdAndUpdate(getUserId, {
            $set: {
                password: sNewPassWord, token: ''
            }
        })
        if (newData) {
            res.redirect('/login');

        }
    } catch (error) {
        console.log('error', error.message);

    }
}
// edit and update user information
const editInfoLoad = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);
        const userData = await User.findById({ _id: id });
        const courseData = await courseController.getAllCourseData();
        if (userData) {
            res.render('users/home', {
                isLoggedIn: true,
                user: userData,
                status: true,
                course: courseData

            })
        } else {
            res.redirect('/home');
        }


    } catch (error) {

    }

}
const editInforHandle = async (req, res) => {
    try {
        const getId = req.query.id;
        const checkedId = mongoose.Types.ObjectId.isValid(getId);
        console.log(typeof getId);
        console.log(checkedId);
        const { firstname, lastname, email, phone} = req.body;
        const imageId = req.body.imageId;
        // fs.unlinkSync(path.join(__dirname,'../public/imageUsers/imageId'),(err)=>{
        //     if(err)throw err;
        //     console.log('File was deleted!');
        // })

        if (req.file) {
            console.log(req.file);
            const userData = await User.findByIdAndUpdate({ _id: getId }, {
                $set: {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    phone: phone,
                    image: req.file.filename

                }
            })

        } else {
            const userData = await User.findByIdAndUpdate({ _id: getId }, {
                $set: {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    phone: phone

                }
            })
        }
        // if (userData) {
        // res.json({ data: userData });
        res.redirect('/home');
        // } else {
        //     res.render('users/404');
        // }


    } catch (error) {
        console.log('Error', error.message);

    }
}
// render all the users
const getAllUser = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: 0 });
        console.log(users);
        if (users) {
            return users;
        } else {
            return null;
        }

    } catch (error) {
        console.log('error', error);

    }

}
module.exports = {
    loadRegister,
    insertUser,
    sendMail,
    loadLogin,
    verifyLogin,
    loadHome,
    userLogout,
    loadResetPassword,
    forgetPasswordVerify,
    forgetPasswordIntoMailLoad,
    newPasswordVerify,
    editInfoLoad,
    editInforHandle,
    getAllUser
}