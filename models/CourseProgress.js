const mongoose = require("mongoose")


const coursepschema=  new mongoose.Schema({
   courseId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Courses",

   },
   completedvideos:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subsection",
    }
   ],
   


})


module.exports = mongoose.model("Courseprogress",coursepschema);