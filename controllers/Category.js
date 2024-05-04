const category = require("../models/Category")
exports.categorypagedetails = async (req,res)=>{
    try{
        // get cat id
        const {categoryId} = req.body;
        const selectedcategory = await category.findById(categoryId).populate("course").exec();
        if(!selectedcategory){
            return res.status(404).json({
                success:false,
                message:"DATA NOT FOUND"
            })
        }
        const diffcategory = await category.find({
            _id:{$ne:categoryId},
        }).populate("course").exec();

        // get top selling course ->>> PENDING
        // get all course regarding id
        // get course for different Cat -: differnet top selling
        return res.status(200).json({
            success:true,
            data:{
                selectedcategory , 
                diffcategory,
            },
        })
    }catch(e){
        return res.status(500).json({
            message:"UNABLE TO FETCH ALL COURSES BASED ON CATEGORY",
            success:false,
        })

    }
}

exports.showallCategories = async (req,res)=>{
    try{
        const allCategorys =await category.find(
            {} , {name:true, description:true}
        );
        res.status(200).json({
            success:true,
            data: allCategorys
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })

    }
}

exports.createCategory = async(req,res)=>{

    try{

        const {name,description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"Missing fields",
            })
        };

        const newCategory = await category.create({
            name:name,
            description:description,
        });


        if(!newCategory){
            return res.status(500).json({
                success:false,
                message:"Error in pushing Category , try again",
            })
        };


        res.status(200).json({
            success:true,
            message:"Category created successfully",
        });

        
    }catch(err){
        console.log("Err in creating category-> ", err);
        return res.status(500).json({
            success:false,
            message:"Soemthing went wrong in creating a category , Try again!",
        })
    }


};