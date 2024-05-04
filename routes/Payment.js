const express = require("express")
const router = express.Router();
const {auth , isstudent ,isadmin , isinstructor} = require("../middlewares/auth")

const{capturepayment,verifysignature} = require("../controllers/Payment")

router.post("/capturepayment",auth,isstudent,capturepayment);
router.post("/verifysignature",verifysignature);

module.exports = router
