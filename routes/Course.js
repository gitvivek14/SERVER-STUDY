const express = require("express")
const router = express.Router();
const {auth , isstudent ,isadmin , isinstructor} = require("../middlewares/auth")


const {createcourse , getcoursedetails ,showallcourses,editCourse} = require("../controllers/Course")

const{categorypagedetails,createCategory,showallCategories} = require("../controllers/Category")
// complete category - > craeate , shwoall

const{createsection,deletesection,updatesection} = require("../controllers/SectionController")

const{createsubsection} = require("../controllers/Subsection")
// UPDATE AND DELETE SUBSECTION
const{createrating,getallrating,getaveragerating} = require("../controllers/Rating");
// const { default: API } = require("razorpay/dist/types/api");


router.post("/createCourse",auth,isinstructor,createcourse)
router.post("/editCourse",auth,isinstructor,editCourse)

router.post("/addsection",auth,isinstructor,createsection);

router.post("/updatesection",auth,isinstructor,updatesection);

router.post("/deletesection",auth,isinstructor,deletesection);
// delete annd update subsection
router.post("/addsubsection",auth,isinstructor,createsubsection);


router.post("/getallcourse",showallcourses);
router.post("/getCourseDetails",getcoursedetails)



                                                                // RATINGS
router.post("/createrating",auth,isstudent,createrating);
router.get("/getaveragerating",getaveragerating);
router.get("/getreviews",getallrating);

                                                                // CATEGORIES
router.post("/createcategory",auth,createCategory);
router.get("/showAllCategories",showallCategories);
router.get("/getcategorypagedetails",categorypagedetails);

module.exports = router;