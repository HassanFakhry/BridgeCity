import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { updateProfile } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './Register.css';

const Register = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('register');
  const [countdown, setCountdown] = useState(300);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [scheduledCleans, setScheduledCleans] = useState([]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelCleanId, setCancelCleanId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setLoggedIn(true);
          localStorage.setItem('loggedIn', 'true');
          document.body.classList.add('logged-in');
          fetchScheduledCleans(user);
        } else {
          setLoggedIn(false);
          localStorage.removeItem('loggedIn');
          document.body.classList.remove('logged-in');
        }
      } else {
        setLoggedIn(false);
        localStorage.removeItem('loggedIn');
        document.body.classList.remove('logged-in');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchScheduledCleans = async (user) => {
    if (user) {
      const q = query(collection(db, 'appointments'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const cleans = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setScheduledCleans(cleans);
    }
  };

  useEffect(() => {
    let timer;
    if (currentStep === 'verify') {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            const user = auth.currentUser;
            if (user && !user.emailVerified) {
              deleteUser(user)
                .then(() => {
                  setCurrentStep('register');
                  setError('Verification time expired. Please register again.');
                  localStorage.removeItem('loggedIn');
                  setLoggedIn(false);
                })
                .catch((err) => {
                  setError(err.message);
                });
            }
            clearInterval(timer);
            return 300;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
  
    return () => {
      clearInterval(timer);
    };
  }, [currentStep]);

  useEffect(() => {
    if (verificationSent && currentStep === 'verify') {
      const checkVerification = setInterval(async () => {
        const user = auth.currentUser;
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            setRegistrationSuccess(true);
            setCurrentStep('success');
            clearInterval(checkVerification);
            setSuccessMessage('Email verified successfully! You can now log in.');
            setTimeout(() => {
              setCurrentStep('register');
              setIsRegistering(false);
            }, 3000);
          }
        }
      }, 1000);
      return () => clearInterval(checkVerification);
    }
  }, [verificationSent, currentStep]);

  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        setRegistrationSuccess(false);
        setCurrentStep('register');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');
    if (isRegistering) {
      setFormData({ ...formData, [name]: value });
    } else {
      setLoginData({ ...loginData, [name]: value });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        // Update user profile with username
        await updateProfile(user, {
          displayName: formData.username
        });

        await sendEmailVerification(user);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ username: formData.username, email: formData.email }));
        setVerificationSent(true);
        setSuccessMessage('Account successfully created! Please verify your email.');
        setCurrentStep('verify');
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        setErrors({});
      } catch (error) {
        setError(error.message);
        setErrors({});
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length === 0) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
        if (userCredential.user.emailVerified) {
          setLoggedIn(true);
          localStorage.setItem('loggedIn', 'true');
          setSuccessMessage('Login Successful!');
          setLoginData({ email: '', password: '' });
          setErrors({});
          fetchScheduledCleans(userCredential.user);
        } else {
          setError('Please verify your email before logging in.');
        }
      } catch (error) {
        setError(error.message);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    setLoggedIn(false);
    navigate('/');
  };

  const handleDeleteAccount = () => {
    alert("To delete your account, please contact our support team by visiting the Contact Us page or call us at 1-800-123-4567. Note: Deleting your account will not cancel any scheduled cleanings, and all payments will still need to be paid.");
  };

  const handleCancel = (cleanId) => {
    setCancelCleanId(cleanId);
    setShowCancelPopup(true);
  };

  const confirmCancel = async () => {
    const clean = scheduledCleans.find((clean) => clean.id === cancelCleanId);
    const cleanDate = new Date(clean.date);
    const currentDate = new Date();
    const timeDifference = cleanDate.getTime() - currentDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    if (daysDifference <= 2) {
      alert('Cancellation within 2 days of the cleaning will incur a full charge.');
    } else {
      alert('A cancellation fee will apply.');
    }

    try {
      await deleteDoc(doc(db, 'appointments', cancelCleanId));
      setScheduledCleans(scheduledCleans.filter((clean) => clean.id !== cancelCleanId));
      setShowCancelPopup(false);
      setCancelCleanId(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const closeCancelPopup = () => {
    setShowCancelPopup(false);
    setCancelCleanId(null);
  };

  const renderScheduledCleans = () => {
    if (scheduledCleans.length === 0) {
      return (
        <div className="scheduled-cleans-container">
          <p>You have no scheduled cleans.</p>
        </div>
      );
    }

    return (
      <div className="scheduled-cleans-container">
        <div className="scheduled-cleans-grid">
          {scheduledCleans.map((clean, index) => (
            <div 
              key={clean.id} 
              className={`scheduled-clean ${index === 0 ? 'first-clean' : ''}`}
            >
              <h4>{clean.name || `Cleaning Appointment (${clean.date})`}</h4>
              <div className="clean-details">
                <p><strong>Date:</strong> {clean.date}</p>
                <p><strong>Time:</strong> {Array.isArray(clean.selectedSlots) ? clean.selectedSlots.join(', ') : 'N/A'}</p>
                <p><strong>Team:</strong> {clean.team}</p>
                <p><strong>Square Footage:</strong> {clean.squareFootage}</p>
                <p><strong>Estimated Cost:</strong> ${clean.totalCost}</p>
                <p><strong>Address:</strong></p>
                {clean.address ? (
                  <ul>
                    <li>{clean.address.street}</li>
                    <li>{clean.address.city}, {clean.address.state} {clean.address.zip}</li>
                  </ul>
                ) : (
                  <p>N/A</p>
                )}
                <p><strong>Rooms:</strong> {clean.rooms ? clean.rooms.join(', ') : 'N/A'}</p>
                {clean.pets && <p><strong>Pets:</strong> {clean.pets}</p>}
                {clean.additionalInfo && (
                  <p><strong>Additional Info:</strong> {clean.additionalInfo}</p>
                )}
                {clean.expectations && (
                  <p><strong>Expectations:</strong> {clean.expectations}</p>
                )}
              </div>
              <button
                onClick={() => handleCancel(clean.id)}
                className="cancel-button"
              >
                Cancel Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (currentStep === 'verify' && countdown > 0) {
        const user = auth.currentUser;
        if (user) {
          deleteUser(user)
            .then(() => {
              signOut(auth);
              localStorage.removeItem('loggedIn');
              localStorage.removeItem('user');
              setLoggedIn(false);
              navigate('/');
            })
            .catch((error) => {
              console.error('Error deleting user:', error);
            });
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate, currentStep, countdown]);

  return (
    <div className="register-page">
      <Navbar />
      <div className="register-container">
        <h1 className="register-title">
          {loggedIn 
            ? 'Your Dashboard' 
            : currentStep === 'register'
              ? isRegistering
                ? 'Create an Account'
                : 'Log In'
              : 'Check Your Email'}
        </h1>
        {registrationSuccess && <p className="success-message">{successMessage}</p>}
        
        {!loggedIn ? (
          <>
            <div className="register-toggle">
              {currentStep === 'register' && (
                <>
                  <button
                    onClick={() => {
                      setIsRegistering(true);
                      setErrors({});
                      setError('');
                    }}
                    className={`toggle-button ${isRegistering ? 'active' : ''}`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      setIsRegistering(false);
                      setErrors({});
                      setError('');
                    }}
                    className={`toggle-button ${!isRegistering ? 'active' : ''}`}
                  >
                    Log In
                  </button>
                </>
              )}
            </div>
            
            {currentStep === 'register' ? (
              isRegistering ? (
                <form onSubmit={handleRegisterSubmit} className="register-form">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`form-control ${errors.username ? 'error' : ''}`}
                    />
                    {errors.username && <span className="error-message">{errors.username}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-control ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ${errors.password ? 'error' : ''}`}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </div>
                  <button type="submit" className="submit-button">
                    Register
                  </button>
                  {error && <span className="error-message">{error}</span>}
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="register-form">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleChange}
                      className={`form-control ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleChange}
                      className={`form-control ${errors.password ? 'error' : ''}`}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>
                  <button type="submit" className="submit-button">Log In</button>
                  <button
                    type="button"
                    className="forgot-password-button"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot Password?
                  </button>
                  {error && <span className="error-message">{error}</span>}
                </form>
              )
            ) : (
              <div className="verify-message">
                <p>Please check your email for verification. You have {countdown} seconds remaining.</p>
              </div>
            )}
          </>
        ) : (
          <div className="logged-in-container">
            <div className="account-actions">
              <button onClick={handleLogout} className="logout-button">Log Out</button>
              <button onClick={handleDeleteAccount} className="delete-account-button">
                Delete Account
              </button>
            </div>
            
            {renderScheduledCleans()}
          </div>
        )}
      </div>
      
      {showCancelPopup && (
        <div className="cancel-popup">
          <div className="cancel-popup-content">
            <h3>Are you sure you want to cancel this appointment?</h3>
            <p>Note: A cancellation fee will apply. If you cancel within 2 days of the cleaning, you will be charged the full price.</p>
            <div className="cancel-popup-buttons">
              <button onClick={confirmCancel} className="confirm-cancel-button">Yes, Cancel</button>
              <button onClick={closeCancelPopup} className="close-cancel-button">No, Keep</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;