import { initializeApp } from 'firebase/app';
import { getAuth, deleteUser } from 'firebase/auth'; 
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  arrayUnion, 
  serverTimestamp 
} from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to save selected slots to Firestore
const saveSlots = async (appointmentData) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      timestamp: serverTimestamp(),
    });
    console.log('Appointment saved successfully.');
  } catch (e) {
    console.error('Error saving appointment:', e);
  }
};

// Function to get booked slots for a specific date
const getBookedSlots = async (date) => {
  try {
    const q = query(collection(db, 'appointments'), where('date', '==', date));
    const querySnapshot = await getDocs(q);

    let bookedSlots = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (Array.isArray(data.selectedSlots)) {
        bookedSlots = [...bookedSlots, ...data.selectedSlots];
      }
    });

    return bookedSlots;
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }
};

// Function to update a selected slot for a user (prevent double booking)
const updateSelectedSlot = async (appointmentId, selectedSlot) => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      slots: arrayUnion(selectedSlot),
    });
    console.log("Slot updated successfully.");
  } catch (error) {
    console.error("Error updating slot:", error);
  }
};

// Function to fetch available slots by filtering out booked slots
const getAvailableSlots = async (date, allSlots) => {
  const bookedSlots = await getBookedSlots(date);
  return allSlots.filter(slot => !bookedSlots.includes(slot));
};

// Function to delete the current authenticated user
const deleteCurrentUser = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently authenticated.");
  }

  try {
    // Deleting the current authenticated user
    await deleteUser(user);
    console.log("User deleted successfully.");
  } catch (error) {
    console.error("Error deleting user:", error.message);
  }
};

export { auth, db, saveSlots, getBookedSlots, updateSelectedSlot, getAvailableSlots, deleteCurrentUser };
