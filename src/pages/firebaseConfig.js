import { initializeApp } from 'firebase/app';
import { getAuth, deleteUser } from 'firebase/auth'; // Importing deleteUser
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

const firebaseConfig = {
  apiKey: "AIzaSyArb3_HVqw2Rfgdl5W7mpxUchbfbTuimec",
  authDomain: "babaclean-c5114.firebaseapp.com",
  projectId: "babaclean-c5114",
  storageBucket: "babaclean-c5114.appspot.com",
  messagingSenderId: "1077863138555",
  appId: "1:1077863138555:web:1fa55a419779e653e05c5e",
  measurementId: "G-7BDWDW6LZD"
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
      if (Array.isArray(data.selectedSlots)) {  // Fix here
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
