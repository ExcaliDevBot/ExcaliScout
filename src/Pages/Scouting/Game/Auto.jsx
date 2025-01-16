import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';

const AutoCounters = () => {
    const [algaeCount, setAlgaeCount] = useState(0);
    const [coralCount, setCoralCount] = useState(0);

    const handleIncrement = (type) => {
        if (type === 'algae') setAlgaeCount(algaeCount + 1);
        else if (type === 'coral') setCoralCount(coralCount + 1);
    };

    const handleDecrement = (type) => {
        if (type === 'algae' && algaeCount > 0) setAlgaeCount(algaeCount - 1);
        else if (type === 'coral' && coralCount > 0) setCoralCount(coralCount - 1);
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ marginBottom: 1 }}>Autonomous</Typography>
            <Grid container spacing={4} justifyContent="center">
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
                            {algaeCount}
                        </Typography>
                        <Box display="flex" justifyContent="center" gap={2}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleIncrement('algae')}
                                sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                            >
                                +
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleDecrement('algae')}
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
                            bgcolor: '#e3f2fd',
                            textAlign: 'center',
                            boxShadow: 2,
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Coral
                        </Typography>
                        <Typography variant="h3" color="primary" gutterBottom>
                            {coralCount}
                        </Typography>
                        <Box display="flex" justifyContent="center" gap={2}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleIncrement('coral')}
                                sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                            >
                                +
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleDecrement('coral')}
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

export default AutoCounters;