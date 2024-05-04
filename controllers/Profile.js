

const {uploadimage} = require("../utils/imgupload")

const Profile = require("../models/Profile")
const User = require("../models/User")
const mongosoe = require("mongoose")

exports.updateprofile = async (req,res)=>{
    try{
        // get data

        const{dateofbirth="" ,about="",contactnumber="",gender="" } = req.body;
        const id = req.user.id;
        console.log(id);
        if(!contactnumber||!about||!dateofbirth){
            return res.status(400).json({
                message:"fill all details"
            })
        }
        // validate ,
        //  find profile , update profile


        const userdetails = await User.findById({_id:id});

        // const profileid = userdetails.additionaldetails;

        const profiledata = await Profile.findById(userdetails.additionaldetails);
        

        profiledata.dateofbirth = dateofbirth;
        profiledata.gender = gender;
        profiledata.about  = about;
        profiledata.contactnumber= contactnumber ;
        await profiledata.save();
        return res.status(200).json({
            message:"PROFILE UPDATED SUCCESSFULLY",
            success:true,
            profiledata,
        })



    }catch(e){
        // console.log(id);
        console.log('error in updating the profile', e)
        return res.status(500).json({message:'INTERNAL SERVER ERROR'})
    }
}



// delete account
exports.deleteaccount = async (req,res)=>{
    try{
        const id  = req.user.id;

        const userdetails = await User.findById(id);
        if(!userdetails){
            return res.json(500).json({
                error : "User not found",
                message:"UNABLE TO FETCH USER"
            })
        }

        const profileid = userdetails.additionaldetails;

        const profiledata = await Profile.findById(profileid);
        await Profile.findByIdAndDelete({_id:profileid})

        await User.findByIdAndDelete({_id:id});
        // ENROLLED STUDENT BHI KRNE H DELETE
        // CRON JOB
        // SCHEDULE DLEETE REQUEST
        return res.status(200).json({
            message:"PROFILE DELETED SUCCESSFULLY",
            success:true,
            
        })
        
    }catch(e){
        console.log("Error while deleting accoutn ",e )
        return res.status(500).json({message:'INTERNAL SERVER ERROR'}) 

    }
}

exports.getalluserdetails = async (req,res)=>{
    try{
        const id  = req.user.id;
        const userdetails = await User.findById(id).populate("additionaldetails").exec();
        if(!userdetails){
            return res.json(500).json({
                error : "User not found",
                message:"UNABLE TO FETCH USER"
            })
        }


      

        return res.status(200).json({
            message:"USER DATA FETCHED DETAILS SUCCESSFULLY",
            success:true,
            userdetails,
            
        })

    }catch(e){
        console.log('error in get all users', e)
        return res.status(500).json({message:'INTERNAL SERVER ERROR'}) 

    }
}

// todo - update display picture get enrolled courses

exports.updateDisplayPicture = async(req,res)=>{
    try{
        console.log("reached")
        const displayPicture = req.files.displayPicture
        const userId = req.user.id;
        console.log("printing",userId)
        const image = await uploadimage(displayPicture,
            "mycloud")
        console.log(image)

        const updatedprofile  = await User.findByIdAndUpdate({_id:userId},
                                                {image:image.secure_url},
                                                {now:true})

            console.log(updatedprofile)
        // res.send({
        //     success:true,
        //     message:"Profile Updated Successfully"
        // })
        return res.status(200).json({
            message:"USER PROFILE SUCCESSFULLY",
            success:true,
            data:updatedprofile,
            
        })

        




    }catch(e){
        console.log('ERROR IN UPDATING PROFILE', e)
        return res.status(500).json({message:'INTERNAL SERVER ERROR'}) 

    }
}


