import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddressQuestion = ({ formData, handleChange, setValidateCurrentQuestion }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const states = ['OR', 'WA'];

  const handleZipChange = (e) => {
    const value = e.target.value;

    // Check if the ZIP code is only numeric
    if (/^\d*$/.test(value)) {
      handleChange(e); 
      setErrorMessage(''); // Clear error message when input is valid
    } else {
      setErrorMessage('ZIP Code must be an integer without any letters or special characters.');
    }
  };

  return (
    <div className="address-question-container">
      <p className="question-text">Please provide your address:</p>
      <div className="input-group">
        <input
          type="text"
          className="text-input"
          name="street"
          placeholder="Street Address"
          value={formData.street || ''}
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          className="text-input"
          name="city"
          placeholder="City"
          value={formData.city || ''}
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <select
          className="text-input"
          name="state"
          value={formData.state || ''}
          onChange={handleChange}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <input
          type="text"
          className="text-input"
          name="zip"
          placeholder="ZIP Code"
          value={formData.zip || ''}
          onChange={handleZipChange} // Use the custom ZIP code handler
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

AddressQuestion.propTypes = {
  formData: PropTypes.shape({
    street: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  setValidateCurrentQuestion: PropTypes.func.isRequired,
};

export default AddressQuestion;
