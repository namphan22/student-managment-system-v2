const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    password: {
        type: String,
        //required:true
    },
    isAdmin: {
        type: Number,
        required: true,

    },
    isVerified: {
        type: Number,
        default: 0

    },
    token: {
        type: String,
        default: ''
    },
    courses: [{
        courseID: {
            type: mongoose.SchemaTypes.ObjectId,
            refer: 'Course',
            
        },

        registrationDate: {
            type:Date
               
        },
        content:{
            type:Object

        }


    }

    ]


}, { collection: 'users-data' });
const User = mongoose.model('User', userSchema);
module.exports = User;

