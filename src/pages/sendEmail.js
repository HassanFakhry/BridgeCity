const nodemailer = require('nodemailer');

// Configure the transporter with your email service
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other email services too
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password', // Replace with your email password or app-specific password
  },
});

const sendMail = async (req, res) => {
  const { message, userName } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@gmail.com', // The email you want to send the message to
    subject: `Message from ${userName}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error sending email' });
  }
};

module.exports = sendMail;
