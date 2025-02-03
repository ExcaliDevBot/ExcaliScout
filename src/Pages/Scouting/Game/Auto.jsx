import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Grid, Paper, Divider, Alert } from '@mui/material';
import { ThemeContext } from '../../../ThemeContext';

const CounterBox = ({ label, displayLabel, count, onIncrement, onDecrement }) => {
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
            <Typography variant="h6" sx={{ marginBottom: 1, color: theme === 'dark' ? '#fff' : '#000' }}>{displayLabel}</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    onClick={onDecrement}
                    sx={{
                        color: '#000000',
                        fontSize: 24,
                        backgroundColor: '#4C86AFFF',
                    }}
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
                        ...(label === 'autoAlgaeCount' && {
                            borderRadius: '50%',
                            backgroundColor: '#4C86AFFF',
                            color: '#fff',
                            width: '100px',
                            height: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }),
                    }}
                >
                    {count}
                </Typography>
                <Button
                    variant="contained"
                    onClick={onIncrement}
                    sx={{
                        color: '#000000',
                        fontSize: 24,
                        backgroundColor: '#4C86AFFF',
                    }}
                >
                    +
                </Button>
            </Box>
        </Box>
    );
};

// Auto Component
const Auto = ({ onChange }) => {
    const [counters, setCounters] = useState({
        autoL1: 0,
        autoL2: 0,
        autoL3: 0,
        autoL4: 0,
        autoAlgaeCount: 0,
    });

    useEffect(() => {
        if (onChange) {
            onChange(counters);
        }
    }, [counters, onChange]);

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
                    backgroundColor: '#4c86af',
                    color: '#fff',
                    padding: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                Auto
            </Typography>
            <Divider sx={{ marginY: 3 }} />
            <Grid container spacing={3} justifyContent="center">
                {['autoL4', 'autoL3', 'autoL2', 'autoL1'].map((label) => (
                    <Grid item xs={12} sm={6} md={3} key={label} container justifyContent="center">
                        <CounterBox
                            label={label}
                            displayLabel={label.replace('auto', '')}
                            count={counters[label]}
                            onIncrement={() => handleCounterChange(label, counters[label] + 1)}
                            onDecrement={() => handleCounterChange(label, counters[label] > 0 ? counters[label] - 1 : 0)}
                        />
                    </Grid>
                ))}
                <Grid item xs={12} sm={6} md={3} container justifyContent="center">
                    <CounterBox
                        label="autoAlgaeCount"
                        displayLabel="Algae Counter"
                        count={counters.autoAlgaeCount}
                        onIncrement={() => handleCounterChange('autoAlgaeCount', counters.autoAlgaeCount + 1)}
                        onDecrement={() => handleCounterChange('autoAlgaeCount', counters.autoAlgaeCount > 0 ? counters.autoAlgaeCount - 1 : 0)}
                    />
                </Grid>
            </Grid>
            <Divider sx={{ marginY: 3 }} />
        </Box>
    );
};

export default Auto;