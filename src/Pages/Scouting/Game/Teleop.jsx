import React, { useState } from 'react';
import { Box, Button, Typography, Card } from '@mui/material';
import reefImage from '../reef.png'; // Ensure 'reef.png' is in the same directory

const Teleop = () => {
    const [counters, setCounters] = useState([0, 0, 0, 0]); // Four counters for reef levels

    const increment = (index) => {
        setCounters((prevCounters) => {
            const updated = [...prevCounters];
            updated[index] += 1;
            return updated;
        });
    };

    const decrement = (index) => {
        setCounters((prevCounters) => {
            const updated = [...prevCounters];
            if (updated[index] > 0) {
                updated[index] -= 1;
            }
            return updated;
        });
    };

    return (
        <Card
            sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: 3,
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
            }}
        >
            <Typography variant="h4" sx={{ mb: 3, color: '#012265' }}>
                Teleop Reef Scoring
            </Typography>
            <Box
                sx={{
                    position: 'relative',
                    width: '600px',
                    height: '400px',
                }}
            >
                <img
                    src={reefImage}
                    alt="2025 FRC Reef"
                    style={{
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        transform: 'scaleX(-1)', // Mirroring the image
                    }}
                />

                {/* Counter 1 (Top Level) */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        right: '5%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => increment(0)}
                        sx={{
                            backgroundColor: '#012265',
                            '&:hover': { backgroundColor: '#d4af37' },
                        }}
                    >
                        +
                    </Button>
                    <Typography
                        variant="h6"
                        sx={{ color: '#fff', backgroundColor: '#012265', p: 1, borderRadius: '4px' }}
                    >
                        {counters[0]}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => decrement(0)}
                        sx={{
                            backgroundColor: '#012265',
                            '&:hover': { backgroundColor: '#d4af37' },
                        }}
                    >
                        -
                    </Button>
                </Box>

                {/* Counter 2 (Second Level) */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '30%',
                        right: '5%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => increment(1)}
                        sx={{
                            backgroundColor: '#012265',
                            '&:hover': { backgroundColor: '#d4af37' },
                        }}
                    >
                        +
                    </Button>
                    <Typography
                        variant="h6"
                        sx={{ color: '#fff', backgroundColor: '#012265', p: 1, borderRadius: '4px' }}
                    >
                        {counters[1]}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => decrement(1)}
                        sx={{
                            backgroundColor: '#012265',
                            '&:hover': { backgroundColor: '#d4af37' },
                        }}
                    >
                        -
                    </Button>
                </Box>

                {/* Counter 3 (Third Level) */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '5%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => increment(2)}
                        sx={{
                            backgroundColor: '#012265',
                            '&:hover': { backgroundColor: '#d4af37' },
                        }}
                    >
                        +
                    </Button>
                    <Typography
                        variant="h6"
                        sx={{ color: '#fff', backgroundColor: '#012265', p: 1, borderRadius: '4px' }}
                    >
                        {counters[2]}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => decrement(2)}
                        sx={{
                            backgroundColor: '#012265',
                            '&:hover': { backgroundColor: '#d4af37' },
                        }}
                    >
                        -
                    </Button>
                </Box>

                {/* Counter 4 (Bottom Level) */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '5%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => increment(3)}
                        sx={{
                            backgroundColor: '#012265',
                            '&:hover': { backgroundColor: '#d4af37' },
                        }}
                    >
                        +
                    </Button>
                    <Typography
                        variant="h6"
                        sx={{ color: '#fff', backgroundColor: '#012265', p: 1, borderRadius: '4px' }}
                    >
                        {counters[3]}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => decrement(3)}
                        sx={{
                            backgroundColor: '#012265',
                            '&:hover': { backgroundColor: '#d4af37' },
                        }}
                    >
                        -
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default Teleop;
