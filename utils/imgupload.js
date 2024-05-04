const cloudinary = require("cloudinary");


exports.uploadimage = async (file , folder)=>{
    const options = {folder}
    // if(height){
    //     options.height=height;
    // }
    // if(quality){
    //     options.quality=quality
    // }
    options.resourcs_type="auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options)
}