import React, { useState } from 'react';
import {Box, Button, Typography, Grid, Paper, Divider} from '@mui/material';

// CounterBox Component
const CounterBox = ({ label, count, onIncrement, onDecrement }) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            padding: 2,
            boxShadow: 1,
            marginBottom: 2,
        }}
    >
        <Typography variant="h6" sx={{ marginBottom: 1 }}>{label}</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Button
                variant="contained"
                onClick={onDecrement}
                sx={{
                    color: '#000000',
                    fontSize: 24,
                    backgroundColor: '#4caf50',
                    '&:hover': { backgroundColor: '#388e3c' },
                }}
            >
                -
            </Button>
            <Typography
                variant="h5"
                sx={{ fontWeight: 'bold', color: '#333', minWidth: '50px', textAlign: 'center' }}
            >
                {count}
            </Typography>
            <Button
                variant="contained"
                onClick={onIncrement}
                sx={{
                    color: '#000000',
                    fontSize: 24,
                    backgroundColor: '#4caf50',
                    '&:hover': { backgroundColor: '#388e3c' },
                }}
            >
                +
            </Button>
        </Box>
    </Box>
);

// ClimbingOptions Component
const ClimbingOptions = ({ selectedOption, onSelect }) => {
    const options = ['PARKED', 'DEEP', 'SHALLOW'];

    return (
        <Box
            sx={{
                mt: 4,
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}
        >
            {options.map((option) => (
                <Paper
                    key={option}
                    onClick={() => onSelect(option)}
                    elevation={selectedOption === option ? 6 : 2}
                    sx={{
                        padding: 2,
                        width: 120,
                        textAlign: 'center',
                        borderRadius: 2,
                        cursor: 'pointer',
                        backgroundColor: selectedOption === option ? '#4caf50' : '#f5f5f5',
                        color: selectedOption === option ? '#fff' : '#333',
                        fontWeight: selectedOption === option ? 'bold' : 'normal',
                        boxShadow: selectedOption === option ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
                        transition: 'all 0.3s',
                    }}
                >
                    {option}
                </Paper>
            ))}
        </Box>
    );
};

// AlgaeCounter Component (Restored Design)
const AlgaeCounter = ({ count, onIncrement, onDecrement }) => (
    <Paper
        elevation={3}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            borderRadius: 2,
            mt: 4,
        }}
    >
        <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 2 }}>
            Algae Counter
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
                variant="contained"
                onClick={onDecrement}
                disabled={count <= 0}  // Disable decrement if count is 0 or less
                sx={{
                    minWidth: 50,
                    minHeight: 50,
                    backgroundColor: '#4caf50',
                    '&:hover': { backgroundColor: '#388e3c' },
                }}
            >
                -
            </Button>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '50%',
                    width: 100,
                    height: 100,
                    color: '#1976d2',
                    fontSize: 28,
                    fontWeight: 'bold',
                    boxShadow: 2,
                }}
            >
                {count}
            </Box>
            <Button
                variant="contained"
                onClick={onIncrement}
                sx={{
                    minWidth: 50,
                    minHeight: 50,
                    backgroundColor: '#4caf50',
                    '&:hover': { backgroundColor: '#388e3c' },
                }}
            >
                +
            </Button>
        </Box>
    </Paper>
);

// Main Teleop Component
const Teleop = () => {
    const [counters, setCounters] = useState({
        L1: 0,
        L2: 0,
        L3: 0,
        L4: 0,
        algaeCount: 0,
    });

    const [climbOption, setClimbOption] = useState('');

    const handleCounterChange = (label, newValue) => {
        setCounters((prevCounters) => ({
            ...prevCounters,
            [label]: newValue,
        }));
    };

    return (
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ marginBottom: 1 }}>Teleop</Typography>
            <Grid container spacing={3} justifyContent="center">
                {/* Individual counters for L1 to L4 */}
                {['L1', 'L2', 'L3', 'L4'].map((label) => (
                    <Grid item xs={12} sm={6} md={3} key={label} container justifyContent="center">
                        <CounterBox
                            label={label}
                            count={counters[label]}
                            onIncrement={() => handleCounterChange(label, counters[label] + 1)}
                            onDecrement={() => handleCounterChange(label, counters[label] > 0 ? counters[label] - 1 : 0)}
                        />
                    </Grid>
                ))}
                {/* Algae Counter (Updated Design) */}
                <Grid item xs={12} sm={6} md={3} container justifyContent="center">
                    <AlgaeCounter
                        count={counters.algaeCount}
                        onIncrement={() => handleCounterChange('algaeCount', counters.algaeCount + 1)}
                        onDecrement={() => handleCounterChange('algaeCount', counters.algaeCount > 0 ? counters.algaeCount - 1 : 0)} // Prevent going below 0
                    />
                </Grid>
            </Grid>
            <Divider sx={{ marginY: 3 }} />

            <Typography
                variant="h6"
                sx={{ textAlign: 'center', mt: 4, color: '#333', fontWeight: 'bold' }}
            >
                Climbing Options
            </Typography>
            <ClimbingOptions
                selectedOption={climbOption}
                onSelect={setClimbOption}
            />
        </Box>
    );
};

export default Teleop;
