import React, { useState, useEffect } from 'react';
import { getBookedSlots } from './firebaseConfig';
import { getAuth } from 'firebase/auth';
import './Scheduling.css';
import Payment from './Payment';

const Scheduling = ({ onBack, formData }) => {
  const [date, setDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (date) {
      getBookedSlots(date).then((slots) => setBookedSlots(slots));
    }
  }, [date]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];
  
    if (selectedDate >= today) {
      setDate(selectedDate);
      setSelectedSlots([]); // Clear selected slots when switching dates
      setErrors((prevErrors) => ({ ...prevErrors, date: '' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, date: 'You cannot select a past date.' }));
    }
  };
  
  const handleSlotChange = (slot) => {
    setSelectedSlots((prevSlots) => {
      if (prevSlots.includes(slot)) {
        return prevSlots.filter((item) => item !== slot);
      } else {
        return [...prevSlots, slot];
      }
    });
  };

  const handleConfirm = () => {
    if (!date || selectedSlots.length === 0) {
      setErrors({
        date: !date ? 'Date is required.' : '',
        slots: selectedSlots.length === 0 ? 'At least one time slot must be selected.' : '',
      });
      return;
    }
    setErrors({});
    const appointmentData = {
      ...formData,
      date,
      selectedSlots,
      userId,
      timestamp: new Date(),
    };
    setShowPayment(true); // Directly show Payment after confirming
  };

  const convertTo12HourFormat = (hour, minute) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    let hour12 = hour % 12;
    if (hour12 === 0) hour12 = 12;
    const minuteString = minute === 0 ? '00' : minute;
    return `${hour12}:${minuteString} ${ampm}`;
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = convertTo12HourFormat(hour, minute);
        const endMinute = (minute + 30) % 60;
        const endHour = endMinute === 0 ? hour + 1 : hour;
        const endTime = convertTo12HourFormat(endHour, endMinute);
        times.push(`${startTime}-${endTime}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();
  const isSlotBooked = (slot) => bookedSlots.includes(slot);

  return (
    <div className="scheduling-container">
      {showPayment ? (
        <Payment
          onBack2={() => setShowPayment(false)}
          formData={{ ...formData, date, selectedSlots }}
        />
      ) : (
        <>
          <h2>Schedule Your Appointment</h2>
          <div className="scheduling-form">
            <div className="form-group">
              <label htmlFor="date">Select Date:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={handleDateChange}
                className="scheduling-input"
              />
              {errors.date && <div className="error-message">{errors.date}</div>}
            </div>

            <div className="form-group">
  <label>Select Time Slots:</label>
  <p className="warning-message">
    ⚠️ <strong>Important Notice:</strong> Ensure you give us enough time to clean or, we may be unable to fulfill your request, or additional charges may apply.  
    <a href="/Info" className="warning-link"> See info page for details.</a>
  </p>
  <div className="checkbox-group">
    {timeOptions.map((timeOption) => (
      <div key={timeOption} className={`checkbox-item ${isSlotBooked(timeOption) ? 'disabled-slot' : ''}`}>
        <input
          type="checkbox"
          id={timeOption}
          value={timeOption}
          checked={selectedSlots.includes(timeOption)}
          onChange={() => handleSlotChange(timeOption)}
          disabled={isSlotBooked(timeOption)}
        />
        <label htmlFor={timeOption}>{timeOption}</label>
      </div>
    ))}
  </div>
  {errors.slots && <div className="error-message">{errors.slots}</div>}
</div>



            {selectedSlots.length > 0 && (
              <div className="cost-info">
                <p>Selected Time Slots:</p>
                <ul>
                  {selectedSlots.map((slot, index) => (
                    <li key={index}>{slot}</li>
                  ))}
                </ul>
                <p>Cost: ${selectedSlots.length * 20} for {selectedSlots.length} 30-minute session(s).</p> {/* Updated cost calculation */}
              </div>
            )}

            <div className="button-group">
              <button onClick={onBack}>Back</button>
              <button onClick={handleConfirm}>Confirm</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Scheduling;