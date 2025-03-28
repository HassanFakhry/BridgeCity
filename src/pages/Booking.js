import React, { useState, useEffect } from 'react';
import Scheduling from './Scheduling';
import Payment from './Payment';
import AddressQuestion from './AddressQuestion';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, auth } from './firebaseConfig'; // Directly import db and auth from firebaseConfig
import './BookingPage.css';

const questions = [
  {
    id: 'name',
    text: 'What is your full name?',
    type: 'text',
  },
  {
    id: 'team',
    text: 'What team would you like?',
    options: ['Red 🔴', 'Blue 🔵', 'Yellow 🟡', 'White ⚪', 'Black ⚫', 'Any team 🎨'],
    type: 'radio',
  },
  {
    id: 'expectations',
    text: 'Please provide a brief understanding of what we should expect:',
    type: 'text',
  },
  {
    id: 'rooms',
    text: 'What rooms do we clean?',
    options: [
      { value: 'Entire House', emoji: '🏠' },
      { value: 'Living Room', emoji: '🛋️' },
      { value: 'Bedroom', emoji: '🛏️' },
      { value: 'Kitchen', emoji: '🍽️' },
      { value: 'Bathroom', emoji: '🚿' },
      { value: 'Dining Room', emoji: '🍽️' },
      { value: 'Office', emoji: '💻' },
      { value: 'Hallway', emoji: '🚪' },
      { value: 'Basement', emoji: '🏡' },
      { value: 'Attic', emoji: '🏠' },
      { value: 'Laundry Room', emoji: '🧺' },
      { value: 'Garage', emoji: '🚗' },
      { value: 'Sunroom', emoji: '🌞' },
      { value: 'Library', emoji: '📚' },
      { value: 'Game Room', emoji: '🎮' },
      { value: 'Guest Room', emoji: '🛌' },
      { value: 'Pantry', emoji: '🥫' },
      { value: 'Mudroom', emoji: '🧤' },
      { value: 'Workshop', emoji: '🔧' },
      { value: 'Closet', emoji: '👗' },
      { value: 'Storage Room', emoji: '📦' },
      { value: 'Gym', emoji: '🏋️' },
      { value: 'Other Room', emoji: '🏠' },
    ],
    type: 'checkbox',
  },
  {
    id: 'squareFootage',
    text: 'Estimated Square Footage of the space to clean:',
    type: 'slider',
    min: 100,
    max: 5000,
    step: 5,
  },
  {
    id: 'pets',
    text: 'Do you have pets?',
    type: 'yesNo',
  },
  {
    id: 'address',
    text: 'Please provide your address:',
    type: 'address',
  },
  {
    id: 'additionalInfo',
    text: 'Any other information you would like to provide?',
    type: 'text',
  },
];

const Booking = () => {
  const [formData, setFormData] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [errors, setErrors] = useState({});
  const [completed, setCompleted] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="not-logged-in">
        <h1>Please log in to access additional features.</h1>
      </div>
    );
  }

  const handleAgree = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'rooms') {
      if (value === 'Entire House') {
        setFormData((prev) => ({
          ...prev,
          [name]: checked ? [value] : [],
        }));
      } else {
        setFormData((prev) => {
          const currentValue = prev[name] || [];
          if (checked) {
            return {
              ...prev,
              [name]: [...currentValue, value].filter((item) => item !== 'Entire House'),
            };
          } else {
            return {
              ...prev,
              [name]: currentValue.filter((item) => item !== value),
            };
          }
        });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'radio' ? value : value,
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const validateAddress = () => {
    const { address } = formData;

    if (!address || !address.street || !address.city || !address.state || !address.zip) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address: 'All address fields are required.',
      }));
      return false;
    }

    const targetZipCode = 97229;
    const inputZipCode = parseInt(address.zip, 10);

    if (Math.abs(inputZipCode - targetZipCode) > 100) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address: 'Sorry, you\'re out of bounds.',
      }));
      return false;
    }

    return true;
  };

  const validateCurrentQuestion = () => {
    const question = questions[currentQuestion];
    let isValid = true;

    if (question.id === 'additionalInfo') {
      return true;
    }

    if (question.type === 'radio' || question.type === 'checkbox') {
      if (!formData[question.id] || (Array.isArray(formData[question.id]) && formData[question.id].length === 0)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [question.id]: 'This field is required.',
        }));
        isValid = false;
      }
    } else if ((question.type === 'number' || question.type === 'text') && !formData[question.id]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [question.id]: 'This field is required.',
      }));
      isValid = false;
    } else if (question.type === 'yesNo' && formData[question.id] === undefined) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [question.id]: 'This field is required.',
      }));
      isValid = false;
    } else if (question.type === 'address') {
      isValid = validateAddress();
    }

    return isValid;
  };

  const handleNext = async () => {
    if (validateCurrentQuestion()) {
      if (currentQuestion === questions.length - 1) {
        setCompleted(true);
        
        // Instead of saving to Firestore, forward the data to the Scheduling component
        setShowScheduling(true); // Show scheduling after booking is complete
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setErrors({});
      }
    }
  };
  

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'radio':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <div className="options-container">
              {question.options.map((option) => (
                <label key={option} className="option-label">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={formData[question.id] === option}
                    onChange={handleChange}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <div className="options-container">
              {question.options.map((option) => (
                <label key={option.value} className="option-label">
                  <input
                    type="checkbox"
                    name={question.id}
                    value={option.value}
                    checked={formData[question.id]?.includes(option.value)}
                    onChange={handleChange}
                    disabled={option.value === 'Entire House' ? false : formData[question.id]?.includes('Entire House')}
                  />
                  {option.value} {option.emoji}
                </label>
              ))}
            </div>
            {formData[question.id]?.includes('Other Room') && (
              <input
                type="text"
                className="text-input"
                name="otherRoom"
                placeholder="Please specify the other room(s)"
                value={formData['otherRoom'] || ''}
                onChange={handleChange}
              />
            )}
            {errors[question.id] && <p className="error-message">{errors[question.id]}</p>}
          </div>
        );
      case 'slider':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <input
              type="range"
              className="range-slider"
              name={question.id}
              min={question.min}
              max={question.max}
              step={question.step}
              value={formData[question.id] || question.min}
              onChange={handleChange}
            />
            <div className="range-label">{formData[question.id] || question.min} sq. ft.</div>
            {errors[question.id] && <p className="error-message">{errors[question.id]}</p>}
          </div>
        );
      case 'yesNo':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <label className="option-label">
              <input
                type="radio"
                name={question.id}
                value="Yes"
                checked={formData[question.id] === 'Yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <label className="option-label">
              <input
                type="radio"
                name={question.id}
                value="No"
                checked={formData[question.id] === 'No'}
                onChange={handleChange}
              />
              No
            </label>
            {formData[question.id] === 'Yes' && (
              <input
                type="text"
                className="text-input"
                name="petDetails"
                placeholder="Please provide details about your pets"
                value={formData.petDetails || ''}
                onChange={handleChange}
              />
            )}
            {errors[question.id] && <p className="error-message">{errors[question.id]}</p>}
          </div>
        );
      case 'text':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <input
              type="text"
              className="text-input"
              name={question.id}
              value={formData[question.id] || ''}
              onChange={handleChange}
            />
            {errors[question.id] && <p className="error-message">{errors[question.id]}</p>}
          </div>
        );
      case 'address':
        return (
          <AddressQuestion
            formData={formData.address || {}}
            handleChange={handleAddressChange}
            setValidateCurrentQuestion={(isValid) => {
              if (isValid) {
                setErrors((prevErrors) => {
                  const { address, ...rest } = prevErrors;
                  return rest;
                });
              } else {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  address: 'All address fields are required.',
                }));
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="booking-container">
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p className="popup-text">By Clicking Agree, You Comply With our Terms Of Service.</p>
            <button onClick={handleAgree}>Agree</button>
          </div>
        </div>
      )}
      <div className={`question-container ${showPopup ? 'hide-questions' : 'show-questions'}`}>
        {!showPopup && !showScheduling && !showPayment && (
          <>
            {currentQuestion < questions.length ? (
              <>
                {renderQuestion(questions[currentQuestion])}
                {errors[questions[currentQuestion].id] && <p className="error-message">{errors[questions[currentQuestion].id]}</p>}
                <div className="navigation-buttons">
                  <button onClick={handlePrevious} disabled={currentQuestion === 0}>
                    Previous
                  </button>
                  <button onClick={handleNext}>
                    {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h2>Booking Complete!</h2>
                <button onClick={() => setShowScheduling(true)}>Proceed to Scheduling</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Show Scheduling component when proceed button is clicked */}
      {showScheduling && !showPayment && (
        <Scheduling
          onBack={() => {
            setShowScheduling(false);
            setCompleted(false);
            setCurrentQuestion(0);
          }}
          formData={formData}
        />
      )}

      {/* Show Payment component when needed */}
      {showPayment && (
        <Payment
          onBack2={() => {
            setShowPayment(false);
            setShowScheduling(true);
          }}
          formData={formData}
        />
      )}
    </div>
  );
};

export default Booking;