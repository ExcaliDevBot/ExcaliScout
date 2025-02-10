import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Grid, Paper, Divider, Alert } from '@mui/material';
import { ThemeContext } from '../../../context/ThemeContext';

// CounterBox Component
const CounterBox = ({ label, count, onIncrement, onDecrement }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                backgroundColor: theme === 'dark' ? '#424242' : '#f5f5f5',
                borderRadius: 2,
                padding: 2,
                boxShadow: 1,
                marginBottom: 2,
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: 1, color: theme === 'dark' ? '#fff' : '#000' }}>{label}</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    onClick={onDecrement}
                    sx={{ backgroundColor: '#d32f2f', color: '#fff', minWidth: '100px', height: '50px' }}
                >
                    -
                </Button>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        color: theme === 'dark' ? '#fff' : '#333',
                        minWidth: '50px',
                        textAlign: 'center',
                    }}
                >
                    {count}
                </Typography>
                <Button
                    variant="contained"
                    onClick={onIncrement}
                    sx={{ backgroundColor: '#388e3c', color: '#fff', minWidth: '100px', height: '50px' }}
                >
                    +
                </Button>
            </Box>
        </Box>
    );
};

// ClimbingOptions Component
const ClimbingOptions = ({ selectedOption, onSelect }) => {
    const { theme } = useContext(ThemeContext);
    const options = ['PARKED', 'DEEP', 'SHALLOW', 'UNPARKED'];

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
                        backgroundColor: selectedOption === option ? '#4caf50' : theme === 'dark' ? '#424242' : '#f5f5f5',
                        color: selectedOption === option ? '#fff' : theme === 'dark' ? '#fff' : '#333',
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
const Teleop = ({ onChange }) => {
    const [counters, setCounters] = useState({
        L1: 0,
        L2: 0,
        L3: 0,
        L4: 0,
        removeAlgae: 0,
        netScore: 0,
        processorScore: 0,
        defensivePins: 0,
    });

    const [climbOption, setClimbOption] = useState('');

    // Call the onChange prop whenever counters or climbOption change
    useEffect(() => {
        if (onChange) {
            onChange({ counters, climbOption });
        }
    }, [counters, climbOption, onChange]);

    const handleCounterChange = (label, value) => {
        setCounters((prev) => ({
            ...prev,
            [label]: Math.max(0, value),
        }));
    };

    return (
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography
                variant="h4"
                sx={{
                    marginBottom: 1,
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    padding: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                Teleop
            </Typography>
            <Divider sx={{ marginY: 3 }} />
            <Grid container spacing={3} justifyContent="center">
                {['L4', 'L3', 'L2', 'L1'].map((label) => (
                    <Grid item xs={12} sm={6} md={3} key={label} container justifyContent="center">
                        <CounterBox
                            label={label}
                            count={counters[label]}
                            onIncrement={() => handleCounterChange(label, counters[label] + 1)}
                            onDecrement={() => handleCounterChange(label, counters[label] > 0 ? counters[label] - 1 : 0)}
                        />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Divider sx={{ marginY: 3 }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3} container justifyContent="center">
                    <CounterBox
                        label="Remove Algae"
                        count={counters.removeAlgae}
                        onIncrement={() => handleCounterChange('removeAlgae', counters.removeAlgae + 1)}
                        onDecrement={() => handleCounterChange('removeAlgae', counters.removeAlgae > 0 ? counters.removeAlgae - 1 : 0)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} container justifyContent="center">
                    <CounterBox
                        label="Net Score"
                        count={counters.netScore}
                        onIncrement={() => handleCounterChange('netScore', counters.netScore + 1)}
                        onDecrement={() => handleCounterChange('netScore', counters.netScore > 0 ? counters.netScore - 1 : 0)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} container justifyContent="center">
                    <CounterBox
                        label="Processor Score"
                        count={counters.processorScore}
                        onIncrement={() => handleCounterChange('processorScore', counters.processorScore + 1)}
                        onDecrement={() => handleCounterChange('processorScore', counters.processorScore > 0 ? counters.processorScore - 1 : 0)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ marginY: 3 }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3} container justifyContent="center">
                    <CounterBox
                        label="Defensive Pins"
                        count={counters.defensivePins}
                        onIncrement={() => handleCounterChange('defensivePins', counters.defensivePins + 1)}
                        onDecrement={() => handleCounterChange('defensivePins', counters.defensivePins > 0 ? counters.defensivePins - 1 : 0)}
                    />
                </Grid>
            </Grid>
            <Divider sx={{ marginY: 3 }} />

            <Alert severity="info"> Remember To select a climbing option .</Alert>
            <Typography
                variant="h6"
                sx={{ textAlign: 'center', mt: 4, color: '#333', fontWeight: 'bold' }}
            >
                Climbing Options
            </Typography>

            <ClimbingOptions
                selectedOption={climbOption}
                onSelect={(option) => setClimbOption(option)}
            />
        </Box>
    );
};

export default Teleop;