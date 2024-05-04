const mongoose = require("mongoose")

const ratingschema=  new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
    },
    rating:{
        type:Number,
    },
    review:{
        type:String,
        trim:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
        index:true,
    }

   
})


module.exports = mongoose.model("Rating",ratingschema);