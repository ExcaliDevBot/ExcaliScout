import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
} from '@mui/material';
import { ThemeContext } from '../../../context/ThemeContext';

// Main Teleop Component
const Teleop = ({ onChange }) => {
  const { theme } = useContext(ThemeContext);

  const [autoWinner, setAutoWinner] = useState(null); // 'blue' | 'red'
  const [movedInAuto, setMovedInAuto] = useState(null); // true | false

  // Multiple delivery points + shot points (all 0-100 grid)
  const [deliveryPoints, setDeliveryPoints] = useState([]); // [{ id, x, y }]
  const [shotPoints, setShotPoints] = useState([]); // [{ id, x, y }]

  const [estimatedBallsScored, setEstimatedBallsScored] = useState('');

  // click / double-click handling
  const clickTimeoutRef = useRef(null);

  const toGridCoords = (event) => {
    let container = event.currentTarget;
    // Fallback: on some browsers or synthetic events currentTarget may be null; use closest box
    if (!container && event.target) {
      container = event.target.closest('[data-field="teleop-field"]');
    }
    if (!container) {
      return { x: 0, y: 0 };
    }
    const rect = container.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;
    return {
      x: Math.round(relX * 100),
      y: Math.round(relY * 100),
    };
  };

  const handleSingleClick = (event) => {
    const point = toGridCoords(event);
    setShotPoints((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), ...point },
    ]);
  };

  const handleDoubleClick = (event) => {
    const point = toGridCoords(event);
    setDeliveryPoints((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), ...point },
    ]);
  };

  const handleFieldClick = (event) => {
    // differentiate single vs double click manually so mobile taps still work
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      handleDoubleClick(event);
    } else {
      clickTimeoutRef.current = window.setTimeout(() => {
        handleSingleClick(event);
        clickTimeoutRef.current = null;
      }, 220); // small delay to detect second tap
    }
  };

  const handleClearField = () => {
    setDeliveryPoints([]);
    setShotPoints([]);
  };

  useEffect(() => {
    if (!onChange) return;

    const parsedBalls = estimatedBallsScored === '' ? null : Number(estimatedBallsScored);

    onChange({
      teleop2026AutoWinner: autoWinner,
      teleop2026MovedInAuto: movedInAuto,
      teleop2026DeliveryPoints: deliveryPoints.map(({ x, y }) => ({ x, y })),
      teleop2026ShotPoints: shotPoints.map(({ x, y }) => ({ x, y })),
      teleop2026EstimatedBalls: Number.isNaN(parsedBalls) ? null : parsedBalls,
    });
  }, [
    autoWinner,
    movedInAuto,
    deliveryPoints,
    shotPoints,
    estimatedBallsScored,
    onChange,
  ]);

  const fieldBorderColor = theme === 'dark' ? '#888' : '#ccc';

  const toggleButtonSx = (selected, color = '#4c86af') => ({
    fontWeight: 'bold',
    borderRadius: 2,
    paddingY: 1.2,
    '&.Mui-selected': {
      backgroundColor: selected ? color : undefined,
      color: '#fff',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    },
    '&.Mui-selected:hover': {
      backgroundColor: selected ? '#3b6b8a' : undefined,
    },
  });

  const handleEstimatedBallsChange = (e) => {
    // Keep only digits, allow empty string
    const raw = e.target.value;
    const cleaned = raw.replace(/[^0-9]/g, '');
    setEstimatedBallsScored(cleaned);
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 3,
        direction: 'rtl',
        background: theme === 'dark'
          ? 'radial-gradient(circle at top, #333 0, #111 60%, #000 100%)'
          : 'radial-gradient(circle at top, #ffffff 0, #e9f2fb 60%, #dbe6f3 100%)',
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 1100,
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: theme === 'dark' ? 'rgba(20,20,20,0.9)' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography
            variant="h4"
            sx={{
              background: 'linear-gradient(90deg, #4caf50, #81c784)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 800,
              textAlign: 'center',
              mb: 1,
            }}
          >
            {'טלאופ'}
          </Typography>

          <Divider />

          {/* Auto winner + moved */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: theme === 'dark' ? '#1f2933' : '#f4f7fb',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {'מי ניצח באוטונומי (מי קלע יותר)?'}
                </Typography>
                <ToggleButtonGroup
                  value={autoWinner}
                  exclusive
                  onChange={(_, value) => value && setAutoWinner(value)}
                  fullWidth
                  size="large"
                >
                  <ToggleButton
                    value="blue"
                    sx={toggleButtonSx(autoWinner === 'blue', '#1976d2')}
                  >
                    {'כחול'}
                  </ToggleButton>
                  <ToggleButton
                    value="red"
                    sx={toggleButtonSx(autoWinner === 'red', '#d32f2f')}
                  >
                    {'אדום'}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  height: '100%',
                  backgroundColor: theme === 'dark' ? '#1f2933' : '#f4f7fb',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {'הרובוט זז באוטונומי?'}
                </Typography>
                <ToggleButtonGroup
                  value={movedInAuto}
                  exclusive
                  onChange={(_, value) => value !== null && setMovedInAuto(value)}
                  fullWidth
                  size="large"
                >
                  <ToggleButton value={true} sx={toggleButtonSx(movedInAuto === true)}>
                    {'כן'}
                  </ToggleButton>
                  <ToggleButton value={false} sx={toggleButtonSx(movedInAuto === false)}>
                    {'לא'}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Paper>
            </Grid>
          </Grid>

          {/* Delivery + field */}
          <Paper
            elevation={3}
            sx={{
              borderRadius: 2,
              backgroundColor: theme === 'dark' ? '#10151b' : '#eef3fb',
              p: 2,
            }}
          >
            <Grid container spacing={2} alignItems="stretch">
              <Grid item xs={12} md={4.5}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {'נגיעה אחת במגרש = נקודת זריקה. לחיצה כפולה = נקודת דליברי.'}
                    </Typography>
                    {(deliveryPoints.length > 0 || shotPoints.length > 0) && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {`דליברי: ${deliveryPoints.length} | זריקות: ${shotPoints.length}`}
                      </Typography>
                    )}
                    {(deliveryPoints.length > 0 || shotPoints.length > 0) && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={handleClearField}
                      >
                        {'איפוס המגרש'}
                      </Button>
                    )}
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {'הערכה: כמה כדורים נכנסו בסך הכל בטלאופ?'}
                    </Typography>
                    <TextField
                      type="number"
                      inputMode="numeric"
                      value={estimatedBallsScored}
                      onChange={handleEstimatedBallsChange}
                      fullWidth
                      size="medium"
                      sx={{
                        backgroundColor: theme === 'dark' ? '#1f2933' : '#fff',
                        borderRadius: 1,
                      }}
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={7.5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
                <Box
                  onClick={handleFieldClick}
                  data-field="teleop-field"
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 650,
                    aspectRatio: '16 / 9',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: `3px solid ${fieldBorderColor}`,
                    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f0f4f8',
                    backgroundImage: 'url(/2026field.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {deliveryPoints.map((p, index) => (
                    <Box
                      key={p.id}
                      sx={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#ffeb3b',
                        border: '2px solid #000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </Box>
                  ))}

                  {shotPoints.map((p, index) => (
                    <Box
                      key={p.id}
                      sx={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        backgroundColor: '#ff5722',
                        border: '2px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
};

export default Teleop;
