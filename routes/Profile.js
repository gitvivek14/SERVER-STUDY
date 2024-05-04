const express = require("express")
const router = express.Router();
const {auth} = require("../middlewares/auth")

const{updateDisplayPicture,deleteaccount,getalluserdetails,updateprofile} = require("../controllers/Profile")
// todo - update display picture get enrolled courses


router.delete("/deleteProfile",deleteaccount)
router.put("/updateProfile",auth,updateprofile)
router.get("/getuserdetails",auth,getalluserdetails)

// router.get("/getenrolledcourses",getenrolledcourses);
router.put("/updateDisplayPicture",auth,updateDisplayPicture);


module.exports = router