const nodemailer = require('nodemailer');
require('dotenv').config();



const sendverifyEmail = (firstname, email, user_id) => {
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
            subject: 'Verify your mail!',
            html: ` <p>Hi ${firstname},please click here <a href="http://localhost:3000/verify?id=${user_id}">Verify</a>to verify your mail!</p>
            <pThis nofitication is fully for testing purpose.Don't worry!</p>
            <p>Best Ragard</p>

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
module.exports = {
    sendverifyEmail: sendverifyEmail
}