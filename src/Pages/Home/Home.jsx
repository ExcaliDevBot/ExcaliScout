import React from 'react';
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import {useNavigate} from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <div>
            {/* Hero Section */}
            <Box
                sx={{
                    backgroundColor: '#012265', // Dark Blue
                    color: '#fff',
                    padding: '120px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    textAlign: 'center',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #012265, #0c3c72)', // Gradient background for dynamic look
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        marginBottom: 3,
                        fontWeight: 'bold',
                        fontSize: '4rem',
                        letterSpacing: '1px',
                        lineHeight: '1.2',
                        fontFamily: "'Roboto', sans-serif",
                    }}
                >
                    Excalibur Scouting System
                </Typography>
                <Typography
                    variant="h5"
                    component="p"
                    sx={{
                        marginBottom: 4,
                        fontStyle: 'italic',
                        color: '#fff',
                        fontWeight: 300,
                        fontSize: '1.25rem',
                        fontFamily: "'Roboto', sans-serif",
                    }}
                >
                    Scout for the Excalibur #6738 FRC Team.
                </Typography>
                <Button
                    variant="outlined"
                    sx={{
                        color: '#d4af37',
                        borderColor: '#d4af37', // Gold border
                        fontSize: '1.2rem',
                        padding: '12px 28px',
                        borderRadius: '30px',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: '#fff',
                            backgroundColor: '#d4af37',
                            color: '#012265',
                        },
                    }}
                    onClick={handleGetStarted}
                >
                    Get Started
                </Button>
            </Box>
        </div>
    );
}

export default Home;
