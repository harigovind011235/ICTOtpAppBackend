
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

mongoose.connect(
    "mongodb+srv://harigovind3020:bgIoTHKeInOBaFIP@cluster0.u5yuznl.mongodb.net/otpappdb?retryWrites=true&w=majority"
  );



const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
});

const OTP = mongoose.model('OTP', otpSchema);


// Set up the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'harigovind3020@gmail.com',
    pass: 'yihvztxnuiestuqu',
  },
});


// Generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// Send OTP to the specified email
const sendOTP = (email, otp) => {
  const mailOptions = {
    from: 'harigovind3020@gmail.com',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}`,
  };

  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'OTP sent successfully' });
    }
  });
};


// Route to handle form submission and sending OTP
app.post('/send-otp', (req, res) => {
  console.log(req.body)
  const { email } = req.body;
  const otp = generateOTP();

  const newOTP = new OTP({ email, otp });
  newOTP.save().then((otp) => {
    if (otp) {
      sendOTP(email, otp);
      res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to save OTP' });
    }
  });
});


app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    console.log(email, otp)
    OTP.findOne({ email, otp }).then((foundOTP) => {
      if (!foundOTP) {
        res.status(200).json({ error: 'Invalid OTP' });
      } else {
        res.status(200).json({ message: 'OTP verification successful' });
      }
    });
  });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
