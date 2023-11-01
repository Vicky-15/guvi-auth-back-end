import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
configDotenv();

// we using *service* called gmail, it requierd step verification enabled in gmail account and create app password and provide it as *auth* info
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.nodemailer_user,
    pass: process.env.nodemailer_pass,
  },
});

const sendMail = async (toEmail = "", subject = "", content = "") => {
  // we made this options as per th documentation field names
  const mailOption = {
    from: process.env.nodemailer_user,
    to: toEmail,
    subject: subject,
    // text: "Plaintext version of the message",
    html: content,
  };

  // passing the options to already created transporter and fetching result or error
  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log("mail sending error", error);
    } else {
      console.log("mail sending info", info.response);
    }
  });
};

export default sendMail;
