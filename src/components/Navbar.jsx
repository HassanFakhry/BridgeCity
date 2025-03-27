import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">Bridge City</a>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <a href="/info" className="navbar-link">Info</a>
          </li>
          <li className="navbar-item">
            <a href="/register" className="navbar-link">Account</a>
          </li>
          <li className="navbar-item">
            <a href="/ourteam" className="navbar-link">Our Team</a>
          </li>
          <li className="navbar-item">
            <a href="/contact" className="navbar-link">Contact Us</a>
          </li>
          <li className="navbar-item">
            <a href="/book" className="navbar-link">Book Now</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
