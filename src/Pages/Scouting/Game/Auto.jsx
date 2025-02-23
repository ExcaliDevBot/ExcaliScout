import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Grid, Divider, Paper, FormControlLabel, Switch } from '@mui/material';
import { ThemeContext } from '../../../context/ThemeContext';

const CounterBox = ({ label, displayLabel, count, onIncrement, onDecrement }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        backgroundColor: theme === 'dark' ? '#333' : '#fafafa',
        borderRadius: 3,
        width: '250%',
        maxWidth: '400px',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 1, color: theme === 'dark' ? '#fff' : '#000' }}>
        {displayLabel}
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
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
            minWidth: '70px',
            textAlign: 'center',
            ...(label === 'autoRemoveAlgae' ? {
              borderRadius: '50%',
              backgroundColor: '#4C86AFFF',
              color: '#fff',
              width: '100px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            } : {}),
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
    </Paper>
  );
};

const Auto = ({ onChange, t }) => {
  const [counters, setCounters] = useState({
    autoL1: 0,
    autoL2: 0,
    autoL3: 0,
    autoL4: 0,
    autoRemoveAlgae: 0,
  });
  const [leftStartingZone, setLeftStartingZone] = useState(false);

  useEffect(() => {
    const anyCounterGreaterThanZero = Object.values(counters).some(count => count > 0);
    if (anyCounterGreaterThanZero) {
      setLeftStartingZone(true);
    }
    if (onChange) {
      onChange({ ...counters, leftStartingZone });
    }
  }, [counters, onChange]);

  const handleCounterChange = (label, value) => {
    setCounters((prev) => ({
      ...prev,
      [label]: Math.max(0, value),
    }));
  };

  return (
    <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Typography
        variant="h4"
        sx={{
          marginBottom: 3,
          backgroundColor: '#4c86af',
          color: '#fff',
          padding: 3,
          borderRadius: 2,
          textAlign: 'center',
          width: '100%',
        }}
      >
        {t.auto}
      </Typography>
      <Divider sx={{ marginY: 4, width: '100%' }} />
      <Grid container spacing={4} justifyContent="center">
        {['autoL4', 'autoL3', 'autoL2', 'autoL1', 'autoRemoveAlgae'].map((label) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={label} container justifyContent="center">
            <CounterBox
              label={label}
              displayLabel={t[label]}
              count={counters[label]}
              onIncrement={() => handleCounterChange(label, counters[label] + 1)}
              onDecrement={() => handleCounterChange(label, counters[label] > 0 ? counters[label] - 1 : 0)}
            />
          </Grid>
        ))}
      </Grid>
      <FormControlLabel
        control={
          <Switch
            checked={leftStartingZone}
            onChange={(e) => setLeftStartingZone(e.target.checked)}
            color="primary"
          />
        }
        label={t.robotLeftStartingZone}
        sx={{ marginTop: 4 }}
      />
      <Divider sx={{ marginY: 4, width: '100%' }} />
    </Box>
  );
};

export default Auto;