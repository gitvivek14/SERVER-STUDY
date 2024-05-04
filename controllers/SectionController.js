const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createsection = async (req,res)=>{
    try{
        const {sectionname , courseId} = req.body;
        if(!sectionname||!courseId){
            return res.status(400).json({
                success:false,
                message:"FILL ALL THE FIELDS CAREFULLY"
            })
        }
        const newsection = await Section.create({sectionname});
        const updatedcourse = await Course.findByIdAndUpdate(courseId,{
                $push:{
                     coursecontent:newsection._id
                }
            
        },{new:true})

return res.status(200).json({
    message:"FULLY SECTION CREATED",
    success:true,
    updatedcourse,
})
    }catch(e){
        console.log("Error in creating section", e);
        return res.status(400).json({
            message:"FULLY SECTION NOT CREATED",
            success:false,
         
        })

    }
}


exports.updatesection = async (req,res)=>{
    try{

        const {sectionname , sectionId} = req.body;
        if(!sectionname||!sectionId){
            return res.status(400).json({
                success:false,
                message:"FILL ALL THE FIELDS CAREFULLY"
            })
        }

        const section = await Section.findByIdAndUpdate(sectionId,{
            sectionname:sectionname
        },{new:true})
        

    }catch(e){
        return res.status(400).json({
            error : "error deleting the course ",
            message:"ERROR UPDATING"
        })

    }
}


exports.deletesection = async (req,res) =>{
    try{

        // sending id in params
        const {sectionId} = req.params
        await Section.findByIdAndDelete(sectionId);

        // TODO DELETE SOMETHING FROM COURSE
        return res.status(200).json({
            success:true,
            message:"SECTION DELETED SUCCESSFULLY"
        })


    }catch(e){
        return res.status(400).json({
            error : "error deleting the course ",
            message:"ERROR DELETING"
        })

    }
}


