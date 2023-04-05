const isLogin = async (req,res,next)=>{
    try {
        if(req.session.user_id){
            
            console.log('đã authenticate')
            
            
        }
        else{
            res.redirect('/');
        }
        next();
        
    } catch (error) {
        
    }
}
const isLogOut = async (req,res,next)=>{
    try{
        if(req.session.user_id){
            console.log(req.sessionID);
            console.log(req.session);
            console.log(req.session.user_id);
            console.log('dã chuyên đến home')
            return res.redirect('/home');
        }
        next();

    }catch(error){
        console.log(error.message);
    }
    
};

module.exports = {
    isLogin:isLogin,
    isLogOut:isLogOut
}