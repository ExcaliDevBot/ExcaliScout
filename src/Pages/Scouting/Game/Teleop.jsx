import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Card,
  CardContent,
  Stack,
  Chip,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
    DeleteOutline,
    EmojiEvents,
    DirectionsRun,
    TouchApp
} from '@mui/icons-material';
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

  // NEW: teleop climb + counter state
  const [teleopClimbPerformed, setTeleopClimbPerformed] = useState(false);
  const [teleopClimbLevel, setTeleopClimbLevel] = useState(null); // 1 | 2
  const [teleopClimbPosition, setTeleopClimbPosition] = useState(null); // 'left' | 'center' | 'right'

  const [ballCounter, setBallCounter] = useState(0);

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

  const handleSingleClick = (point) => {
    setShotPoints((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), ...point },
    ]);
  };

  const handleDoubleClick = (point) => {
    setDeliveryPoints((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), ...point },
    ]);
  };

  const handleFieldClick = (event) => {
    event.persist && event.persist(); // Safety for older React versions if needed
    const point = toGridCoords(event);

    // differentiate single vs double click manually so mobile taps still work
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      handleDoubleClick(point);
    } else {
      clickTimeoutRef.current = window.setTimeout(() => {
        handleSingleClick(point);
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
      // NEW: teleop climb + live counter
      teleop2026ClimbPerformed: teleopClimbPerformed,
      teleop2026ClimbLevel: teleopClimbPerformed ? teleopClimbLevel : null,
      teleop2026ClimbSide: teleopClimbPerformed ? teleopClimbPosition : null,
      teleop2026BallCounter: ballCounter,
    });
  }, [
    autoWinner,
    movedInAuto,
    deliveryPoints,
    shotPoints,
    estimatedBallsScored,
    teleopClimbPerformed,
    teleopClimbLevel,
    teleopClimbPosition,
    ballCounter,
    onChange,
  ]);

  const fieldBorderColor = theme === 'dark' ? '#888' : '#ccc';

  // Customized Styles for Mobile & RTL
  const cardStyle = {
    borderRadius: 3,
    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
    boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.1)',
    mb: 2,
    overflow: 'visible'
  };

  const sectionTitleStyle = {
    fontWeight: 'bold',
    mb: 2,
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    // Removed flexDirection: 'row-reverse' so items flow naturally in RTL (Icon then Text)
    // In RTL flex row, Start is Right. So [Icon] [Text] -> Icon is Rightmost.
    color: theme === 'dark' ? '#fff' : '#333'
  };

  const toggleGroupSx = {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    '& .MuiToggleButtonGroup-grouped': {
      flex: 1,
      minWidth: '80px',
      mx: 0.5,
      border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)'} !important`,
      borderRadius: '8px !important',
      margin: '4px !important',
    },
  };

  const toggleButtonSx = (selected, activeColor = '#4c86af') => ({
    py: 1,
    px: 2,
    fontWeight: 600,
    fontSize: '0.9rem',
    borderRadius: '12px !important',
    border: '1px solid transparent',
    color: theme === 'dark' ? '#ccc' : '#555',
    '&.Mui-selected': {
      backgroundColor: activeColor,
      color: '#fff',
      boxShadow: `0 4px 10px ${activeColor}55`,
    },
    '&.Mui-selected:hover': {
      backgroundColor: activeColor,
    },
  });

  const handleEstimatedBallsChange = (e) => {
    // Keep only digits, allow empty string
    const raw = e.target.value;
    const cleaned = raw.replace(/[^0-9]/g, '');
    setEstimatedBallsScored(cleaned);
  };

  const adjustBallCounter = (delta) => {
    setBallCounter((prev) => Math.max(0, prev + delta));
  };


  return (
    <Box
      sx={{
        padding: { xs: 1, sm: 2, md: 3 },
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
        direction: 'rtl',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        טלאופ
      </Typography>

      {/* Auto Summary Card */}
      <Card sx={cardStyle}>
        <CardContent>
            <Typography variant="h6" sx={sectionTitleStyle}>
                <EmojiEvents /> סיכום אוטונומי
            </Typography>

            <Stack spacing={3}>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>מי ניצח באוטונומי (מי קלע יותר)?</Typography>
                    <ToggleButtonGroup
                        value={autoWinner}
                        exclusive
                        onChange={(_, value) => value && setAutoWinner(value)}
                        sx={toggleGroupSx}
                    >
                        <ToggleButton value="blue" sx={toggleButtonSx(autoWinner === 'blue', '#2196f3')}>
                            כחול
                        </ToggleButton>
                        <ToggleButton value="red" sx={toggleButtonSx(autoWinner === 'red', '#f44336')}>
                            אדום
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box>
                    <Divider sx={{ mb: 2, opacity: 0.1 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>האם הרובוט זז?</Typography>
                    <ToggleButtonGroup
                        value={movedInAuto}
                        exclusive
                        onChange={(_, value) => value !== null && setMovedInAuto(value)}
                        sx={toggleGroupSx}
                    >
                        <ToggleButton value={true} sx={toggleButtonSx(movedInAuto === true, '#66bb6a')}>
                            <DirectionsRun sx={{ ml: 1 }} /> כן
                        </ToggleButton>
                        <ToggleButton value={false} sx={toggleButtonSx(movedInAuto === false, '#ef5350')}>
                            לא
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Stack>
        </CardContent>
      </Card>


      {/* Teleop Field & Scoring */}
      <Card sx={cardStyle}>
        <CardContent>
            <Typography variant="h6" sx={sectionTitleStyle}>
                <TouchApp /> התנהלות המשחק
            </Typography>

            <Box sx={{ mb: 3 }}>
                 <Box
                  onClick={handleFieldClick}
                  data-field="teleop-field"
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: `2px solid ${fieldBorderColor}`,
                    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f0f4f8',
                    backgroundImage: 'url(/2026field.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    touchAction: 'manipulation', // Improves touch response
                    mb: 2,
                  }}
                >
                  {/* Visual Hint Overlay - Simplified */}
                  {(deliveryPoints.length === 0 && shotPoints.length === 0) && (
                      <Box sx={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.1)', pointerEvents: 'none'
                       }}>
                          <Typography variant="caption" sx={{
                              color: '#fff',
                              fontWeight: 'bold',
                              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                              textAlign: 'center',
                              bgcolor: 'rgba(0,0,0,0.4)',
                              px: 1,
                              borderRadius: 1
                          }}>
                              לחיצה = זריקה | כפולה = דליברי
                          </Typography>
                      </Box>
                  )}

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
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
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
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        color: '#000',
                        fontWeight: 'bold',
                        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                    >
                      {index + 1}
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1}>
                        <Chip label={`דליברי: ${deliveryPoints.length}`} sx={{ bgcolor: '#fff9c4', color: '#fbc02d', fontWeight: 'bold' }} />
                        <Chip label={`זריקות: ${shotPoints.length}`} sx={{ bgcolor: '#ffccbc', color: '#d84315', fontWeight: 'bold' }} />
                    </Stack>
                    {(deliveryPoints.length > 0 || shotPoints.length > 0) && (
                        <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteOutline />}
                            onClick={handleClearField}
                        >
                            נקה
                        </Button>
                    )}
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Ball Counter - Simplified & Fixed Layout */}
            <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', opacity: 0.7 }}>
                     מונה כדורים (בזמן אמת)
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }}>
                        {ballCounter}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} justifyContent="center" sx={{ direction: 'ltr' }}>
                    {/* LTR direction forces [-] [NUMBER] [+] order which is intuitive for math even in RTL */}
                     <Button
                        variant="outlined"
                        color="error"
                        onClick={() => adjustBallCounter(-5)}
                        sx={{ minWidth: '48px', borderRadius: 3 }}
                     >
                        -5
                     </Button>
                     <Button
                        variant="outlined"
                        color="error"
                        onClick={() => adjustBallCounter(-1)}
                        sx={{ minWidth: '48px', borderRadius: 3 }}
                     >
                        -1
                     </Button>

                     <Box sx={{ width: 16 }} /> {/* Spacer */}

                     <Button
                        variant="contained"
                        color="primary"
                        onClick={() => adjustBallCounter(1)}
                        sx={{ minWidth: '48px', borderRadius: 3, boxShadow: 'none' }}
                     >
                        +1
                     </Button>
                     <Button
                        variant="contained"
                        color="primary"
                        onClick={() => adjustBallCounter(5)}
                        sx={{ minWidth: '48px', borderRadius: 3, boxShadow: 'none' }}
                     >
                        +5
                     </Button>
                </Stack>
            </Box>

            <Box sx={{ mt: 3 }}>
                <TextField
                    label="כמה כדורים נכנסו סה״כ?"
                    type="tel"
                    value={estimatedBallsScored}
                    onChange={handleEstimatedBallsChange}
                    fullWidth
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1 }
                    }}
                />
            </Box>

        </CardContent>
      </Card>


      {/* Endgame / Climb */}
      <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6" sx={sectionTitleStyle}>
                🏁 סיום (טיפוס)
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    טיפוס בטלאופ
                 </Typography>
                 <FormControlLabel
                    control={
                        <Switch
                            checked={teleopClimbPerformed}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setTeleopClimbPerformed(checked);
                                if (!checked) {
                                  setTeleopClimbLevel(null);
                                  setTeleopClimbPosition(null);
                                }
                            }}
                            color="primary"
                        />
                    }
                    labelPlacement="start"
                    label={'הרובוט טיפס?'}
                    sx={{ ml: 0 }}
                 />
            </Box>

            {teleopClimbPerformed && (
                <Stack spacing={2} sx={{ mt: 3, animation: 'fadeIn 0.5s ease-in-out' }}>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f5f5' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>גובה הטיפוס</Typography>
                        <ToggleButtonGroup
                            value={teleopClimbLevel}
                            exclusive
                            onChange={(_, value) => value && setTeleopClimbLevel(value)}
                            sx={toggleGroupSx}
                        >
                            <ToggleButton value={1} sx={toggleButtonSx(teleopClimbLevel === 1)}>
                                דרגה 1
                            </ToggleButton>
                            <ToggleButton value={2} sx={toggleButtonSx(teleopClimbLevel === 2)}>
                                דרגה 2
                            </ToggleButton>
                            <ToggleButton value={3} sx={toggleButtonSx(teleopClimbLevel === 3)}>
                                דרגה 3
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f5f5' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>מיקום הטיפוס</Typography>
                        <ToggleButtonGroup
                            value={teleopClimbPosition}
                            exclusive
                            onChange={(_, value) => value && setTeleopClimbPosition(value)}
                            sx={toggleGroupSx}
                        >
                            <ToggleButton value="right" sx={toggleButtonSx(teleopClimbPosition === 'right')}>
                                ימין
                            </ToggleButton>
                            <ToggleButton value="center" sx={toggleButtonSx(teleopClimbPosition === 'center')}>
                                אמצע
                            </ToggleButton>
                            <ToggleButton value="left" sx={toggleButtonSx(teleopClimbPosition === 'left')}>
                                שמאל
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Stack>
            )}

          </CardContent>
      </Card>

      {/* CSS Animation for Pop In */}
      <style>{`
        @keyframes popIn {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `}</style>
    </Box>
  );
};

export default Teleop;
