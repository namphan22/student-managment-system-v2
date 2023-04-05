
const Course = require('../models/courseModal');
const cloudinary = require('cloudinary').v2;
const uploadVideo = async (req, res,idCouse) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video',
            public_id: 'database-video'

        });
        console.log(result);
        console.log(typeof result)
        const addDetailVideoInfo = await Course.updateOne({_id:'6422f4de650a6ecec6b959aa'},{
            $set:{
                urlvideo:result.secure_url,
                videoInfo:result

            }
        });


        res.status(200).json({ status: 'upload video successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}
module.exports = {
    uploadVideo
}