const mongoose = require("mongoose")


const tagschema=  new mongoose.Schema({
   name:{
    type:String,
    required:[true,"Please enter a tag"]
   },
   description:{
    type: String,
    default:"No Description"
   },
   course:
   [
      {
    type:mongoose.Types.ObjectId,
    ref:'Courses',
    
   }
],

   
})


module.exports = mongoose.model("Tag",tagschema);