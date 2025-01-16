import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Grid,
    Paper
} from '@mui/material';

// CounterBox Component
const CounterBox = ({ count, onIncrement, onDecrement }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            padding: 2,
            boxShadow: 1
        }}
    >
        <Button
            variant="contained"
            onClick={onDecrement}
            sx={{
                minWidth: 50,
                minHeight: 50,
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#388e3c' },
            }}
        >
            -
        </Button>
        <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: '#333' }}
        >
            {count}
        </Typography>
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
);

// AlgaeCounter Component
const AlgaeCounter = ({ count, onIncrement, onDecrement }) => (
    <Paper
        elevation={3}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            borderRadius: 2,
            mt: 4
        }}
    >
        <Typography
            variant="h6"
            sx={{ color: '#4caf50', fontWeight: 'bold', mb: 2 }}
        >
            Algae Counter
        </Typography>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}
        >
            <Button
                variant="contained"
                onClick={onDecrement}
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

// Main Teleop Component
const Teleop = () => {
    const [counters, setCounters] = useState(Array(4).fill(0)); // Counters for 4 levels
    const [algaeCounter, setAlgaeCounter] = useState(0);
    const [climbOption, setClimbOption] = useState('');

    const increment = (index) => {
        setCounters((prev) => {
            const updated = [...prev];
            updated[index] += 1;
            return updated;
        });
    };

    const decrement = (index) => {
        setCounters((prev) => {
            const updated = [...prev];
            if (updated[index] > 0) updated[index] -= 1;
            return updated;
        });
    };

    const incrementAlgae = () => setAlgaeCounter((prev) => prev + 1);
    const decrementAlgae = () => setAlgaeCounter((prev) => (prev > 0 ? prev - 1 : 0));
    const handleClimbSelect = (option) => setClimbOption(option);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography
                variant="h4"
                sx={{ mb: 4, color: '#4caf50', fontWeight: 'bold', textAlign: 'center' }}
            >
                Teleop
            </Typography>
            <Grid container spacing={2}>
                {['Level 4', 'Level 3', 'Level 2', 'Level 1'].map((label, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Typography
                            variant="h6"
                            sx={{ textAlign: 'center', mb: 2, color: '#333', fontWeight: 'bold' }}
                        >
                            {label}
                        </Typography>
                        <CounterBox
                            count={counters[index]}
                            onIncrement={() => increment(index)}
                            onDecrement={() => decrement(index)}
                        />
                    </Grid>
                ))}
            </Grid>
            <AlgaeCounter
                count={algaeCounter}
                onIncrement={incrementAlgae}
                onDecrement={decrementAlgae}
            />
            <Typography
                variant="h6"
                sx={{ textAlign: 'center', mt: 4, color: '#333', fontWeight: 'bold' }}
            >
                Climbing Options
            </Typography>
            <ClimbingOptions
                selectedOption={climbOption}
                onSelect={handleClimbSelect}
            />
        </Box>
    );
};

export default Teleop;
