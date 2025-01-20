import React, { useContext } from 'react';
import { useCurrentUser } from '../../context/useCurrentUser';
import { ThemeContext } from '../../ThemeContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import './Profile.css';

const Profile = () => {
    const user = useCurrentUser();
    const { theme, toggleTheme } = useContext(ThemeContext);

    if (!user) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: theme === 'light' ? '#f5f5f5' : '#121212',
                }}
            >
                <Typography variant="h6" sx={{ color: theme === 'light' ? '#000' : '#fff' }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: theme === 'light' ? '#f5f5f5' : '#121212',
                padding: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    maxWidth: 500,
                    width: '100%',
                    textAlign: 'center',
                    borderRadius: 3,
                    backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e',
                    color: theme === 'light' ? '#000' : '#fff',
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            fontSize: '3rem',
                            backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                        }}
                    >
                        {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold">
                        {user.username}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Role: {user.role}
                    </Typography>
                    <Divider
                        sx={{
                            width: '100%',
                            backgroundColor: theme === 'light' ? '#ddd' : '#444',
                        }}
                    />
                    <Button
                        variant="contained"
                        size="large"
                        onClick={toggleTheme}
                        sx={{
                            backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: theme === 'light' ? '#001a4b' : '#c19730',
                            },
                        }}
                    >
                        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Profile;
