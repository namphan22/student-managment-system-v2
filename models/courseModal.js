const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courseSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    lecturer: {
        type: String
    },
    lectureHours: {
        type: Number
    },
    praticeHours: {
        type: Number
    },
    credits: {
        type: Number
    },
    imageCourse:{
        type:String
    },
    urlvideo:{
        type:String
    },
    videoInfo:{
        type: Object
    }

});
const Course = mongoose.model('courses',courseSchema);
module.exports= Course
    