const express = require("express")
const {login,
signup ,
sendotp,
changepass} = require("../controllers/Auth")


const{resetpass , resetpassfn} = require("../controllers/Resetpassword")

const{auth}  = require("../middlewares/auth")

// route for user login
const router = express.Router();

router.post("/login",login);

// for signup
router.post("/signup",signup)

// for sending otp

router.post("/sendotp",sendotp);

// change pass
router.post("/changepass",changepass)

// for gen token
router.post("/reset-password-token",resetpass)

router.post("/reset-password",resetpassfn)


module.exports = router;


