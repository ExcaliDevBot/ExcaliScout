import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Login.css';

function Login() {
    const { user } = useContext(UserContext);

    // If user is already logged in, redirect to the MyMatches page
    if (user) {
        return <Navigate to="/MyMatches" />;
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <LoginForm />
            </div>
        </div>
    );
}

function LoginForm() {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://ScoutingSystem.pythonanywhere.com/users');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://ScoutingSystem.pythonanywhere.com/login', {
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
                login(data.user); // Login the user
                navigate('/MyMatches');  // Redirect to MyMatches page
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
                <label htmlFor="username">Username:</label><br />
                <select
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select><br />
                <br />
                <label htmlFor="password">Password:</label><br />
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
