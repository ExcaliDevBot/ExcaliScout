import React, { useState, useEffect, useContext } from "react";
import { Button, Typography, Box, Grid } from "@mui/material";
import { ThemeContext } from "../../../ThemeContext";

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
                transition: 'background-color 0.3s',
                '&:hover': {
                    backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0',
                },
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: 1, color: theme === 'dark' ? '#fff' : '#000' }}>{label}</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    onClick={onDecrement}
                    sx={{
                        color: '#000000',
                        fontSize: 24,
                        backgroundColor: '#4caf98',
                        '&:hover': { backgroundColor: '#4CAF98FF' },
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
                        ...(label === 'Algae Counter' && {
                            borderRadius: '50%',
                            backgroundColor: '#4CAF98FF',
                            color: '#fff',
                            width: '50px',
                            height: '50px',
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
                        backgroundColor: '#4CAF98FF',
                        '&:hover': { backgroundColor: '#4CAF98FF' },
                    }}
                >
                    +
                </Button>
            </Box>
        </Box>
    );
};

const Auto = ({ onChange }) => {
    const [counters, setCounters] = useState({
        L1: 0,
        L2: 0,
        L3: 0,
        L4: 0,
        autoAlgaeCount: 0,
    });

    const handleCounterChange = (label, value) => {
        setCounters((prev) => ({
            ...prev,
            [label]: Math.max(0, value),
        }));
    };

    useEffect(() => {
        if (onChange) {
            onChange(counters);
        }
    }, [counters, onChange]);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center' }}>Autonomous</Typography>
            <Grid container spacing={3} direction="column" alignItems="center">
                <Grid item xs={12}>
                    <CounterBox
                        label="L4"
                        count={counters.L4}
                        onIncrement={() => handleCounterChange('L4', counters.L4 + 1)}
                        onDecrement={() => handleCounterChange('L4', counters.L4 > 0 ? counters.L4 - 1 : 0)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CounterBox
                        label="L3"
                        count={counters.L3}
                        onIncrement={() => handleCounterChange('L3', counters.L3 + 1)}
                        onDecrement={() => handleCounterChange('L3', counters.L3 > 0 ? counters.L3 - 1 : 0)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CounterBox
                        label="L2"
                        count={counters.L2}
                        onIncrement={() => handleCounterChange('L2', counters.L2 + 1)}
                        onDecrement={() => handleCounterChange('L2', counters.L2 > 0 ? counters.L2 - 1 : 0)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CounterBox
                        label="L1"
                        count={counters.L1}
                        onIncrement={() => handleCounterChange('L1', counters.L1 + 1)}
                        onDecrement={() => handleCounterChange('L1', counters.L1 > 0 ? counters.L1 - 1 : 0)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CounterBox
                        label="Algae Counter"
                        count={counters.autoAlgaeCount}
                        onIncrement={() => handleCounterChange('autoAlgaeCount', counters.autoAlgaeCount + 1)}
                        onDecrement={() => handleCounterChange('autoAlgaeCount', counters.autoAlgaeCount > 0 ? counters.autoAlgaeCount - 1 : 0)}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Auto;