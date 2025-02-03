import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { db } from '../../firebase-config';
import { ref, set, get, child } from 'firebase/database';
import { UserContext } from '../../context/UserContext';

const QRCodeScanner = () => {
    const [scanResult, setScanResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [cameraWidth, setCameraWidth] = useState(400);
    const [flashMode, setFlashMode] = useState(false);
    const [matchAlreadySubmitted, setMatchAlreadySubmitted] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');
    const { user: currentUser } = useContext(UserContext);
    const videoRef = useRef(null);

    useEffect(() => {
        const getCameras = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameras(videoDevices);
                if (videoDevices.length > 0) {
                    setSelectedCamera(videoDevices[0].deviceId);
                    startCamera(videoDevices[0].deviceId);
                } else {
                    alert('No cameras found');
                }
            } catch (error) {
                console.error('Error getting cameras:', error);
            }
        };

        getCameras();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async (deviceId) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } }
            });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error('Error starting camera:', error);
        }
    };

    const handleScan = async (content) => {
        if (content) {
            setScanResult(content);
            const parsedData = parseQRCodeData(content);
            if (parsedData) {
                const dataExists = await checkIfDataExists(parsedData);
                setMatchAlreadySubmitted(dataExists);
            }
        }
    };

    const checkIfDataExists = async (data) => {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `scoutingData`));
        if (snapshot.exists()) {
            const scoutingData = snapshot.val();
            return Object.values(scoutingData).some(entry => entry.matchId === data.matchId);
        }
        return false;
    };

    const handleSubmit = async () => {
        if (!scanResult) {
            alert("Please scan a QR code first.");
            return;
        }

        setLoading(true);

        try {
            const data = parseQRCodeData(scanResult);
            if (data) {
                const dataExists = await checkIfDataExists(data);
                if (dataExists) {
                    setLoading(false);
                    return;
                }

                const dbRef = ref(db, `scoutingData/${new Date().getTime()}`);
                const dataWithScannerInfo = {
                    ...data,
                    signedOffBy: currentUser?.username || 'Unknown User',
                    timestamp: new Date().toISOString(),
                };
                await set(dbRef, dataWithScannerInfo);
                alert('Data successfully added to Firebase!');
            } else {
                alert('Invalid QR code data.');
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data. Please try again.");
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
            return dataObject;
        } catch (error) {
            console.error("Error parsing QR code data:", error);
            return null;
        }
    };

    return (
        <Box
            sx={{
                padding: 3,
                maxWidth: '600px',
                margin: 'auto',
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: 2
            }}
        >
            <Typography variant="h4" gutterBottom>
                Scan QR Code
            </Typography>

            <Paper
                sx={{
                    padding: 3,
                    backgroundColor: '#fff',
                    boxShadow: 3,
                    marginBottom: 3,
                }}
            >
                <video ref={videoRef} style={{ width: '100%' }} autoPlay />
            </Paper>

            <Box sx={{ marginBottom: 3 }}>
                <TextField
                    label="Camera Width"
                    variant="outlined"
                    type="number"
                    value={cameraWidth}
                    onChange={(e) => setCameraWidth(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                />
                <Button
                    variant="outlined"
                    color={flashMode ? 'error' : 'primary'}
                    onClick={() => setFlashMode(!flashMode)}
                    sx={{ marginBottom: 2 }}
                >
                    {flashMode ? 'Turn Flash Off' : 'Turn Flash On'}
                </Button>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="camera-select-label">Select Camera</InputLabel>
                    <Select
                        labelId="camera-select-label"
                        value={selectedCamera}
                        label="Select Camera"
                        onChange={(e) => {
                            setSelectedCamera(e.target.value);
                            startCamera(e.target.value);
                        }}
                    >
                        {cameras.map((camera) => (
                            <MenuItem key={camera.deviceId} value={camera.deviceId}>
                                {camera.label || `Camera ${camera.deviceId}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {scanResult && (
                <Box sx={{ marginBottom: 3 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                        QR Code Data:
                    </Typography>
                    <Paper sx={{ padding: 2, backgroundColor: '#e0f7fa' }}>
                        <Typography variant="body1">{scanResult}</Typography>
                    </Paper>
                </Box>
            )}

            {matchAlreadySubmitted && (
                <Typography variant="body1" color="error" gutterBottom>
                    Match already submitted.
                </Typography>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || !scanResult || matchAlreadySubmitted}
                sx={{ paddingX: 4 }}
            >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Submit to Firebase'}
            </Button>
        </Box>
    );
};

export default QRCodeScanner;