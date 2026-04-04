const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'yakoubisahar53@gmail.com', 
    pass: process.env.EMAIL_PASS || 'esku ijys truy  brvk'
  }
});

module.exports = transport;