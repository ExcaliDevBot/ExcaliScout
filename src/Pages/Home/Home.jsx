// src/Pages/Home/Home.jsx
import React from 'react';
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
                    <h1>Welcome to Excalibur's Scouting System</h1>
                    <p>Scout.Sleep.Eat.</p>
                    <button onClick={handleGetStarted} className="cta-button">Get Started!</button>
                </section>
                <section className="features-section">
                    <h2>Instuctions</h2>
                    <div className="features">
                        <div className="feature">
                            <h3>Login</h3>
                            <p>Select Your Name And Enter Team Passward.</p>
                        </div>
                        <div className="feature">
                            <h3>Scout</h3>
                            <p>Select your match and start Entering Data</p>
                        </div>
                        <div className="feature">
                            <h3>Repeat</h3>
                            <p>Give The best Data To Strategy Team.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;