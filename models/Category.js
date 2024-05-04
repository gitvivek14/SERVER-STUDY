const mongoose = require("mongoose")


const categorychema=  new mongoose.Schema({
   name:{
    type:String,
    required:[true,"Please enter a category"]
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

module.exports = new mongoose.model("Category",categorychema);
