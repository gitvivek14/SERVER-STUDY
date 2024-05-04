const Course = require("../models/Course")
const User = require('../models/User')
const Tag = require("../models/Tag");
const {uploadimage} = require("../utils/imgupload")

// @desc    Get all courses from database. 



exports.createcourse = async (req,res)=>{
    try {
        const{coursename,coursedescription,price,whatyouwilllearn} = req.body;

        const thumbnail = req.files.thumbnailimage;
        if(!coursename||!coursedescription||!price){
            return res.status(400).json({
                success:false,
                message:"Please provide required fields"
            })
        }
        const userid = req.user.id;
        const instructordetails = await User.findOne({_id:userid});
        console.log("instructor details",instructordetails)
        if(!instructordetails){
            return res.status(400).json({
                message:"INSTRUCTOR NOT FOUND"
            })
        }
        // const tagfind = await Tag.findById(tag);
        // if(!tagfind){
        //     return res.status(400).json({
        //         message:"TAG NOT FOUND"
        //     })

        // }
        const thumbnailimageupload = await uploadimage(thumbnail,process.env.FOLDER_NAME);



        // CREATE ENTRY FOR NEW COURSE

        const newcourse = {coursename:coursename,
            coursedescription:coursedescription,
            instructor:instructordetails._id,
            whatyouwilllearn:whatyouwilllearn,
            price:price,
            thumbnail:thumbnailimageupload.secure_url}
           const updatedone =  await Course.create(newcourse);
        // add new course
       const updateduser =  await User.findOneAndUpdate({id: instructordetails._id},{
            $push:{
                courses:newcourse._id
            }
        } , {new:true}).populate("courses").exec()
        res.status(200).json({
            message:"COURSE CREATED SUCCESFULLY",
            success:true,
            newcourse,
            updatedone,
            
            updateduser,
            newcourse_id:newcourse._id
        })
    }catch(e){
        console.error('Error Creating Course', e )
    }
}

exports.showallcourses = async (req,res)=>{
    try{

        const allcourses = await Course.find({},{coursename:true,
        coursedescription:true,
        instructor:true,}).populate("instructor").exec()

        return res.status(200).json({
            success:true,
            message:"DATA FETCHED FOR ALL COURSES",
            data:allcourses,
        })

    }catch(e){
        console.log(`Error Fetching All Courses ${e}`)


    }
}


exports.getcoursedetails = async (req,res)=>{
    try{
        const {courseId} = req.body;
        const coursedetails = await Course.find({_id:courseId}).populate({
            path:'instructor',
            populate:{
                path:"additionaldetails"
            }
        }).populate("category")
        .populate("rating")
        .populate({
            path:"coursecontent",
            populate:{
                path:"subsection"
            }
        })
        .exec();
        if(!coursedetails){
            return res.status(400).json({
                success:false,
                message:`No Data Found for the given Id`
            })
        }
        return res.json({
            success:true,
            message:"Course Details Fetched Successfully.",
            data:coursedetails,
        })
    }catch(e){
        console.error('Error fetching course details ', e)
        return  res.status(500).json({success: false})
    }
}

exports.editCourse = async(req,res)=>{

    try {

        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)
        
        if (!courseId || !updates) {
            console.log("courseId-> " , courseId);
            console.log("updates-> " , updates);

            return res.status(400).json({
              success:false,
              message: "Missing fields" })
        }

        if (!course) {
          return res.status(404004).json({
            success:false,
            message: "Course not found" })
        }
    
        // If Thumbnail Image is found, update it
        if (req.files) {
          console.log("thumbnail update")
          const thumbnail = req.files.thumbnailImage
          const thumbnailImage = await uploadimage(
            thumbnail,
            process.env.FOLDER_NAME
          )
          course.thumbnail = thumbnailImage.secure_url
        }
    
        // Update only the fields that are present in the request body
        for (const key in updates) {
            //this is in additional check
          if (updates.hasOwnProperty(key)) {
            if (key === "tag" || key === "instructions") {
              course[key] = JSON.parse(updates[key])
            } else {
              course[key] = updates[key]
            }
          }
        }
    
        await course.save()
    
        const updatedCourse = await Course.findOne({
          _id: courseId,
        }).populate({
            path: "instructor",
            populate: {
              path: "additionaldetails",
            },
          })
          .populate("category")
          .populate("rating")
          .populate({
            path: "coursecontent",
            populate: {
              path: "subSection",
            },
          }).exec()
          
    
        res.status(200).json({
          success: true,
          message: "Course updated successfully",
          data: updatedCourse,
        })

      }catch(error){
        console.error("Error in editing course flow-> ",error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
        })
      }


};


// const getInstructorCourses = async(req,res)=>{

//     try{

//         const {id} = req.user;

//         const user = await User.findById(id).populate("courses").exec();

//         const userCourses = user.courses;

//         res.status(200).json({
//             success:true,
//             data:userCourses,
//             message:"User Courses fetched",
//         })

//     }catch(err){
//         console.log("Error in get instructor courses flow -> ", err);
//         return res.status(500).json({
//             success:false,
//             message:"Something went wrong, Try again!"
//         })
//     }


// };


// const deleteCourse = async(req,res)=>{

//     try{

//         const {courseId} = req.body;

//         if(!courseId){
//             return res.status(400).json({
//                 success:false,
//                 message:"Missing fields",
//             })
//         }

//         const course = await Course.findById(courseId);

        
//         //unlink courses with categories (pull)
//         const unlinkCategory = await Category.findByIdAndRemove(course.category,{
//             $pull:{
//                 courses:courseId
//             }
//         });

//         //unlink from user.courses
//         const unlinkUser = await User.findById(course.instructor,{
//             $pull:{
//                 courses:courseId
//             }
//         })


//         const deletingCourse = await Course.findByIdAndDelete(courseId);

//         if(deletingCourse === null){
//             return res.status(404).json({
//                 success:false,
//                 message:"Course wasn't found",
//             })
//         }

//         res.status(200).json({
//             success:true,
//             message:"Course Deleted",
//         })

//     }catch(err){
//         console.log("Err in deleting course ->  ", err);
//         return res.status(500).json({
//             success:false,
//             message:"Something went wrong, Please try again!",
//         })
//     }
// };

// const getFullCourseContent = async(req,res)=>{

//     try{

//         const {courseId} = req.body;
//         const {id} = req.user;

//         //validation
//         if(!courseId ||!id){
//             return res.status(400).json({
//                 success:false,
//                 message:"Missing Fields",
//             })
//         };

//         //getting course requested details
//         const theCourse = await Course.findById(courseId).populate({
//             path:"instructor",
//             populate:{
//                 path:"additionalDetails",
//             }
//         }).populate({
//             path:"courseContent",
//             populate:{
//                 path:"subSection"
//             }
//         }).populate("category")
//         .populate("ratingAndReviews")
//         .exec();

//         //validation
//         if(!theCourse){
//             return res.status(400).json({
//                 success:false,
//                 message:"Course not found",
//             })
//         }

//         //getting user's course progress
//         const userCourseProgress = await CourseProgress.findOne({
//             courseID:courseId,
//             userId:id
//         });

//         //validation
//         if(!userCourseProgress){
//             return res.status(400).json({
//                 success:false,
//                 message:"Course Progress for given combination parameters not found"
//             })
//         }

//         //calculating total course Duration
//         let totalCourseDurationSecs = 0;

//         theCourse.courseContent.forEach((section)=>{
//             section.subSection.forEach((subSection)=>{
//                 totalCourseDurationSecs += parseInt(subSection.timeDuration)
//             })
//         })
//         //convertings total duration to desired format
//         const totalDuration = convertSecondsToDuration(totalCourseDurationSecs)

//         //ok response
//         res.status(200).json({
//             success:true,
//             data:{
//                 theCourse,
//                 totalDuration,
//                 courseProgress: userCourseProgress.completedVideos ? 
//                     userCourseProgress.completedVideos 
//                     : 
//                     [],
//             }
//         });


//     }catch(err){
//         console.log("Err in getting full course content->  " , err);
//         return res.status(500).json({
//             success:false,
//             message:"Something went wrong , Try again!",
//         })
//     }

// };

// const markSubSectionComplete = async(req,res)=>{

//     try{

//         const {subSectionId,courseId} = req.body;
//         const {id} = req.user;

//         //validation
//         if(!subSectionId ||!id || !courseId){
//             return res.status(400).json({
//                 success:false,
//                 message:"Missing Fields",
//             })
//         };

//         const updateProgress = await CourseProgress.findOneAndUpdate({
//             courseID:courseId,
//             userId:id
//         },{
//             $push:{
//                 completedVideos:subSectionId
//             }
//         });

//         if(!updateProgress){
//             return res.status(400).json({
//                 success:false,
//                 message:"Course Progress wasn't found"
//             })
//         }

//         res.status(200).json({
//             success:true,
//             message:"Course Progress is updated successfully",
//         })

        


//     }catch(err){
//         console.log("Err in marking lecture complete->  " , err);
//         return res.status(500).json({
//             success:false,
//             message:"Something went wrong , Try again!",
//         })
//     }

// };


// const getInstructorDashboard = async(req,res)=>{

//     try{

//         const {id} = req.user;

//         const instructorCourses = await Course.find({
//             instructor:id
//         });

//         if(!instructorCourses){
//             return res.status(400).json({
//                 success:false,
//                 message:"No courses found for instructor",
//             })
//         }

//         const coursesData = instructorCourses.map((course)=>{

//             const totalStudents = course.studentsEnrolled.length
//             const totalRevenue = totalStudents * course.price

//             const dataWithStats = {
//                 _id: course._id,
//                 courseName: course.courseName,
//                 courseDescription: course.courseDescription,
//                 totalStudents,
//                 totalRevenue,
//             };

//             return dataWithStats;
//         });


//         res.status(200).json({
//             success:true,
//             data:coursesData,
//             message:"Instructor stats fetched"
//         })

//     }catch(err){
//         console.log("Err in getting instructor dashboard page data-> " , err);
//         return res.status(500).json({
//             success:false,
//             message:"Something went wrong , Try again!",
//         })
//     }

// };
