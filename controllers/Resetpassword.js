const User = require("../models/User")
const mailsender = require("../utils/mailsender")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
exports.resetpass = async (req,res)=>{
    try{

        const {email} = req.body;
        const user =  await User.findOne({email:email});
        
        if(!user){
            return res.status(401).json({"message":"Invalid Email"})
        }

        const token  = crypto.randomUUID();

        const updatedetails = await User.findOneAndUpdate({email:email},
            {
            token:token,
            resetpassexp:Date.now() + 5*60*1000,
        } ,
        {new:true}
        )
        const url = `http://localhost:3000/update-password/${token}`;
        await mailsender(email,"Password Reset Link",`PASS RESET LINK:${url} `)
        return res.json({
            success:true,
            message:"Reset link sent to your registered mail id",
            updatedetails,
            
        })

    }catch(e){
        console.log(e);
        return res.json({
            success:false,
            message:"ERROR IN RESETTING PASSWORD",
           
        })

    }
}

exports.resetpassfn = async (req,res)=>{
    try{
        const{password,confirmPassword , token } = req.body;

        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:'PASSWORDS DO NOT MATCH'
            })
        }

        const userdetails = await User.findOne({token:token})
        if(!userdetails){
            return res.json({
                success:false,
                message:'NO USER FOUND'
            })

        }
        if(userdetails.resetpassexp < Date.now()){
            return res.status(429).send('Too many requests').json({
                message:"TOKEN EXPIRE",
                success:false,
            });

        }
        const hashedpass = await bcrypt.hash(password,10);   
        await User.findOneAndUpdate({token:token},{
            password:hashedpass
        },{
            new:true
        })
        return res.json({
            success:true,
            message:'PASSWORD CHANGED $ UPDATED'
        })
    }catch(e){
        console.log("Error in updating password:", e);
    }

} 