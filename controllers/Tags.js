const Tag = require("../models/Tag")
exports.createTag = async (req,res)=>{
    try{

        const{name,description} = req.body;
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"All Fields are Required"
            })
        }
        const tagdetails = await Tag.create({
            name:name,
            description:description
        })
        
    }catch(e){

        console.log('Error in login', e)
        return  res.status(500).send("Server error")

    }

}



exports.showalltags = async (req,res)=>{
    try{
        const alltags = await Tag.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"Tag Created Succesfully"
        })

    }catch(e){
        console.log('Show all tags', e)
        return  res.status(500).send("Server error").json({
            message:"error in showing tags",
            success:false
        })

    }
}