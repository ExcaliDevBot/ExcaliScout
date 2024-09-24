// src/Pages/Home/Home.jsx
import React from 'react';
import Navbar from '../Navbar/Navbar';
import './Home.css';

function Home() {
    const handleGetStarted = () => {
        // Navigate to a relevant page or perform an action
        console.log('Get Started button clicked');
    };

    return (
        <div>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
                  rel="stylesheet"/>
            <div className="home-container">
                <section className="hero-section">
                    <h1>Welcome to Our  Application</h1>
                    <p>Your one-stop solution for scouting and managing matches.</p>
                    <button onClick={handleGetStarted} className="cta-button">Get Started</button>
                </section>
                <section className="features-section">
                    <h2>Instructions</h2>
                    <div className="features">
                        <div className="feature">
                            <h3>Login</h3>
                            <p>Login to the System With Username and Password.</p>
                        </div>
                        <div className="feature">
                            <h3>Assign Matches</h3>
                            <p>Get Your Matches That Where Assigned By An Admin .</p>
                        </div>
                        <div className="feature">
                            <h3>Scout!</h3>
                            <p>Get The Most Data You Can For The Strategy Team.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;