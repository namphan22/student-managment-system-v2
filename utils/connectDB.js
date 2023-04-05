const mongoose = require('mongoose');
const dbUrl ="mongodb://localhost:27017/user_managment_system";

const connectDB = async ()=>{
    try {
        await mongoose.connect(dbUrl);
        console.log('Connect to Mongodb successfully');
        
    } catch (error) {
        console.error('Connect fail to Mongodb ',error.message);
        setTimeout(connectDB,5000);
        
    }
}
module.exports= connectDB;