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
            <div className="home-container">
                <section className="hero-section">
                    <h1>Welcome to Our A pplication</h1>
                    <p>Your one-stop solution for scouting and managing matches.</p>
                    <button onClick={handleGetStarted} className="cta-button">Get Started</button>
                </section>
                <section className="features-section">
                    <h2>Features</h2>
                    <div className="features">
                        <div className="feature">
                            <h3>Feature 1</h3>
                            <p>Detail about feature 1.</p>
                        </div>
                        <div className="feature">
                            <h3>Feature 2</h3>
                            <p>Detail about feature 2.</p>
                        </div>
                        <div className="feature">
                            <h3>Feature 3</h3>
                            <p>Detail about feature 3.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;