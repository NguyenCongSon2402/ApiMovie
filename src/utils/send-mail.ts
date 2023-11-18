import nodemailer from 'nodemailer';
const {EMAIL_URL, EMAIL_PASSWORD} = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_URL,
    pass: EMAIL_PASSWORD,
  },
});

const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const mailOptions = {
    from: EMAIL_URL,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw error;
  }
};

export default sendEmail;
