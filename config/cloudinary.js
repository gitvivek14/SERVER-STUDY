const cloudinary = require("cloudinary")
require("dotenv").config()

exports.cloudconnect = ()=>{
    try{
        cloudinary.config({
            cloud_name:process.env.name,
            api_key:process.env.CLOUDINARY_APIKEY,
            api_secret: process.env.CLOUDINARY_SECRET,

        })

    }catch(e){
        console.log("unable to connect to cloudinary")

    }
}