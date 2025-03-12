import nodemailer from "nodemailer";
import config from "config";

const userEmail = config.get("EMAIL")
const userAppPassword = config.get("Password");

async function sendEmail(emailData) {
    try {
        let transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure: true,
            auth:{
                user: userEmail,
                pass: userAppPassword
            }
        })
        let info = await transporter.sendMail({
          from: `"Syed Omer Ali" ${userEmail}`,
          subject: emailData.subject,
          to: emailData.to,
          html: emailData.html,
          text: emailData.text,
        });
        console.log("Email send", info.messageId);
    } catch (error) {
        console.log(error);
    }
}

export default sendEmail;