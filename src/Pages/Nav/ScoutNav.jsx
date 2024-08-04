import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../Navbar/Navbar.jsx";

// Inline styles for buttons and container
const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
};

const buttonStyle = {
    backgroundColor: '#012265',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '20px',
    width: '200px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    margin: '5px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
};

const buttonHoverStyle = {
    backgroundColor: '#001a3d',
};

function ScoutNav() {
    return (
        <div className="scout-nav-container">
            <Navbar />
            <LoginForm />
        </div>
    );
}

function LoginForm() {
    return (
        <div className="login-form">
            <h2>Your available scouts:</h2>
            <div style={buttonContainerStyle}>
                <Link to="/Scout" style={{ textDecoration: 'none' }}>
                    <button
                        style={buttonStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                    >
                        Scouting
                    </button>
                </Link>
                <Link to="/Pit-scouting" style={{ textDecoration: 'none' }}>
                    <button
                        style={buttonStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                    >
                        Pit Scouting
                    </button>
                </Link>
                <Link to="/Super-scouting" style={{ textDecoration: 'none' }}>
                    <button
                        style={buttonStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                    >
                        Super Scouting
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default ScoutNav;
