// src/Pages/Scouting/Game/Auto.jsx

import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  Paper,
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { ThemeContext } from '../../../context/ThemeContext';

const Auto = ({ onChange }) => {
  const { theme } = useContext(ThemeContext);
  const isMobile = useMediaQuery('(max-width:600px)');

  // --- 2026 Auto State ---
  // We store logical grid coordinates (0-100 integer) so they are standard across devices
  const [startPosition, setStartPosition] = useState(null); // { x: 0-100, y: 0-100 }
  const [fuelPickupPoints, setFuelPickupPoints] = useState([]); // array of { id, x: 0-100, y: 0-100 }
  const [autoFuelScored, setAutoFuelScored] = useState(0); // number of balls scored in auto
  const [autoClimbPerformed, setAutoClimbPerformed] = useState(false);
  const [climbPosition, setClimbPosition] = useState(null); // 'left' | 'center' | 'right'

  // --- Helpers for field clicks ---
  const toGridCoords = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width; // 0-1
    const relY = (event.clientY - rect.top) / rect.height; // 0-1
    return {
      x: Math.round(relX * 100),
      y: Math.round(relY * 100),
    };
  };

  const handleFieldClick = (event, mode) => {
    const { x, y } = toGridCoords(event);

    if (mode === 'start') {
      setStartPosition({ x, y });
    } else if (mode === 'fuel') {
      setFuelPickupPoints((prev) => [
        ...prev,
        { id: Date.now(), x, y },
      ]);
    }
  };

  const handleClearFuelPoints = () => {
    setFuelPickupPoints([]);
  };

  useEffect(() => {
    if (!onChange) return;

    // Flat structure for DB, easier to work with later
    onChange({
      auto2026StartX: startPosition ? startPosition.x : null,
      auto2026StartY: startPosition ? startPosition.y : null,
      auto2026FuelPoints: fuelPickupPoints.map(({ x, y }) => ({ x, y })),
      auto2026FuelScored: autoFuelScored,
      auto2026ClimbPerformed: autoClimbPerformed,
      auto2026ClimbLevel: autoClimbPerformed ? 1 : null, // always 1 in auto
      auto2026ClimbSide: autoClimbPerformed ? climbPosition : null,
    });
  }, [startPosition, fuelPickupPoints, autoClimbPerformed, climbPosition, onChange, autoFuelScored]);

  const fieldBorderColor = theme === 'dark' ? '#4a5568' : '#d1d5db';
  const cardBg = theme === 'dark' ? '#111214' : '#ffffff';

  // Small helper to clamp the scored value
  const setClamped = (v) => setAutoFuelScored((typeof v === 'number') ? Math.max(0, Math.floor(v)) : 0);

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 3,
        direction: 'rtl', // Hebrew layout
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: 0,
          background: 'linear-gradient(90deg,#4c86af,#6fb1d8)',
          color: '#fff',
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
          width: '100%',
          fontSize: { xs: '1.25rem', sm: '1.6rem' },
          boxShadow: 2,
        }}
      >
        {'אוטונומי'}
      </Typography>

      <Divider sx={{ width: '100%' }} />

      {/* Main content: left = field, right = controls. Use Stack for responsive symmetry. */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ width: '100%', alignItems: 'stretch', justifyContent: 'center' }}
      >
        {/* Field area */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: { xs: '100%', md: '60%' } }}>
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              maxWidth: isMobile ? 360 : 520,
              borderRadius: 3,
              overflow: 'hidden',
              border: `2px solid ${fieldBorderColor}`,
            }}
          >
            <Box
              onClick={(e) => handleFieldClick(e, startPosition ? 'fuel' : 'start')}
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                backgroundColor: theme === 'dark' ? '#0b0b0b' : '#f7fafc',
                backgroundImage: 'url(/2026field.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'crosshair',
              }}
            >
              {/* Start position marker */}
              {startPosition && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${startPosition.x}%`,
                    top: `${startPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? 28 : 34,
                    height: isMobile ? 28 : 34,
                    borderRadius: '50%',
                    backgroundColor: '#22c55e',
                    border: '3px solid #fff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  }}
                />
              )}

              {/* Fuel pickup markers */}
              {fuelPickupPoints.map((p, index) => (
                <Box
                  key={p.id}
                  sx={{
                    position: 'absolute',
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? 26 : 30,
                    height: isMobile ? 26 : 30,
                    borderRadius: '50%',
                    backgroundColor: '#ffb020',
                    border: '3px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '0.75rem' : '0.85rem',
                    color: '#000',
                    fontWeight: '700',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  }}
                >
                  {index + 1}
                </Box>
              ))}
            </Box>

            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}>
                {startPosition ? 'נבחרה נקודת התחלה' : 'הקש פעם אחת על המגרש כדי לבחור נקודת התחלה'}
              </Typography>

              {startPosition && (
                <Button size={isMobile ? 'small' : 'small'} variant="outlined" onClick={() => { setStartPosition(null); setFuelPickupPoints([]); }}>
                  {'איפוס התחלה ונקודות איסוף'}
                </Button>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Controls area */}
        <Box sx={{ width: { xs: '100%', md: '40%' }, display: 'flex', justifyContent: 'center' }}>
          <Stack spacing={2} sx={{ width: '100%', maxWidth: 420 }}>
            {/* Card: pickup summary */}
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3, background: cardBg }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, textAlign: 'right' }}>
                {'נקודות איסוף כדורים באוטונומי'}
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}>
                  {'סה"כ נקודות איסוף:'}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{fuelPickupPoints.length}</Typography>
              </Stack>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button fullWidth size={isMobile ? 'large' : 'small'} variant="outlined" color="warning" onClick={handleClearFuelPoints}>
                  {'איפוס נקודות איסוף'}
                </Button>
                <Button fullWidth size={isMobile ? 'large' : 'small'} variant="contained" onClick={() => setFuelPickupPoints((p) => p.slice(0, -1))}>
                  {'בטל נקודה אחרונה'}
                </Button>
              </Box>
            </Paper>

            {/* Card: fuel scored (big, central) */}
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(180deg,#f8fafc,#ffffff)' }}>
              <Stack spacing={1} sx={{ alignItems: 'stretch' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, textAlign: 'right' }}>
                  {'כדורים שקלעו באוטונומי'}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant={isMobile ? 'h3' : 'h2'} sx={{ fontWeight: 900, color: '#0f172a', minWidth: 120, textAlign: 'center' }}>
                    {autoFuelScored}
                  </Typography>
                </Box>

                <Stack direction={isMobile ? 'column' : 'row'} spacing={1} sx={{ mt: 1 }}>
                  <Button fullWidth={isMobile} variant="outlined" size={isMobile ? 'large' : 'medium'} onClick={() => setClamped(0)}>
                    {'איפוס'}
                  </Button>
                  <Button fullWidth={isMobile} variant="outlined" size={isMobile ? 'large' : 'medium'} onClick={() => setClamped(autoFuelScored - 5)}>
                    {'-5'}
                  </Button>
                  <Button fullWidth={isMobile} variant="outlined" size={isMobile ? 'large' : 'medium'} onClick={() => setClamped(autoFuelScored - 1)}>
                    {'-1'}
                  </Button>
                  <Button fullWidth={isMobile} variant="contained" color="primary" size={isMobile ? 'large' : 'medium'} onClick={() => setClamped(autoFuelScored + 1)}>
                    {'+1'}
                  </Button>
                  <Button fullWidth={isMobile} variant="contained" color="primary" size={isMobile ? 'large' : 'medium'} onClick={() => setClamped(autoFuelScored + 5)}>
                    {'+5'}
                  </Button>
                </Stack>

                <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size={isMobile ? 'large' : 'small'}
                    label={'סה"כ סופי'}
                    type="number"
                    value={autoFuelScored}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setClamped(Number.isNaN(v) ? 0 : v);
                    }}
                  />
                </Box>
              </Stack>
            </Paper>

            {/* Card: climb controls */}
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3, background: cardBg }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {'טיפוס באוטונומי'}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoClimbPerformed}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAutoClimbPerformed(checked);
                        if (!checked) setClimbPosition(null);
                      }}
                      color="primary"
                    />
                  }
                  labelPlacement="start"
                  label={''}
                />
              </Stack>

              {autoClimbPerformed && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {'מיקום הטיפוס'}
                  </Typography>
                  <ToggleButtonGroup
                    value={climbPosition}
                    exclusive
                    onChange={(_, value) => value && setClimbPosition(value)}
                    fullWidth
                    size={isMobile ? 'small' : 'large'}
                  >
                    <ToggleButton value="right" sx={{ fontWeight: 700 }}>
                      {'ימין'}
                    </ToggleButton>
                    <ToggleButton value="center" sx={{ fontWeight: 700 }}>
                      {'אמצע'}
                    </ToggleButton>
                    <ToggleButton value="left" sx={{ fontWeight: 700 }}>
                      {'שמאל'}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}
            </Paper>

          </Stack>
        </Box>
      </Stack>

    </Box>
  );
};

export default Auto;
