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
            <p>Placeholder TOS Written By ChatGPT - This is not the real TOS: </p>
            Terms of Service

Welcome to [Your Company Name]. By accessing or using our website, mobile application, and services (collectively referred to as the "Service"), you agree to comply with and be bound by these Terms of Service ("Terms"). These Terms govern your use of our Service, and by using the Service, you acknowledge that you have read, understood, and agree to be legally bound by these Terms. If you do not agree to these Terms, you must immediately cease using our Service.

1. Acceptance of Terms

These Terms constitute a legal agreement between you (the "User" or "Customer") and [Your Company Name]. Your continued use of our Service constitutes your acceptance of these Terms and any modifications or updates that may be made to them. We reserve the right to update, modify, or amend these Terms at any time, and it is your responsibility to review them periodically. Any changes will be effective as soon as they are posted on our website or mobile application.

2. Eligibility

You must be at least [minimum age] years old to use our Service. By using our Service, you represent and warrant that you meet the minimum age requirement and have the legal capacity to enter into this agreement. If you are under the age of [minimum age], you may only use the Service with the consent of a parent or guardian.

3. User Accounts and Responsibilities

In order to access certain features of the Service, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account information, including your username and password, and for all activities that occur under your account. You agree to immediately notify [Your Company Name] of any unauthorized use of your account. You also agree to provide accurate and complete information when creating your account and to update that information as necessary to ensure its accuracy.

4. Privacy and Data Protection

Your privacy is important to us. We are committed to protecting your personal information. By using the Service, you agree to the collection, use, and disclosure of your information in accordance with our Privacy Policy, which is incorporated into these Terms by reference. We encourage you to review our Privacy Policy to understand how your data is handled.

5. Use of the Service

You agree to use the Service only for lawful purposes and in accordance with these Terms. You are prohibited from using the Service in any manner that could damage, disable, overburden, or impair the Service or interfere with any other party's use and enjoyment of the Service. You may not attempt to gain unauthorized access to the Service, other accounts, or any computer systems or networks connected to the Service.


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
