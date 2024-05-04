const nodemailer = require("nodemailer")


const mailsender = async (email,title,body)=>{
    try{
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'rvp1378@gmail.com',
                pass: 'atfcchcctyyperib'
            } 
        };
        const transporter = nodemailer.createTransport(smtpConfig);


        let info = await transporter.sendMail({
            from:"StudyNotion -> By vktheBoss",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })


        console.log(info);

        return info;

    }catch(e){
        console.log("email not send ")

    }
}


module.exports = mailsender;