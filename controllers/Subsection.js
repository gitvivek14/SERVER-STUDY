const subsection = require("../models/Subsection");
const Section = require("../models/Section")
const uploadvideo = require("../utils/imgupload");
const Subsection = require("../models/Subsection");


exports.createsubsection = async (req,res)=>{
    try{
        const{title,timeduration,description,sectionId} = req.body;
        const video = req.files.videofile;

        if(!sectionId||!timeduration||!description||!title){
            return res.status(400).json({error:"Please provide all required fields"})
        }
        // upload video to cloudinary
        const uploaddetails = await uploadvideo(video,process.env.FOLDER_NAME);
        //
        const subsectiondetails = await subsection.create({
            title:title,
            description:description,
            timeduration:timeduration,
            videourl:uploaddetails.secure_url
        })
       const updatesection =  await Section.findByIDAndUpdate({_id:sectionId},{
        $push:{subsection:subsectiondetails._id},
       },{new:true})
    //    LOG UPDATED SECTION HERE


    return res.status(200).json({
        success:true,
        message:"CREATED SUB-SECTION"
    })



    }catch(e){

    }
}
// UPDATE AND DELETE SUBSECTION

exports.deletesubsection = async (req,res)=>{
    try{ const {subsectionId,sectionId} = req.body;
    
    await Subsection.findOneAndDelete({_id:subsectionId});
    

    return res.status(200).json({
        success:false,
        message:'DELETED SECTON'
    })}catch(e){
        return res.status(400).json({
            success:false,
            message:"undeleted section"
        })
    }
   

}