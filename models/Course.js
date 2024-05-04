const mongoose = require("mongoose")


const courseschema=  new mongoose.Schema({
    coursename:{
        type:String,
        
    },
    coursedescription:{
        type:String,
        required:true,

    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
    },
    whatyouwilllearn:{
        type:String,
        required:true,

    },
    coursecontent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
            required:true,

        }

    ],
   
    rating:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Ratings",
            required:true,
        }
    ],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    category:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
        }
    ],
    tag:{
        type:String,
    },
    studentsenrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }]

})


module.exports = mongoose.model("Courses",courseschema);