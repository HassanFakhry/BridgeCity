// testUser.js

const admin = require('firebase-admin');

// Use emulator for Auth
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

admin.initializeApp({
  projectId: 'babaclean-c5114',
});

admin.auth().createUser({
  email: 'testuser@example.com',
  emailVerified: false,
  password: 'password123',
})
  .then((userRecord) => {
    console.log('✅ Test user created:', userRecord.uid);
  })
  .catch((error) => {
    console.error('❌ Error creating test user:', error);
  });
