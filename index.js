const express = require("express")
const app = express()

require("dotenv").config();

const cookiep = require("cookie-parser")
const fileupload = require("express-fileupload")

const userroutes = require("./routes/User")
const paymentroutes = require("./routes/Payment")
const Profileroutes = require("./routes/Profile")
const Courseroutes = require("./routes/Course")


require("./config/database").connect()
require("./config/cloudinary").cloudconnect()

const cors = require('cors')


const port = process.env.port||4000;

app.use(express.json())
app.use(cookiep());
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"./temp"

},
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
  
    next();
  }),
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}))
    
));






// const upload  = require("./routes/FileUpload")
app.use("/api/v1/auth",userroutes);
app.use("/api/v1/profile",Profileroutes);
app.use("/api/v1/payment",paymentroutes);
app.use("/api/v1/course",Courseroutes);

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"YOUR SERVER IS ACTIVATED"
    })
})

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
})