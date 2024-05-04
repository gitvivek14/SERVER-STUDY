const jwt = require("jsonwebtoken")
const User = require("../models/User")


require("dotenv").config();

exports.auth = async (req,res,next)=>{
    console.log("before")
    try{
        const token = req.cookies.token||req.body.token||req.header("Authorization").replace("Bearer ","");
        console.log(token)
        if(!token){
            return  res.status(400).json
            ({message:"no tokens",
                     success: false})
        }

        // verify
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log("printing decode",decode);
            req.user  = decode;

        }catch(e){
            return  res.status(401).json
            ({message:"TOKEN INVALID",
                     success: false})

        }

        next();

    }catch(e){
        return  res.status(401).json
        ({message:"TOKEN INVALIDsssss",
                 success: false})

    }

}


exports.isstudent = async (req,res,next)=>{
    try{
        if(req.user.accounttype!=="Student"){
            return res.status(401).json({
                success:false,
                message:"PROTECTED ROUTE FOR STUDENTS"
            })
        }
next()
    }
    catch(e){
       console.log(e);
        
    }
}


exports.isinstructor = async (req,res,next)=>{
    try{
        if(req.user.accounttype!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"PROTECTED ROUTE FOR instructor"
            })
        }


        next()

    }catch(e){
        console.log("mot authorized admin instr")
        
    }
}

exports.isadmin = async (req,res,next)=>{
    try{
        if(req.user.accounttype!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"PROTECTED ROUTE FOR Admin"
            })
        }

    }catch(e){
        console.log("not authorized as admin")
        
    }
}