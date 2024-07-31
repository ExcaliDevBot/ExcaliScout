import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Navbar from '../Navbar/Navbar';
import './Login.css';

function Login() {
    return (
        <div>
            <Navbar />
            <br />
            <LoginForm />
        </div>
    );
}

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.status === 'success') {
                setUser(data.user);
                navigate('/my-matches');  // Redirect to My Matches page
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to login. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Login into your account:</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="UserName">Username:</label><br />
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /><br />
                <br />
                <label htmlFor="Password">Password:</label><br />
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button type="submit">Login</button>
            </form>
            <br />
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;
// Compare this snippet from Navbar.jsx: