import React, { useState, useEffect, useContext } from "react";
import { Button, Typography, Box, Grid } from "@mui/material";
import { ThemeContext } from "../../../ThemeContext";

const Auto = ({ onChange }) => {
    const { theme } = useContext(ThemeContext);
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

    useEffect(() => {
        if (onChange) {
            onChange({ autoAlgaeCount, autoCoralCount });
        }
    }, [autoAlgaeCount, autoCoralCount, onChange]);

    return (
        <Box>
            <Typography variant="h4" sx={{ marginBottom: 1 }}>Autonomous</Typography>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: theme === 'dark' ? '#424242' : '#e8f5e9',
                            textAlign: 'center',
                            boxShadow: 2,
                        }}
                    >
                        <Typography variant="h5" gutterBottom sx={{ color: theme === 'dark' ? '#fff' : '#000' }}>
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

                <Grid item xs={12} sm={6} md={4}>
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: theme === 'dark' ? '#424242' : '#e8f5e9',
                            textAlign: 'center',
                            boxShadow: 2,
                        }}
                    >
                        <Typography variant="h5" gutterBottom sx={{ color: theme === 'dark' ? '#fff' : '#000' }}>
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