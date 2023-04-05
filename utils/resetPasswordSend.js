const nodemailer = require('nodemailer');

require('dotenv').config();


const sendResetPassword = (firstname, email, token) => {
    try {
        // initialize one transporter object to using STMP protocol with some information which i will include right now.
        const transporter = nodemailer.createTransport({
           
            service: 'gmail',
            auth: {
                user: process.env.myEmail,
                pass: process.env.myPass
            }

        });
        const mailOptions = {
            from: process.env.myEmail,// mail address of sender
            to: email,// mail address of receiver
            subject: 'Reset Password',
            html: ` <p>Hi ${firstname},please click here <a href="http://localhost:3000/reset-password?token=${token}">Reset</a>to reset your password!</p>
            `
        }
        transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
                console.log('Error', error.message);
            }
            else {
                console.log('Email has been sent,Pleack check it', data.response);
            }

        });

    } catch (error) {
        console.log(error.message);

    }


}
module.exports ={
    sendResetPassword:sendResetPassword
}