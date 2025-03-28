import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo" onClick={closeMobileMenu}>
          Bridge City
        </a>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'navbar-menu active' : 'navbar-menu'}>
          <li className="navbar-item">
            <a href="/info" className="navbar-link" onClick={closeMobileMenu}>
              Info
            </a>
          </li>
          <li className="navbar-item">
            <a href="/register" className="navbar-link" onClick={closeMobileMenu}>
              Account
            </a>
          </li>
          <li className="navbar-item">
            <a href="/ourteam" className="navbar-link" onClick={closeMobileMenu}>
              Our Team
            </a>
          </li>
          <li className="navbar-item">
            <a href="/contact" className="navbar-link" onClick={closeMobileMenu}>
              Contact Us
            </a>
          </li>
          <li className="navbar-item">
            <a href="/book" className="navbar-link" onClick={closeMobileMenu}>
              Book Now
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;