// Firebase Functions with Nodemailer and Scheduled Cleanup
const {onCall} = require('firebase-functions/v2/https');
const {onSchedule} = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

// Configure email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: 'your-email@gmail.com', // Replace with your actual email
    pass: 'your-email-password'  // Replace with your actual password or use environment variables
  }
});

// Function to send an email
exports.sendEmail = onCall(async (data) => {
  try {
    await transporter.sendMail({
      from: 'Your Name <your-email@gmail.com>', // Replace with your actual email
      to: 'chillupandskillup@gmail.com', // Replace with the recipient email
      subject: `Message from ${data.userName}`,
      text: data.message
    });
    return { message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Unable to send email');
  }
});

// Cleanup Unverified Users Function
exports.cleanupUnverifiedUsers = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago

  try {
    const users = await admin.auth().listUsers();
    const usersToDelete = [];

    for (const userRecord of users.users) {
      try { // Inner try-catch for individual user errors
        const user = await admin.auth().getUser(userRecord.uid);
        if (!user.emailVerified && new Date(user.metadata.creationTime).getTime() < cutoff) {
          usersToDelete.push(user.uid);
        }
      } catch (innerError) {
        console.error(`Error getting user ${userRecord.uid}:`, innerError);
        // Continue to the next user even if there's an error with one.
      }
    }

    if (usersToDelete.length > 0) {
      await admin.auth().deleteUsers(usersToDelete);
      console.log(`Deleted ${usersToDelete.length} unverified users.`);
    } else {
      console.log('No unverified users to delete.');
    }
  } catch (error) {
    console.error('Error cleaning up users:', error);
  }
});