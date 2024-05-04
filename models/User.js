const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,

    },
    password:{
        type:String,
        required:true,
    },
    confirmpass:{
        type:String,
        required:true,
    },
    accounttype:{
        type:String,
        required:true,
        enum:["Admin","Student","Instructor"]
    },
    additionaldetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile"
    },
    token:{
        type:String,
    },
    resetpassexp:{
        type:Date,
    },
    courses:[

        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Courses",
        }
        
    ],
    image:{
        type:String
    },
    courseprogress:[
        {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Courseprogress"
        }

    ]

})


module.exports = mongoose.model("User",userschema);