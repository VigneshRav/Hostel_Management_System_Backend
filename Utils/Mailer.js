import nodemailer from "nodemailer";
import dotenv from "dotenv";

//Configuration of dotenv to access the pass mail & pass key
dotenv.config();

//Creating transporter for mail service
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.PASS_MAIL,
    pass: process.env.PASS_KEY,
  },
});

//SendMail function using nodemailer
const sendEmail = (to, subject, body) => {
  const mailOptions = {
    from: process.env.PASS_MAIL,
    to,
    subject,
    body,
  };

  return transporter.sendMail(mailOptions);
};

export default sendEmail;
