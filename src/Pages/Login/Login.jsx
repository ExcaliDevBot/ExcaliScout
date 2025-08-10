import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { ThemeContext } from '../../context/ThemeContext';
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
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from '../Login/Excalibur Frc (4).png';

export default function LoginForm() {
    const { theme } = React.useContext(ThemeContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('error');
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
                    localStorage.setItem('user', JSON.stringify({ username: trimmedUsername, role: userData.role }));
                    setMessage('Login successful! Redirecting...');
                    setMessageType('success');
                    setTimeout(() => {
                    navigate('/my_matches');
                    }, 1000);
                } else {
                    setMessage('Invalid password.');
                    setMessageType('error');
                }
            } else {
                setMessage('User does not exist.');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setMessage('An error occurred. Please try again later.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme === 'light' ? '#f5f5f5' : '#121212',
                py: 4,
                px: 2,
            }}
        >
            <CssBaseline />
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: 400,
                    p: { xs: 3, sm: 4 },
                    gap: 3,
                    borderRadius: 3,
                    backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e',
                    color: theme === 'light' ? '#000' : '#fff',
                    boxShadow: theme === 'light' 
                        ? '0 8px 32px rgba(0,0,0,0.1)' 
                        : '0 8px 32px rgba(0,0,0,0.3)',
                }}
            >
                <Box
                    sx={{ 
                        textAlign: 'center', 
                        mb: 2, 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                maxWidth: '48px',
                                height: 'auto',
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Copperplate Gothic Bold, serif',
                                color: theme === 'light' ? '#012265' : '#d4af37',
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                fontWeight: 'bold'
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
                            fontSize: { xs: '1.8rem', sm: '2rem' },
                            color: theme === 'light' ? '#012265' : '#d4af37',
                            mb: 1,
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme === 'light' ? '#666' : '#ccc',
                            textAlign: 'center'
                        }}
                    >
                        Sign in to your scouting account
                    </Typography>
                </Box>

                {message && (
                    <Alert 
                        severity={messageType} 
                        sx={{ 
                            borderRadius: 2,
                            '& .MuiAlert-message': {
                                fontSize: '0.9rem'
                            }
                        }}
                    >
                        {message}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FormControl 
                        fullWidth 
                        sx={{ 
                            mb: 3,
                            '& .MuiInputLabel-root': {
                                color: theme === 'light' ? '#666' : '#ccc'
                            }
                        }}
                    >
                        <FormLabel 
                            htmlFor="username"
                            sx={{ 
                                color: theme === 'light' ? '#333' : '#fff',
                                mb: 1,
                                fontWeight: 'bold'
                            }}
                        >
                            Username
                        </FormLabel>
                        <Select
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            displayEmpty
                            required
                            sx={{
                                backgroundColor: theme === 'light' ? '#f8f9fa' : '#2a2a2a',
                                borderRadius: 2,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme === 'light' ? '#e0e0e0' : '#444',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme === 'light' ? '#012265' : '#d4af37',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme === 'light' ? '#012265' : '#d4af37',
                                },
                            }}
                        >
                            <MenuItem value="" disabled sx={{ color: '#999' }}>
                                Select Username
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.username} value={user.username}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <FormLabel 
                            htmlFor="password"
                            sx={{ 
                                color: theme === 'light' ? '#333' : '#fff',
                                mb: 1,
                                fontWeight: 'bold'
                            }}
                        >
                            Password
                        </FormLabel>
                        <TextField
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: theme === 'light' ? '#f8f9fa' : '#2a2a2a',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: theme === 'light' ? '#e0e0e0' : '#444',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme === 'light' ? '#012265' : '#d4af37',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme === 'light' ? '#012265' : '#d4af37',
                                    },
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: theme === 'light' ? '#000' : '#fff',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            sx={{ 
                                                color: theme === 'light' ? '#666' : '#ccc' 
                                            }}
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
                        sx={{ 
                            mb: 3,
                            '& .MuiFormControlLabel-label': {
                                color: theme === 'light' ? '#666' : '#ccc'
                            }
                        }}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ 
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                            '&:hover': {
                                backgroundColor: theme === 'light' ? '#001a4b' : '#b8941f',
                            },
                            '&:disabled': {
                                backgroundColor: '#ccc'
                            }
                        }}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} color="inherit" />
                                <span>Signing in...</span>
                            </Box>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </Box>
                
                <Divider sx={{ my: 2, borderColor: theme === 'light' ? '#e0e0e0' : '#444' }}>
                    <Typography variant="body2" sx={{ color: theme === 'light' ? '#666' : '#ccc' }}>
                        or
                    </Typography>
                </Divider>
                
                <Typography 
                    textAlign="center"
                    sx={{ color: theme === 'light' ? '#666' : '#ccc' }}
                >
                    Don&apos;t have an account?{' '}
                    <Button 
                        variant="text" 
                        onClick={() => alert('Contact your team administrator for account access')}
                        sx={{ 
                            color: theme === 'light' ? '#012265' : '#d4af37',
                            fontWeight: 'bold',
                            textTransform: 'none'
                        }}
                    >
                        Contact Support
                    </Button>
                </Typography>
            </Card>
        </Container>
    );
}