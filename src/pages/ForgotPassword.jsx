import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import './ForgotPassword.css';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('If this email has an account, a password reset link has been sent.');
      setError('');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('Error: No account associated with this email address.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setMessage('');
    }
  };

  const handleReturnToRegister = () => {
    navigate('/register'); 
  };

  return (
    <div className="forgot-password-page">
      <h1>Forgot Password</h1>
      <form onSubmit={handleResetPassword} className="forgot-password-form">
        <div className="form-group">
          <label htmlFor="resetEmail">Email</label>
          <input
            type="email"
            id="resetEmail"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="submit-button">Reset Password</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
      <button onClick={handleReturnToRegister} className="return-button">Back</button> {/* Add the Return button */}
    </div>
  );
};

export default ForgotPassword;
