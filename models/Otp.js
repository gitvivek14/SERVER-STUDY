const mongoose = require("mongoose")
const mailsender = require("../utils/mailsender")


const otpchema=  new mongoose.Schema({
   email:{
    type:String,
    required:true,
   },
      
   otp:{
    type: String,
    required:true,
   },

   timestamp:{
    type:Date,
    default:Date.now(),
    expires:5*60
   },
})


async function sendverificationemail(email,otp){
    try{
        const mailresponse = await mailsender(email,"Verification Email from StudyNotion",otp);
        console.log("email sent" , mailresponse); 
    }catch(err){
        console.log(err);
        console.log("send verification failed in otp.js")

    }
}


otpchema.pre("save",async function(next){
    await sendverificationemail(this.email,this.otp);
    next();
})




module.exports = mongoose.model("Otp",otpchema);