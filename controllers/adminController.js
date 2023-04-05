const User = require('../models/userModal');
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');
const ejs = require('ejs');
const fs = require('fs');
const puppeteer = require('puppeteer')
const path = require('path');
const adminHomeLoad = async (req, res) => {
    try {
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }
        let page = 1;
        let limit = 6;
        if (req.query.page) {
            page = req.query.page;
        }
        // const allUsers = await userController.getAllUser();
        const allUsers = await User.find({
            isAdmin: 0,
            $or: [{
                firstname: {
                    $regex: '.*' + search + '.*', $options: 'i'

                }

            }]
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();


        const countAllStudent = await User.find({
            isAdmin: 0,
            $or: [{
                firstname: {
                    $regex: '.*' + search + '.*', $options: 'i'

                }

            }]

        })
            .countDocuments();
        const getVerified = await User.countDocuments({ isVerified: 1 })

        res.render('admin/home', {
            AllUsersData: allUsers,
            modalEnabled: false,
            totalStudent: countAllStudent,
            totalVerifiedAccount: getVerified,
            totalPages: Math.ceil(countAllStudent / limit),
            currentPage: page
        });
    } catch (error) {
        console.log('error', error.message);

    }
}
const adminLoginLoad = async (req, res) => {
    try {
        res.render('admin/login', { isLoggedIn: false });

    } catch (error) {
        console.log('error', error.message);
    }

}
const verifyLoginByAdmin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminData = await User.findOne({ email: email, isAdmin: 1 });
        if (adminData) {
            const passwordCompare = await bcrypt.compare(password, adminData.password);
            console.log(passwordCompare);
            if (passwordCompare) {
                if (adminData.isAdmin === 1) {
                    req.session.admin_id = adminData._id;
                    req.session.save((error) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log('Session saved into Redis ');
                        }

                    });
                    console.log('admin have been connected ');
                    res.redirect('/admin/home');

                } else {
                    res.render('admin/login', { message: "You didn't allow to admin account!", isLoggedIn: false })
                }
            } else {
                res.render('admin/login', { message: `Your typed password is incorrect!,Please remember it one more!`, isLoggedIn: false })

            }


        } else {
            res.render('admin/login', { message: `Both email and password aren\'t correct!Please try again.`, isLoggedIn: false })
        }

    } catch (error) {
        console.log('error', error);

    }

}
const logoutByAdmin = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin/login');
    } catch (error) {
        console.log('error', error.message);

    }
}
const EditInfoUserLoad = async (req, res) => {
    try {
        const id = req.params.id;
        const userInfo = await User.findById(id);
        const allUsers = await userController.getAllUser();
        const getVerified = await User.countDocuments({ isVerified: 1 });
        const countAllStudent = await User.countDocuments();
        if (userInfo && allUsers) {
            res.render('admin/home', { AllUsersData: allUsers, admin: userInfo, modalEnabled: true, totalVerifiedAccount: getVerified, totalStudent: countAllStudent ,totalPages:2,currentPage:1})


        }

    } catch (error) {

    }



}
const editInfoUserByAdmin = async (req, res) => {
    try {
        const idInfo = req.params.id;
        console.log(idInfo);
        const updateInfo = await User.findByIdAndUpdate({ _id: idInfo }, {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone

            }
        });
        if (updateInfo) {
            res.redirect('/admin/home');
        }

    } catch (error) {
        console.log(error.message);

    }


}
const deleteUserByAdmin = async (req, res) => {
    try {
        const idUser = req.params.id;
        const data = await User.findByIdAndRemove(idUser);
        if (data) {
            console.log(data);
            res.redirect('/admin/home');
        }

    } catch (error) {

    }
}
const exportUsersPdf = async(req, res) => {
    try {
        const filepath = path.join(__dirname,'../views/admin/htmltopdf.ejs');
        const allUserDatas = await User.find({ isAdmin: 0 });
        let browser ='';
        (async () => {
            browser = await puppeteer.launch()
            const page = await browser.newPage()
            const html = await ejs.renderFile(filepath,{AllUsersData:allUserDatas});
         

            await page.setContent(html);
            
            const buffer = await page.pdf({ format: 'A4', path: path.join(__dirname,'../public/export/export.data.pdf'), printBackground: true, });
            res.contentType("application/pdf");
            res.send(buffer);
          


           
        })().catch(err=>{
            console.error(err);
            res.sendStatus(500);
        }).
        finally(()=>{browser.close()})

    } catch (error) {
        console.log(error.message)


    }
}
const exportHtmlLoad = async (req, res) => {
    try {
        const allUserDatas = await User.find({ isAdmin: 0 });
        res.render('admin/htmltopdf', { AllUsersData: allUserDatas });

    } catch (error) {

    }
}
module.exports = {
    adminHomeLoad,
    adminLoginLoad,
    verifyLoginByAdmin,
    logoutByAdmin,
    EditInfoUserLoad,
    editInfoUserByAdmin,
    deleteUserByAdmin,
    exportUsersPdf,
    exportHtmlLoad

}