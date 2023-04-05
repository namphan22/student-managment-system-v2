const isLoginByAdmin = async (req,res,next)=>{
    try {
        if(req.session.admin_id ){

        }
        else{
            res.redirect('/admin/login');
        }
        next();
 
        
    } catch (error) {
        console.log('error',error);
        
    }
}
const isLogoutByAdmin = async (req,res,next)=>{
    try {
        if(req.session.admin_id){
            res.redirect('/admin/home')
        }
        next();
    } catch (error) {
        console.log('error',error);
        
    }

}
module.exports = {
    isLoginByAdmin:isLoginByAdmin,
    isLogoutByAdmin:isLogoutByAdmin
}