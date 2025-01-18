import React, { useContext } from 'react';
import { useCurrentUser } from '../../context/useCurrentUser';
import { ThemeContext } from '../../ThemeContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import './Profile.css';

const Profile = () => {
    const user = useCurrentUser();
    const { theme, toggleTheme } = useContext(ThemeContext);

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <Box
            sx={{
                p: 4,
                maxWidth: 600,
                margin: 'auto',
                textAlign: 'center',
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: theme === 'light' ? '#fff' : '#333',
                color: theme === 'light' ? '#000' : '#fff',
            }}
        >
            <Avatar sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}>
                {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {user.username}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Role: {user.role}
            </Typography>
            <Divider sx={{ mb: 4, backgroundColor: theme === 'light' ? '#000' : '#fff' }} />
            <Button variant="contained" onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
            </Button>
        </Box>
    );
};

export default Profile;