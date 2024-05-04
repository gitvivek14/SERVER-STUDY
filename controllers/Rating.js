const Rating = require("../models/Rating")
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");


exports.createrating = async (req,res)=>{
    try{
        const  userid= req.user.id;
        const{rating,courseId,review} = req.body;

        // get user id :: course id

        const  coursedetails = await Course.findOne({_id:userid ,studentsenrolled:{$elemMatch:{$eq:userid}} });
        if(!coursedetails){
            return res.status(400).json({
                success:false,
                message:"USER NOT ENROOLLED"
            })
        }
        const alreadyreview  = await Rating.findOne({
            user:userid,
            course:courseId,
        })
        if(alreadyreview){
            return  res.json({
                success:false,
                message:"ALREADY REVIEWD"
            })
        }


        const ratingreview = await Rating.create({
            rating,review,course:courseId,user:userid
        })

        const updatedcourse = await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                rating:ratingreview._id,
            }
        },{new:true})

        console.log(updatedcourse)

        return res.status(200).json({
            success:true,
            message:"RATINGS DONE",
            
            ratingreview
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"CANMOT REVIEW THE COURSE"
        })


    }
}


exports.getaveragerating = async (req,res)=>{
    try{
        // get course id
        const courseId = req.body.courseId;
        // calculate avg rating

        const result = await Rating.aggregate([
            {
                $match:{
                    // converting from string to object id
                    course:new mongoose.Types.ObjectId(courseId)
                },
               
            },{
                $group:{
                    _id:null,
                    averagerating:{$avg:"$rating"},
                }
            }
        ])


        if(result.length>0){
            return res.status(200).json({
                success:true,
                averagerating:result[0].averagerating,
            })
        }
        return res.status(200).json({
            success:true,
            averagerating:0,
            message:"AVERAGE RATING IS ZERO"
        })


        
        // return average rating
    }catch(e){
        return res.status(400).json({
            success:false,
          
            message:" UNABLE TO FETCH AVERAGE RATING "
        })
    }
}


exports.getallrating = async (req,res)=>{
    try{
        const allreview = await Rating.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select:"firstname  lastname image email" 
        })
        .populate({
            path:"course",
            select:"coursename"
        })
        .exec();


        return res.status(200).json({
            success:true,
            message:"FETCHED ALL REVIEWS ",
           data: allreview,
        })
    }catch(e){
        return res.status(400).json({
            success:false,
          
            message:" UNABLE TO FETCH all RATING "
        })
    }
}