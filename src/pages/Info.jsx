import React, { useState } from 'react';
import './Info.css';

const TermsOfService = () => {
  const [showTOS, setShowTOS] = useState(true);

  return (
    <div className="container">
      {showTOS ? (
        <div className="tos-container">
          <div className="tos-content">
            <div className="header">
              <h1>Terms of Service</h1>
              <button onClick={() => setShowTOS(false)} className="toggle-button">
                Switch to Financial Info
              </button>
            </div>
            <p>ToS</p>
          </div>
        </div>
      ) : (
        <div className="payment-info-container">
          <div className="payment-info-content">
            <div className="header">
              <h1>Payment Information</h1>
              <button onClick={() => setShowTOS(true)} className="toggle-button">
                Back to Terms of Service
              </button>
            </div>
            <p>Payment Info</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsOfService;
