import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Homepage';
import Register from './pages/Register';
import Booking from './pages/Booking';
import OurTeam from './pages/OurTeam';
import ContactUs from './pages/ContactUs';
import Info from './pages/Info';
import ErrorPage from './pages/ErrorPage';
import ThankYou from './pages/ThankYou';
import Payment from './pages/Payment';
import ConfirmationPage from './pages/ConfirmationPage';
import ForgotPassword from './pages/ForgotPassword';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/ourteam" element={<OurTeam />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/info" element={<Info />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
