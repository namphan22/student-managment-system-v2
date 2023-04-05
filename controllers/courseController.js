const { response } = require('express');
const Course = require('../models/courseModal');
const User = require('../models/userModal');
const myFindAsync = require('../utils/findAsync');
const courseData = [{
    title: "Cấu trúc dữ liệu và giải thuật",
    description: "Học về LinkedList,Stack,Queue,HashTable,và các thuật toán sắp xếp và tìm kiếm...",
    lecturer: "No name",
    lectureHours: 15,
    praticeHours: 8,
    credits: 2,
    imageCourse: 'DSA.png'
},
{
    title: "Lập trình hướng đối tượng",
    description: "Tìm hiểu về các khái niệm class, object, các tính chất như trừu tượng, kế thừa, đa hình, đóng gói...",
    lecturer: "No name",
    lectureHours: 20,
    praticeHours: 3,
    credits: 2,
    imageCourse: 'OPP.png'
}
]


const InsertCourseData = async (req, res) => {

    try {
        const coursedata = await Course.insertMany(courseData);

        if (courseData) {
            res.status(200).json({
                data: courseData
            })
        } else {
            res.json({
                status: fail,
                data: "null"
            });
        }

    } catch (error) {
        console.log('error', error.message);

    }

}
const getAllCourseData = async (req, res) => {
    try {
        const AllCourseData = await Course.find({});
        console.log(typeof AllCourseData);
        if (AllCourseData) {
            return AllCourseData;
        }
        else {
            return null;

        }
    } catch (error) {
        console.log('error', error.message);

    }
}
const EnrollCourseByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const courseId = req.params.courseId;

        const UserData = await User.findById({ _id: userId });
        const courseData = await Course.findById({ _id: courseId });
        console.log(courseData);

        if (!UserData || !courseData) {
            res.status(404).json({ message: 'Not found a student id or course id' })
        }
        if (!UserData.courses.find(course => course.courseID == courseId)) {
            UserData.courses.push({
                courseID: courseData._id,
                registrationDate: new Date(),
                content: courseData

            })
            const result = await UserData.save();
            // res.status(200).json({
            //     data: result
            // })
            res.redirect('/home');



        }
        res.status(404).json({ message: 'you probably enrolled this course!' });




    } catch (error) {
        console.log(error.message);

    }


}
const updateAFieldIntoAllDocument = async (req, res) => {
    try {
        console.log('updating a new field into all documents')
        const updateResult = await User.updateMany({}, {
            $push: {
                courses: {
                    courseID: '6422f4838c0ec4ba08795c4c',
                    registrationDate: Date.now()

                }


            }
        })
        res.status(200).json({ status: updateResult });

    } catch (error) {
        console.log(error.message);

    }

}
const EnrolledCourseLoad = async (req, res) => {
    try {
        const userId = req.query.userId;
        const userEnrolledCourse = await User.findById({ _id: userId });
        // res.json({
        //     id:userId,
        //     userEnrolledCourseDate:userEnrolledCourse
        // })
        res.render('users/mycourse', { courses: userEnrolledCourse.courses, idUserEnrolled: userEnrolledCourse._id })

    } catch (error) {
        console.log(error.message)
    }
}
const updateNewFieldOnExsitDocument = async (req, res) => {
    try {
        console.log('updating a new file ');

        const updateNewField = await Course.updateOne({ _id: '6422f4838c0ec4ba08795c4d' }, {
            $set: {
                urlvideo: 'https://res.cloudinary.com/dgruzqhvg/video/upload/v1680523375/opp-video.mp4'

            }
        });
        console.log(updateNewField);
        if (updateNewField) {
            res.status(200).json({ status: success, dataCourseURL: updateNewField.urlvideo });
        } else {
            res.status(500).json({ status: error });
        }

    } catch (error) {
        console.error(error.message);

    }



}
const learnCourseFromUserSide = async (req, res) => {
    try {
        const userId = req.query.userId;
        const courseId = req.query.courseId;

        console.log('user Id', userId);
        console.log('course Id', courseId);
        const CourseEnrolledUser = await User.findById({ _id: userId });
        console.log(CourseEnrolledUser.courses);
        const CourseEnrolledData = CourseEnrolledUser.courses.find(course => course.courseID == courseId);
        console.log(CourseEnrolledData.registrationDate);
        // const courseEnrolledData = await myFindAsync(CourseEnrolledUser.courses,course=>course.courseID=== courseId);
        if(CourseEnrolledData){
            res.render('users/learnEnrolledCourse',{courseEnrolled:CourseEnrolledData});
        
        }



    } catch (error) {
        console.log(error);

    }

}

module.exports = {
    InsertCourseData,
    getAllCourseData,
    EnrollCourseByUser,
    updateAFieldIntoAllDocument,
    EnrolledCourseLoad,
    updateNewFieldOnExsitDocument,
    learnCourseFromUserSide
}