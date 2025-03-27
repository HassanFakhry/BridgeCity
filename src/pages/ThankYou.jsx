import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore'; 
import { db } from './firebaseConfig';
import './ThankYou.css';

const ThankYou = () => {
  const location = useLocation();
  const { state } = location;
  const { formData, totalCostLow, totalCostHigh, estimatedHoursLow, estimatedHoursHigh } = state || {};

  useEffect(() => {
    const finalizeBooking = async () => {
      if (formData) {
        try {
          await addDoc(collection(db, 'finalizedBookings'), {
            ...formData,
            totalCostLow,
            totalCostHigh,
            estimatedHoursLow,
            estimatedHoursHigh,
            timestamp: new Date(),
          });
          console.log('Booking finalized successfully!');
        } catch (error) {
          console.error('Error finalizing booking:', error);
        }
      }
    };

    finalizeBooking();
  }, [formData, totalCostLow, totalCostHigh, estimatedHoursLow, estimatedHoursHigh]);

  return (
    <div className="thank-you-wrapper">
      <div className="thank-you-container">
        <h2>Thank You for Your Booking!</h2>
        <p>Your booking has been successfully processed.</p>
      </div>
    </div>
  );
};

export default ThankYou;
