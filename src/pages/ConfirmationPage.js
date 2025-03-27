import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ConfirmationPage.css';  

const ConfirmationPage = () => {
  const location = useLocation();
  const { verificationMethod, contactInfo } = location.state || { verificationMethod: 'email', contactInfo: '' };
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = () => {
    setResendMessage(`A new verification link has been sent to your ${verificationMethod}.`);
  };

  return (
    <div className="confirmation-page">
      <h1 className="confirmation-title">
        Check Your {verificationMethod === 'email' ? 'Inbox' : 'Phone'}
      </h1>
      <p className="confirmation-message">
        A verification link has been sent to your {verificationMethod}. Please check your {verificationMethod} to complete the registration process.
      </p>
      <p className="contact-info">
        The {verificationMethod} you entered is: <strong>{contactInfo}</strong>
      </p>
      <button onClick={handleResend} className="resend-button">
        Resend Message
      </button>
      {resendMessage && <p className="resend-message">{resendMessage}</p>}
    </div>
  );
};

export default ConfirmationPage;
