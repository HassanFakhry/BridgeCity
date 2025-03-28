import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig'; 
import './Payment.css';

const Payment = ({ onBack2, formData }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'cardNumber':
        setCardNumber(value);
        break;
      case 'expiryDate':
        setExpiryDate(value);
        break;
      case 'cvv':
        setCvv(value);
        break;
      default:
        break;
    }
  };

  const validatePayment = () => {
    const errors = {};
    if (!cardNumber) errors.cardNumber = 'Card number is required.';
    if (!expiryDate) errors.expiryDate = 'Expiry date is required.';
    if (!cvv) errors.cvv = 'CVV is required.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePayment()) {
      const hourlyRate = 40;
      const totalCost = (formData.selectedSlots.length * 0.5) * hourlyRate; // 30-minute slots converted to hours

      try {
        const user = auth.currentUser;
        if (user) {
          // Send all data to appointments collection
          await addDoc(collection(db, 'appointments'), {
            ...formData,  // Data from Scheduling.jsx
            cardNumber,
            expiryDate,
            totalCost,
            userId: user.uid,  // Include the user ID
            timestamp: new Date(),
          });
          console.log('Appointment saved successfully!');

          // Navigate to ThankYou.jsx with data
          navigate('/thank-you');
        } else {
          console.error('No user is currently logged in.');
        }
      } catch (error) {
        console.error('Error saving appointment:', error);
      }
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment Information *incomplete</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={cardNumber}
            onChange={handleChange}
            className="payment-input"
          />
          {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
        </div>
        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="text"
            name="expiryDate"
            value={expiryDate}
            onChange={handleChange}
            className="payment-input"
          />
          {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
        </div>
        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={cvv}
            onChange={handleChange}
            className="payment-input"
          />
          {errors.cvv && <div className="error-message">{errors.cvv}</div>}
        </div>
        <div className="button-group">
          <button type="button" onClick={onBack2} className="nav-button">Back</button>
          <button type="submit" className="nav-button">Submit Payment</button>
        </div>
      </form>
    </div>
  );
};

export default Payment;