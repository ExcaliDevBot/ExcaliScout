// src/Pages/NotFound/NotFound.js
import React from 'react';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <img src='../../team_icon.png' alt="Team Logo" className="not-found-logo" />
            <h1 className="not-found-title">404 - Page Not Found</h1>
            <p className="not-found-message">Sorry, the page you are looking for does not exist.</p>
        </div>
    );
};

export default NotFound;