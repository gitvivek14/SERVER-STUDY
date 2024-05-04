const { default: mongoose } = require("mongoose")
const {instance} = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailsender = require("../utils/mailsender")



// capture paymnet
// initiate horder

exports.capturepayment =async (req,res)=>{
    // get course and user id
    // validation
    // ordee create and return response
    try{
        const userId= req.user._id
        const {courseId} = req.body;
        if(!userId ||!courseId){
            return res.json({
                success:false,
                message:"Invalid request"
            })
        }
        let course;
        try{
            course  = await Course.findById(courseId);
            if(!course){
                return res.json({
                    message:"INVALID COURSE ID",
                    status:401
                })
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsenrolled.includes(uid)){
                return res.json({
                    message:"STUDENT IS ALREADY ENROLLED",
                    success:false,
                })

            }





        }catch(e){
            console.log("error",e);
            return res.json({
                message:"ERROR IN DB CALL IN PAYMENT",
                success:false,
            })
            
        }


        const amount = course.price;
        const currency = "INR"
        const options = {
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId:courseId,
                userId:userId
            }
        }


        try{
            // initiate order using razorpay
            const paymentresponse = await instance.orders.create(options);
            console.log(paymentresponse)

            return res.status(200).json({
                success:true,
                message:"ORDER CREATED",
                coursename : course.coursename,
                coursedescription:course.coursedescription,
                thumbnail:course.thumbnail,
                orderid:paymentresponse.id,
                currency:paymentresponse.currency,
                amount:paymentresponse.amount



            })


        }catch(e){
            console.log('Error in creating RazorPay Order', e )
            return res.json({
                success:false,
                
                message:"ERROR IN CREATING ORDER"
            })
        }

    }catch(e){
        console.log(e)

    }
}


// verify signature
exports.verifysignature = async (req,res)=>{
    //razorpay webhook activate krega backend se 
    const webhook = "12345678";
    const signature = req.headers("x-razorpay-signature")

// hmac works on top layer of hashing
 const shasum= crypto.createHmac("sha256",webhook);
 shasum.update(JSON.stringify(req.body))
 const digest = shasum.digest("hex");

if(signature===digest){
    console.log("PAYMENT AUTHORIZED")

    const {courseId,userId} = req.body.payload.payment.entity.notes;
    try{
        // fuflfil enrooled

        const enroledcourse = await Course.findOneAndUpdate({_id:courseId},{
            $push:{
                studentsenrolled:userId,
            }
        } , {new:true,})
        if(!enroledcourse){
            return res.status(400).json({
                success:false,
                message:"Course not found"
            })  
        }

        console.log(enroledcourse);

        // find student
        const enrolledstudent = await User.findOneAndUpdate({_id:userId},{
            $push:{
                enroledcourse:courseId
            }
        } , {new:true})

        console.log(enrolledstudent)


        // confirmation mail sent
        const emailresponse = await mailsender(enrolledstudent.email,"CONGRATULATIONS ONBOARDER ON NEW COURSE",
        "CONGRATULATIONS YOU ARE WELCOME")

        console.log(emailresponse)

        return res.status(200).json({
            success:true,
            message:"SIGNATURE VERIFIED STUDENT IS ENROLLED"

        })
        // find course and enroll students
        // done

        

    }
    
    
    catch(e){
        console.error("Error in enrollment", e )
        return  res.status(500).json({success:false,"message":"SERVER"})
    }

}else{
    return  res.status(500).json({success:false,"message":"SIGNATURE INVALID IF BLOCK"})

}




 


}  

