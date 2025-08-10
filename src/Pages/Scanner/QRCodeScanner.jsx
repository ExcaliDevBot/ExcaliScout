import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    CircularProgress,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Alert,
    IconButton,
    Fab
} from '@mui/material';
import { CameraAlt, FlashOn, FlashOff, Cameraswitch } from '@mui/icons-material';
import { db } from '../../firebase-config';
import { ref, set, get } from 'firebase/database';
import { UserContext } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import QrScanner from 'qr-scanner';

const QRCodeScanner = () => {
    const [scanResult, setScanResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [flashMode, setFlashMode] = useState(false);
    const [matchAlreadySubmitted, setMatchAlreadySubmitted] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [alert, setAlert] = useState(null);
    const { user: currentUser } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);

    useEffect(() => {
        const getCameras = async () => {
            try {
                const cameras = await QrScanner.listCameras(true);
                setCameras(cameras);
                if (cameras.length > 0) {
                    setSelectedCamera(cameras[0].id);
                }
            } catch (error) {
                console.error('Error getting cameras:', error);
                setAlert({ severity: 'error', message: 'No cameras found or camera access denied' });
            }
        };

        getCameras();
        return () => {
            if (qrScannerRef.current) {
                qrScannerRef.current.destroy();
            }
        };
    }, []);

    const startScanning = async () => {
        if (!videoRef.current) return;

        try {
            setIsScanning(true);
            qrScannerRef.current = new QrScanner(
                videoRef.current,
                (result) => handleScanResult(result.data),
                {
                    preferredCamera: selectedCamera,
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );
            await qrScannerRef.current.start();
        } catch (error) {
            console.error('Error starting scanner:', error);
            setAlert({ severity: 'error', message: 'Failed to start camera' });
            setIsScanning(false);
        }
    };

    const stopScanning = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
            qrScannerRef.current.destroy();
            qrScannerRef.current = null;
        }
        setIsScanning(false);
    };

    const handleScanResult = async (result) => {
        try {
            console.log('Scanned content:', result);
            setScanResult(result);
            const parsedData = parseQRCodeData(result);
            if (parsedData) {
                const dataExists = await checkIfDataExists(parsedData);
                setMatchAlreadySubmitted(dataExists);
                if (dataExists) {
                    setAlert({ severity: 'warning', message: 'Match already submitted!' });
                } else {
                    setAlert({ severity: 'success', message: 'QR Code scanned successfully!' });
                }
            }
            stopScanning();
        } catch (e) {
            console.error('Error processing scanned result:', e);
            setAlert({ severity: 'error', message: 'Error processing QR code' });
        }
    };

    const checkIfDataExists = async (data) => {
        try {
            const nodeName = `M${data.Match}T${data.Team}`;
            const dbRef = ref(db, `scoutingData/${nodeName}`);
            const snapshot = await get(dbRef);
            return snapshot.exists();
        } catch (error) {
            console.error('Error checking if data exists:', error);
        }
        return false;
    };

    const handleSubmit = async () => {
        if (!scanResult) {
            setAlert({ severity: 'warning', message: 'Please scan a QR code first.' });
            return;
        }

        setLoading(true);

        try {
            const data = parseQRCodeData(scanResult);
            if (data) {
                const dataExists = await checkIfDataExists(data);
                if (dataExists) {
                    setAlert({ severity: 'error', message: 'Match data already exists!' });
                    setLoading(false);
                    return;
                }

                const dataToSubmit = {
                    ...data,
                    removeAlgae: parseInt(data.autoRemoveAlgae || 0) + parseInt(data.removeAlgae || 0),
                    submittedAt: new Date().toISOString(),
                };

                const nodeName = `M${data.Match}T${data.Team}`;
                const dbRef = ref(db, `scoutingData/${nodeName}`);
                await set(dbRef, dataToSubmit);
                setAlert({ severity: 'success', message: 'Data successfully submitted!' });
                setScanResult('');
                setMatchAlreadySubmitted(false);
            } else {
                setAlert({ severity: 'error', message: 'Invalid QR code data.' });
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            setAlert({ severity: 'error', message: 'Error submitting data. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const parseQRCodeData = (data) => {
        try {
            const dataObject = {};
            data.split(',').forEach((item) => {
                const [key, value] = item.split(':').map((str) => str.trim());
                if (key && value) {
                    dataObject[key] = value;
                }
            });
            console.log('Parsed QR code data:', dataObject);
            return dataObject;
        } catch (error) {
            console.error("Error parsing QR code data:", error);
            return null;
        }
    };

    const toggleFlash = async () => {
        if (qrScannerRef.current) {
            try {
                await qrScannerRef.current.setFlash(!flashMode);
                setFlashMode(!flashMode);
            } catch (error) {
                console.error('Flash not supported:', error);
                setAlert({ severity: 'warning', message: 'Flash not supported on this device' });
            }
        }
    };

    const switchCamera = async () => {
        if (cameras.length > 1) {
            const currentIndex = cameras.findIndex(cam => cam.id === selectedCamera);
            const nextIndex = (currentIndex + 1) % cameras.length;
            const nextCamera = cameras[nextIndex];
            setSelectedCamera(nextCamera.id);
            
            if (qrScannerRef.current) {
                await qrScannerRef.current.setCamera(nextCamera.id);
            }
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
                padding: 2,
            }}
        >
            <Card
                sx={{
                    maxWidth: '100%',
                    margin: 'auto',
                    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
                    borderRadius: 3,
                    overflow: 'hidden',
                }}
            >
                <CardContent sx={{ padding: 3 }}>
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                            textAlign: 'center',
                            color: theme === 'dark' ? '#d4af37' : '#012265',
                            fontWeight: 'bold',
                            mb: 3
                        }}
                    >
                        QR Code Scanner
                    </Typography>

                    {alert && (
                        <Alert 
                            severity={alert.severity} 
                            sx={{ mb: 3 }}
                            onClose={() => setAlert(null)}
                        >
                            {alert.message}
                        </Alert>
                    )}

                    {/* Camera Controls */}
                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Camera</InputLabel>
                            <Select
                                value={selectedCamera}
                                label="Select Camera"
                                onChange={(e) => setSelectedCamera(e.target.value)}
                                disabled={isScanning}
                            >
                                {cameras.map((camera) => (
                                    <MenuItem key={camera.id} value={camera.id}>
                                        {camera.label || `Camera ${camera.id}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Camera View */}
                    <Paper
                        elevation={3}
                        sx={{
                            position: 'relative',
                            backgroundColor: '#000',
                            borderRadius: 2,
                            overflow: 'hidden',
                            mb: 3,
                            minHeight: '300px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <video
                            ref={videoRef}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '400px',
                                objectFit: 'cover',
                            }}
                        />
                        
                        {/* Camera Controls Overlay */}
                        {isScanning && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    gap: 2,
                                }}
                            >
                                <Fab
                                    size="small"
                                    onClick={toggleFlash}
                                    sx={{
                                        backgroundColor: flashMode ? '#ff9800' : 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            backgroundColor: flashMode ? '#f57c00' : 'rgba(255,255,255,0.9)',
                                        },
                                    }}
                                >
                                    {flashMode ? <FlashOff /> : <FlashOn />}
                                </Fab>
                                
                                {cameras.length > 1 && (
                                    <Fab
                                        size="small"
                                        onClick={switchCamera}
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.8)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                            },
                                        }}
                                    >
                                        <Cameraswitch />
                                    </Fab>
                                )}
                            </Box>
                        )}
                        
                        {!isScanning && (
                            <Box sx={{ textAlign: 'center', color: '#fff' }}>
                                <CameraAlt sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" sx={{ opacity: 0.7 }}>
                                    Camera Ready
                                </Typography>
                            </Box>
                        )}
                    </Paper>

                    {/* Scan Controls */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={isScanning ? stopScanning : startScanning}
                            disabled={!selectedCamera}
                            sx={{
                                py: 2,
                                fontSize: '1.1rem',
                                backgroundColor: isScanning ? '#f44336' : (theme === 'dark' ? '#d4af37' : '#012265'),
                                '&:hover': {
                                    backgroundColor: isScanning ? '#d32f2f' : (theme === 'dark' ? '#b8941f' : '#001a4b'),
                                },
                            }}
                        >
                            {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                        </Button>
                    </Box>

                    {/* Scan Result */}
                    {scanResult && (
                        <Card
                            sx={{
                                mb: 3,
                                backgroundColor: theme === 'dark' ? '#2e2e2e' : '#f8f9fa',
                                border: matchAlreadySubmitted ? '2px solid #f44336' : '2px solid #4caf50',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: theme === 'dark' ? '#d4af37' : '#012265' }}>
                                    Scanned Data:
                                </Typography>
                                <Paper
                                    sx={{
                                        p: 2,
                                        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                                        maxHeight: '200px',
                                        overflow: 'auto',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'monospace',
                                            wordBreak: 'break-all',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        {scanResult}
                                    </Typography>
                                </Paper>
                            </CardContent>
                        </Card>
                    )}

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading || !scanResult || matchAlreadySubmitted}
                        sx={{
                            py: 2,
                            fontSize: '1.2rem',
                            backgroundColor: theme === 'dark' ? '#d4af37' : '#012265',
                            '&:hover': {
                                backgroundColor: theme === 'dark' ? '#b8941f' : '#001a4b',
                            },
                            '&:disabled': {
                                backgroundColor: '#ccc',
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: '#fff' }} />
                        ) : (
                            'Submit to Database'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default QRCodeScanner;