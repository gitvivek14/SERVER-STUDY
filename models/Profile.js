const mongoose = require("mongoose")


const profileschema=  new mongoose.Schema({
    gender:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    dateofbirth:{
        type:String,
    },
    contactnumber:{
        type:Number,
    }
})


module.exports = mongoose.model("Profile",profileschema);