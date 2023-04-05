const express = require('express');
const courseRoute = express.Router();
const courseController = require('../controllers/courseController');
const User = require('../models/userModal');
const Course = require('../models/courseModal');
const auth = require('../middleware/auth');

// courseRoute.get('/updateCourse',courseController.updateAFieldIntoAllDocument)

courseRoute.get('/user/:userId/courses/:courseId',courseController.EnrollCourseByUser)

courseRoute.get('/addCourses',courseController.InsertCourseData);
courseRoute.get('/mycourse',auth.isLogin,courseController.EnrolledCourseLoad);
courseRoute.get('/learn',auth.isLogin,courseController.learnCourseFromUserSide)
// courseRoute.get('/updateURL',courseController.updateNewFieldOnExsitDocument)
module.exports = courseRoute;