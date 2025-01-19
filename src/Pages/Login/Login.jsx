import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';

// Import the logo from your project's assets folder
import logo from '../Login/Excalibur Frc (4).png'; // Adjust the path based on your project structure

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

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
                    setUsers(userList);
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
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                padding: 4,
            }}
        >
            <CssBaseline />
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: 450,
                    padding: 4,
                    gap: 2,
                    boxShadow:
                        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
                }}
            >
                {/* Logo */}
                <Box
                    sx={{ textAlign: 'left', mb: 0.5, display: 'flex', alignItems: 'center' }}
                >
                    <img
                        src={logo} // Use the imported logo
                        alt="Logo"
                        style={{
                            maxWidth: '42px', // Adjusted the size to make the logo smaller
                            height: 'auto',
                            marginRight: '0.5rem',
                        }}
                    />
                    <Typography
                        component="span"
                        sx={{
                            fontFamily: 'Copperplate Gothic Bold, serif', // Use the new font
                            color: '#012265',
                            fontSize: '1rem',
                        }}
                    >
                        EXCALIBUR FRC
                    </Typography>
                </Box>
                {/* Sign In Header */}
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        fontWeight: 'bold', // Make the font bolder
                        fontSize: '2rem',
                        textAlign: 'left', // Align text to the left
                        mb: 2,
                        mt: 0.5, // Reduced top margin
                    }}
                >
                    Sign in
                </Typography>


                {/* Form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FormControl fullWidth>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <Select
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            displayEmpty
                            required
                        >
                            <MenuItem value="" disabled>
                                Select Username
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.username} value={user.username}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Team Password"
                            required
                        />
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                        sx={{ mt: 2 }}
                    />
                    {message && (
                        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                            {message}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
                    </Button>
                </Box>
                <Divider sx={{ my: 2 }}>or</Divider>
                <Typography textAlign="center" >
                    Don&apos;t have an account?{' '}
                    <Button variant="text" onClick={() => alert('Yuda Buda')}>Contact Support</Button>
                </Typography>
            </Card>
        </Box>
    );
}