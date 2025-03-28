import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './ContactUs.css';
import emailjs from 'emailjs-com';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const ContactUs = () => {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showRateLimiter, setShowRateLimiter] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const RATE_LIMIT_DURATION = 1 * 60 * 1000; // 1 hour in milliseconds

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsLoggedIn(true);
        // Use displayName instead of manually setting username
        setUserName(user.displayName || 'User');
        setUserEmail(user.email || '');

        const lastSentTime = localStorage.getItem('lastSentTime');

        if (lastSentTime) {
          const lastSentDate = new Date(parseInt(lastSentTime, 10));
          const now = new Date();
          const timeElapsed = now - lastSentDate;

          if (timeElapsed < RATE_LIMIT_DURATION) {
            const remainingTime = RATE_LIMIT_DURATION - timeElapsed;
            setTimeLeft(remainingTime);

            const intervalId = setInterval(() => {
              setTimeLeft((prevTime) => {
                if (prevTime <= 1000) {
                  clearInterval(intervalId);
                  setShowRateLimiter(false);
                  return 0;
                }
                return prevTime - 1000;
              });
            }, 1000);

            setShowRateLimiter(true);

            return () => clearInterval(intervalId);
          } else {
            setShowRateLimiter(false);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setUserEmail('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message') {
      setMessage(value);
    } else if (name === 'phone_number') {
      setPhoneNumber(value);
    } else if (name === 'topic') {
      setTopic(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (timeLeft > 0) {
      newErrors.general = 'Please wait before sending another message';
      setErrors(newErrors);
      setShowRateLimiter(true);
      return;
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const templateParams = {
      from_name: userName,
      from_email: userEmail,
      phone_number: phoneNumber,
      topic: topic,
      message: message,
    };
    
    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICEID,
      process.env.REACT_APP_EMAILJS_TEMPLATEID,
      templateParams,
      process.env.REACT_APP_EMAILJS_USERID
    )
    .then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        setSuccessMessage('Message sent successfully!');
        setMessage('');
        localStorage.setItem('lastSentTime', Date.now().toString());
        setTimeLeft(0);
        setShowRateLimiter(false);
      },
      (error) => {
        console.error('FAILED...', error);
        setErrors({ general: 'An error occurred while sending your message. Please try again later.' });
      }
    )
    .finally(() => setLoading(false));    
  };

  if (!isLoggedIn) {
    return (
      <div className="not-logged-in">
        <h1>Please log in to access additional features.</h1>
      </div>
    );
  }

  return (
    <div className="contact-us">
      <Navbar />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <div className="contact-info">
          <p>For immediate assistance, call us at <strong>111-111-111</strong>. Alternatively, send us a message below.</p>
        </div>
        <div className="user-profile">
          <h2>Hello, {userName}</h2>
        </div>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              id="phone_number"
              name="phone_number"
              value={phoneNumber}
              onChange={handleChange}
              className={`form-control ${errors.phone_number ? 'error' : ''}`}
            />
            {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="topic">Topic</label>
            <input
              id="topic"
              name="topic"
              value={topic}
              onChange={handleChange}
              className={`form-control ${errors.topic ? 'error' : ''}`}
            />
            {errors.topic && <span className="error-message">{errors.topic}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={handleChange}
              className={`form-control ${errors.message ? 'error' : ''}`}
              rows="4"
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>
          <button type="submit" className="contact-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.general && <p className="error-message">{errors.general}</p>}
        {showRateLimiter && timeLeft > 0 && (
          <div className="rate-limiter">
            <p>Next message can be sent in:</p>
            <p>{Math.floor(timeLeft / 60000)} minutes {Math.floor((timeLeft % 60000) / 1000)} seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;