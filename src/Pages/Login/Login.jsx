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
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from '../Login/Excalibur Frc (4).png';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

        const trimmedUsername = username.trim();

        try {
            const db = getDatabase();
            const usersRef = ref(db, 'users/' + trimmedUsername);

            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();

                if (userData.password === password) {
                    navigate('/my_matches');
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

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
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
                <Box
                    sx={{ textAlign: 'left', mb: 0.5, display: 'flex', alignItems: 'center' }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            maxWidth: '42px',
                            height: 'auto',
                            marginRight: '0.5rem',
                        }}
                    />
                    <Typography
                        component="span"
                        sx={{
                            fontFamily: 'Copperplate Gothic Bold, serif',
                            color: '#012265',
                            fontSize: '1rem',
                        }}
                    >
                        EXCALIBUR FRC
                    </Typography>
                </Box>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '2rem',
                        textAlign: 'left',
                        mb: 2,
                        mt: 0.5,
                    }}
                >
                    Sign in
                </Typography>
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
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Team Password"
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
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
                <Typography textAlign="center">
                    Don&apos;t have an account?{' '}
                    <Button variant="text" onClick={() => alert('Yuda Buda')}>Contact Support</Button>
                </Typography>
            </Card>
        </Box>
    );
}