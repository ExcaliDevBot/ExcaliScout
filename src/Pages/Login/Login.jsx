import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { TextField, Button, Typography, Box, CircularProgress, Grid, Select, MenuItem } from '@mui/material';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    // Fetch users from Firebase
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const db = getDatabase();
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);

                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const userList = Object.keys(userData).map((key) => ({
                        username: key,
                        ...userData[key],
                    }));
                    setUsers(userList); // Set users in the state
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Ensure username is trimmed
        const trimmedUsername = username.trim();

        try {
            const db = getDatabase();
            const usersRef = ref(db, 'users/' + trimmedUsername); // Query using the username directly

            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();

                if (userData.password === password) {
                    localStorage.setItem('user', JSON.stringify({ username: trimmedUsername, role: userData.role }));
                    navigate('/my_matches'); // Redirect to MyMatches page
                } else {
                    setMessage('Invalid password.');
                }
            } else {
                setMessage('User does not exist.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setMessage('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            maxWidth: 400,
            mx: 'auto',
            mt: 10,
            p: 4,
            border: '1px solid #d4af37',
            borderRadius: 2,
            backgroundColor: '#012265',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}>
            <Typography variant="h4" sx={{
                mb: 3,
                textAlign: 'center',
                color: '#d4af37',
            }}>
                Login to Your Account
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Select
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} // Set the username value
                            displayEmpty
                            variant="outlined"
                            margin="normal"
                            sx={{
                                backgroundColor: '#ffffff',
                                color: '#012265',
                                '& .MuiSelect-icon': {
                                    color: '#012265',
                                },
                            }}
                        >
                            <MenuItem value="" disabled sx={{ color: '#012265' }}>
                                Select Username
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.username} value={user.username} sx={{ color: '#012265' }}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
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
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#ffffff',
                                    color: '#012265',
                                },
                                '& .MuiFormLabel-root': {
                                    color: '#d4af37',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d4af37',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            sx={{
                                backgroundColor: '#d4af37',
                                color: '#012265',
                                '&:hover': {
                                    backgroundColor: '#b0882f',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                        </Button>
                    </Grid>
                    {message && (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="error" align="center" sx={{ color: '#d4af37' }}>
                                {message}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </form>
        </Box>
    );
}

export default LoginForm;
