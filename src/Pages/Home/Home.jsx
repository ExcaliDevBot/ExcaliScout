import React from 'react';
import { Box, Button, Typography, Container, Card, CardContent, Grid, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { SportsSoccer, QrCodeScanner, Engineering, TrendingUp } from '@mui/icons-material';

function Home() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const handleGetStarted = () => {
        navigate('/login');
    };

    const features = [
        {
            icon: <SportsSoccer sx={{ fontSize: 48, color: '#d4af37' }} />,
            title: 'Match Scouting',
            description: 'Comprehensive match data collection with real-time tracking'
        },
        {
            icon: <QrCodeScanner sx={{ fontSize: 48, color: '#d4af37' }} />,
            title: 'QR Code Integration',
            description: 'Quick data submission and offline capability support'
        },
        {
            icon: <Engineering sx={{ fontSize: 48, color: '#d4af37' }} />,
            title: 'Pit Scouting',
            description: 'Detailed robot analysis and team capability assessment'
        },
        {
            icon: <TrendingUp sx={{ fontSize: 48, color: '#d4af37' }} />,
            title: 'Analytics Dashboard',
            description: 'Real-time insights and performance tracking'
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #012265 0%, #0c3c72 50%, #d4af37 100%)',
                    color: '#fff',
                    py: { xs: 8, md: 12 },
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 30% 70%, rgba(212,175,55,0.1) 0%, transparent 50%)',
                        pointerEvents: 'none'
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ mb: 6 }}>
                        <Typography
                            variant={isMobile ? "h3" : "h2"}
                            component="h1"
                            sx={{
                                mb: 3,
                                fontWeight: 'bold',
                                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                                letterSpacing: '1px',
                                lineHeight: '1.2',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            }}
                        >
                            Excalibur Scouting System
                        </Typography>
                        <Typography
                            variant="h5"
                            component="p"
                            sx={{
                                mb: 4,
                                fontWeight: 300,
                                fontSize: { xs: '1.1rem', md: '1.25rem' },
                                opacity: 0.95,
                                maxWidth: '600px',
                                mx: 'auto',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                            }}
                        >
                            Advanced scouting platform for FRC Team #6738 Excalibur. 
                            Streamline your data collection and gain competitive insights.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: '#d4af37',
                                color: '#012265',
                                fontSize: '1.2rem',
                                py: 2,
                                px: 4,
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                '&:hover': {
                                    backgroundColor: '#fff',
                                    color: '#012265',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                            onClick={handleGetStarted}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            color: '#012265',
                            fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                    >
                        Powerful Scouting Features
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#666',
                            maxWidth: '600px',
                            mx: 'auto',
                            fontWeight: 300
                        }}
                    >
                        Everything you need to collect, analyze, and act on match data
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    textAlign: 'center',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ mb: 2 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        sx={{
                                            mb: 2,
                                            fontWeight: 'bold',
                                            color: '#012265'
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#666',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    backgroundColor: '#012265',
                    color: '#fff',
                    py: 8,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            fontSize: { xs: '1.8rem', md: '2.2rem' }
                        }}
                    >
                        Ready to Scout?
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 4,
                            opacity: 0.9,
                            fontWeight: 300
                        }}
                    >
                        Join your team and start collecting valuable match data today
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            backgroundColor: '#d4af37',
                            color: '#012265',
                            fontSize: '1.1rem',
                            py: 2,
                            px: 4,
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#fff',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                        onClick={handleGetStarted}
                    >
                        Sign In Now
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}

export default Home;