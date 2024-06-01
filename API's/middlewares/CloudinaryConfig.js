const cloudinary=require('cloudinary').v2//Non Core module of version-2
const multer=require('multer')
const {CloudinaryStorage}=require('multer-storage-cloudinary')
require('dotenv').config()//process.env.EnvironmentVariableName (process is global object in node)
const {env}=require('process')
//Configure Cloudinary
cloudinary.config({
    cloud_name : env.CLOUD_NAME,
    api_key : env.API_KEY,
    api_secret : env.API_SECRET
})
//Configure Cloudinary Storage(Where do you want to store the files in the cloud)
let cloudinaryStorageObj=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        allowedFormats : ['jpeg','jpg','png'],
        folder : "Fresh'O Farm Portal",
        //Adding TimeStamp to each file to prevent file overwriting because multiple users may upload file with same name
        public_id : (req,file)=>`${file.fieldname}-${Date.now()}`
    }
})
//Configure Multer(Where do you want to store the files, filtering the files)
let multerObj=multer({
    storage : cloudinaryStorageObj,
    fileFilter : (req,file,cb)=>{
        fileFormat=['jpeg','jpg','png']
        if(!fileFormat.includes(file.mimetype.split('/')[1])){
            req.statusMessage='Invalid file format'
            return cb(null,false)
        }
        cb(null,true)
    }
})
module.exports=multerObj