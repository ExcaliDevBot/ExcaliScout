import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "../Navbar/Navbar.jsx";
import "./ScoutNav.css"

function ScoutNav() {
    return (
        <div>
            <Navbar />
            <br/>
            {LoginForm()}
        </div>
    );
}

function LoginForm() {
    return (
        <div>
            <h2>Select your Scouting Type:</h2>

            <br/>
            <button style={{ background: 'url(https://www.firstinspires.org/sites/default/files/uploads/hero_headers/header-image_1.jpg)' }}>
                Regular Scouting
            </button>
        </div>
    );
}

export default ScoutNav;