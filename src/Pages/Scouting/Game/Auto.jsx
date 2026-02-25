import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Divider,
  Paper,
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { ThemeContext } from '../../../context/ThemeContext';

const Auto = ({ onChange }) => {
  const { theme } = useContext(ThemeContext);

  // --- 2026 Auto State ---
  // We store logical grid coordinates (0-100 integer) so they are standard across devices
  const [startPosition, setStartPosition] = useState(null); // { x: 0-100, y: 0-100 }
  const [fuelPickupPoints, setFuelPickupPoints] = useState([]); // array of { id, x: 0-100, y: 0-100 }
  const [autoClimbPerformed, setAutoClimbPerformed] = useState(false);
  const [climbLevel, setClimbLevel] = useState(null); // 1 | 2 | 3
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
      auto2026ClimbPerformed: autoClimbPerformed,
      auto2026ClimbLevel: autoClimbPerformed ? climbLevel : null,
      auto2026ClimbSide: autoClimbPerformed ? climbPosition : null,
    });
  }, [startPosition, fuelPickupPoints, autoClimbPerformed, climbLevel, climbPosition, onChange]);

  const fieldBorderColor = theme === 'dark' ? '#888' : '#ccc';

  const toggleButtonSx = (selected) => ({
    fontWeight: 'bold',
    '&.Mui-selected': {
      backgroundColor: selected ? '#4c86af' : undefined,
      color: '#fff',
    },
    '&.Mui-selected:hover': {
      backgroundColor: '#3b6b8a',
    },
  });

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
          marginBottom: 1,
          backgroundColor: '#4c86af',
          color: '#fff',
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
          width: '100%',
          fontSize: { xs: '1.4rem', sm: '1.8rem' },
        }}
      >
        {'אוטונומי'}
      </Typography>

      <Divider sx={{ width: '100%' }} />

      {/* 2026 Field Section */}
      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid
          item
          xs={12}
          md={7}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Box
            onClick={(e) => handleFieldClick(e, startPosition ? 'fuel' : 'start')}
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 450,
              aspectRatio: '16 / 9',
              borderRadius: 2,
              overflow: 'hidden',
              border: `2px solid ${fieldBorderColor}`,
              backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f0f4f8',
              backgroundImage: 'url(/2026field.png)', // image already in public/
              backgroundSize: 'cover',
              backgroundPosition: 'center',
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
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  border: '2px solid #fff',
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
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: '#ff9800',
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

        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper
              elevation={2}
              sx={{
                padding: 2,
                borderRadius: 2,
                backgroundColor: theme === 'dark' ? '#2b2b2b' : '#fafafa',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {'נקודת התחלה באוטונומי'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {startPosition
                  ? 'עכשיו, כל נגיעה במגרש תוסיף נקודת איסוף כדורים.'
                  : 'גע פעם אחת במגרש כדי לבחור איפה הרובוט מתחיל.'}
              </Typography>
              {startPosition && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setStartPosition(null);
                    setFuelPickupPoints([]);
                  }}
                >
                  {'איפוס התחלה ונקודות איסוף'}
                </Button>
              )}
            </Paper>

            <Paper
              elevation={2}
              sx={{
                padding: 2,
                borderRadius: 2,
                backgroundColor: theme === 'dark' ? '#2b2b2b' : '#fafafa',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {'נקודות איסוף כדורים באוטונומי'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {'אחרי שסימנת נקודת התחלה: כל נגיעה במגרש מוסיפה נקודת איסוף ממוספרת.'}
              </Typography>
              {fuelPickupPoints.length > 0 && (
                <>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {'סה"כ נקודות איסוף: '} {fuelPickupPoints.length}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    onClick={handleClearFuelPoints}
                  >
                    {'איפוס נקודות איסוף'}
                  </Button>
                </>
              )}
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ width: '100%', my: 2 }} />

      {/* Auto climb selection */}
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          maxWidth: 600,
          padding: 2,
          borderRadius: 2,
          backgroundColor: theme === 'dark' ? '#2b2b2b' : '#fafafa',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {'טיפוס באוטונומי'}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={autoClimbPerformed}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAutoClimbPerformed(checked);
                    if (!checked) {
                      setClimbLevel(null);
                      setClimbPosition(null);
                    }
                  }}
                  color="primary"
                />
              }
              labelPlacement="start"
              label={'הרובוט טיפס בסוף האוטונומי'}
              sx={{ ml: 0 }}
            />
          </Box>

          {autoClimbPerformed && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {'גובה הטיפוס'}
                </Typography>
                <ToggleButtonGroup
                  value={climbLevel}
                  exclusive
                  onChange={(_, value) => value && setClimbLevel(value)}
                  fullWidth
                  size="large"
                >
                  <ToggleButton value={1} sx={toggleButtonSx(climbLevel === 1)}>
                    {'דרגה 1'}
                  </ToggleButton>
                  <ToggleButton value={2} sx={toggleButtonSx(climbLevel === 2)}>
                    {'דרגה 2'}
                  </ToggleButton>
                  <ToggleButton value={3} sx={toggleButtonSx(climbLevel === 3)}>
                    {'דרגה 3'}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {'מיקום הטיפוס'}
                </Typography>
                <ToggleButtonGroup
                  value={climbPosition}
                  exclusive
                  onChange={(_, value) => value && setClimbPosition(value)}
                  fullWidth
                  size="large"
                >
                  <ToggleButton value="right" sx={toggleButtonSx(climbPosition === 'right')}>
                    {'ימין'}
                  </ToggleButton>
                  <ToggleButton value="center" sx={toggleButtonSx(climbPosition === 'center')}>
                    {'אמצע'}
                  </ToggleButton>
                  <ToggleButton value="left" sx={toggleButtonSx(climbPosition === 'left')}>
                    {'שמאל'}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Auto;

