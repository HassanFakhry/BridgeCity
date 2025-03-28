import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from client
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(  // Use root.render
    <App /> // StrictMode is now disabled
);



// Your Google Maps script tag can stay here or in your HTML
<script
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"
    async
></script>