// send otp
const User = require("../models/User")
const OTP= require("../models/Otp")
const otpgen = require("otp-generator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Profile = require("../models/Profile")
exports.sendotp = async (req,res)=>{
    try{
        const {email} = req.body;
        // check if user exist
        const chechuser = await User.findOne({email});
        if(chechuser){
            return res.status(401).json({
                    successs:false,
                    message:"User already Registered"
            })
        }
        var otp = otpgen.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });

        console.log("otp is" , otp);

        // check unique
         let result = await OTP.findOne({otp:otp});
         while(result){
            var otp = otpgen.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            let result = await OTP.findOne({otp:otp});
         }


         const otppayload = {email,otp};
        //  create entry in db
         const otpbody = await OTP.create(otppayload);

         console.log(otpbody);


         res.status(200).json({
            success : true,
            message:"OTP GEN SUCCESSFULLY",
            data:otp,
         })


    }catch(e){
        return res.status(400).json({
            error :"Something went wrong",
            errorMessage: e,
            message:"OTP NOT GEN"
        })

    }
  
}


exports.signup = async (req,res)=>{
    try{
        const{email  ,
            lastName, 
            firstName,
            password,
            confirmPassword,
            accountType,
            otp,
            } = req.body;
            if(!firstName||!lastName||!password){
                return res.status(403).json({
                    success:false,
                    message:"FILL ALL THE DETAILS"
                })
            }
            if(password!==confirmPassword){
                return res.status(403).json({
                    success: false,
                    message: "PASSWORD DOESN'T MATCH!"
                })
            }

            const existinguser = await User.findOne({email});
            if(existinguser){
                return res.status(403).json({
                    success: false,
                    message: "USER ALREADY REGISTERED"
                })
            }


            const recentotp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
            console.log("RECENT OTP " , recentotp);

            if(recentotp.length==0){
                return res.status(403).json({
                    success: false,
                    message: "OTP NHI MILA"
                })

            }else if(otp!==recentotp[0].otp){
                console.log("recent  otp ->", recentotp[0].otp)
                return res.status(403).json({
                    success:false,
                    message :"INVALID OTP PLEASE TRY AGAIN."
                })
            }
            // Hash pAssword

            const hashedpass = await bcrypt.hash(password,10);
            const profile = await Profile.create({
                gender:null,
                dateofbirth:null,
                about:null,
                conatactnumber:null,
            })
            const user = await User.create({
                firstname:firstName,
                lastname:lastName,
                email,
                accounttype:accountType,
                password:hashedpass,
                confirmpass:confirmPassword,
                additionaldetails:profile._id,
                image:`https://api.dicebear.com/6.x/initials/svg?seed=${firstName}${lastName}`,
            })


           return res.status(200).json({
                success : true,
                message:"SIG UP SUCCESSFULLY",
                user
             })
    }catch(e){
        console.log("internal .........")
        console.log(e)
        return res.status(500).json({error:'Internal Server Error'})
    }
}


exports.login = async (req,res)=>{
    try{


        const{email,password} = req.body;
        if(!email ||!password ){
            return res.status(403).json({
                success:false,
                message:"FILL ALL THE DETAILS"
            })  
        }
        const user = await User.findOne({email}).populate("additionaldetails").exec();
        if(!user){
            return res.status(403).json({
                success:false,
                message:"USER DOESN'T EXIST PLEASE SIGN IN"
            })  

        }
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                accounttype:user.accounttype
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })


            user.token = token;
            user.password = undefined
            const  options = {
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"LOGGED IN SUCCESFULLY",
                user,
                payload

            })

           

        }else{
            return  res.status(400).json
            ({message:"PASSWORD DONOT MATCH",
                     success: false})

        }

    }catch(e){
        console.log('Error in login', e)
        return  res.status(500).send("Server error")
    }
}


exports.changepass = async (req,res)=>{
    
}