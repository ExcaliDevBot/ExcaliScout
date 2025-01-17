import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Grid } from "@mui/material";

const Auto = ({ onChange }) => {
    const [autoAlgaeCount, setAutoAlgaeCount] = useState(0);
    const [autoCoralCount, setAutoCoralCount] = useState(0);

    const handleAlgaeIncrement = () => {
        setAutoAlgaeCount(prev => prev + 1);
    };

    const handleAlgaeDecrement = () => {
        if (autoAlgaeCount > 0) setAutoAlgaeCount(prev => prev - 1);
    };

    const handleCoralIncrement = () => {
        setAutoCoralCount(prev => prev + 1);
    };

    const handleCoralDecrement = () => {
        if (autoCoralCount > 0) setAutoCoralCount(prev => prev - 1);
    };

    // Send data to parent (ScoutingForm) when it changes
    useEffect(() => {
        if (onChange) {
            // Pass the updated values to the parent
            onChange({ autoAlgaeCount, autoCoralCount });
        }
    }, [autoAlgaeCount, autoCoralCount, onChange]); // Only run when either of the counters changes

    return (
        <Box>
            <Typography variant="h4" sx={{ marginBottom: 1 }}>Autonomous</Typography>
            <Grid container spacing={4} justifyContent="center">
                {/* Algae Counter */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: '#e8f5e9',
                            textAlign: 'center',
                            boxShadow: 2,
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Algae
                        </Typography>
                        <Typography variant="h3" color="primary" gutterBottom>
                            {autoAlgaeCount}
                        </Typography>
                        <Box display="flex" justifyContent="center" gap={2}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleAlgaeIncrement}
                                sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                            >
                                +
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleAlgaeDecrement}
                                sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                            >
                                -
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* Coral Counter */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: '#e8f5e9',
                            textAlign: 'center',
                            boxShadow: 2,
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Coral
                        </Typography>
                        <Typography variant="h3" color="primary" gutterBottom>
                            {autoCoralCount}
                        </Typography>
                        <Box display="flex" justifyContent="center" gap={2}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleCoralIncrement}
                                sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                            >
                                +
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleCoralDecrement}
                                sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                            >
                                -
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Auto;
