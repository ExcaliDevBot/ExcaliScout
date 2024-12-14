import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { TextField, Select, MenuItem, Button, Typography, Box, CircularProgress, Grid } from '@mui/material';

function Login() {
    const { user } = useContext(UserContext);

    // If user is already logged in, redirect to the MyMatches page
    if (user) {
        return <Navigate to="/MyMatches" />;
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#012265'
        }}>
            <LoginForm />
        </Box>
    );
}

function LoginForm() {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
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
        setLoading(true); // Start loading

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
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Box sx={{
            width: { xs: '100%', sm: '400px' }, // Full width on mobile, 400px max on larger screens
            p: 4,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            textAlign: 'center',
        }}>
            <Typography variant="h4" sx={{ color: '#012265', fontWeight: 'bold', mb: 3 }}>
                Login to Your Account
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            sx={{
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                            }}
                        >
                            <MenuItem value="">
                                <em>Select a user</em>
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.username}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            sx={{
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                mt: 2,
                                backgroundColor: '#d4af37',
                                '&:hover': { backgroundColor: '#b99328' },
                                borderRadius: '8px',
                                padding: '10px 20px',
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                        </Button>
                    </Grid>

                    {message && (
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ color: 'red', mt: 2 }}>
                                {message}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </form>
        </Box>
    );
}

export default Login;
