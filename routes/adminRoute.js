const express = require('express');
const adminRoute = express.Router();
const  session = require('express-session');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const bodyParser = require('body-parser');
const config = require('../config/config');
const authenticatByAdmin = require('../middleware/authenticate-admin');
adminRoute.use(bodyParser.json());

adminRoute.use(bodyParser.urlencoded({ extended: true }));


adminRoute.get('/login',authenticatByAdmin.isLogoutByAdmin,adminController.adminLoginLoad)
adminRoute.get('/home',authenticatByAdmin.isLoginByAdmin,adminController.adminHomeLoad);
adminRoute.post('/login',adminController.verifyLoginByAdmin);
adminRoute.get('/logout',adminController.logoutByAdmin);
adminRoute.get('/edit-user/:id',adminController.EditInfoUserLoad);
adminRoute.post('/edit-user/:id',adminController.editInfoUserByAdmin);
adminRoute.get('/delete-user/:id',adminController.deleteUserByAdmin);
adminRoute.get('/export-users-pdf',adminController.exportUsersPdf);
adminRoute.get('/export-html',adminController.exportHtmlLoad)
module.exports = adminRoute;