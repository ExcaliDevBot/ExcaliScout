import React, { useState, useContext } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, TextField } from '@mui/material';
import QRScanner from 'react-qr-scanner'; // Import the new QR Scanner component
import { db } from '../../firebase-config'; // Firebase setup
import { ref, set } from 'firebase/database';
import { UserContext } from '../../context/UserContext'; // Import UserContext

const QRCodeScanner = () => {
    const [scanResult, setScanResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [cameraWidth, setCameraWidth] = useState(400); // Default camera width
    const [flashMode, setFlashMode] = useState(false); // Flash mode state
    const { user: currentUser } = useContext(UserContext); // Get current user from context

    const handleScan = (data) => {
        if (data) {
            setScanResult(data.text);
        }
    };

    const handleError = (error) => {
        console.error('Error scanning QR code:', error);
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
                const dbRef = ref(db, `scoutingData/${new Date().getTime()}`);
                const dataWithScannerInfo = {
                    ...data,
                    signedOffBy: currentUser?.username || 'Unknown User', // Use current user's username
                    timestamp: new Date().toISOString(), // Add timestamp for reference
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

            {/* QR Scanner Settings */}
            <Paper
                sx={{
                    padding: 3,
                    backgroundColor: '#fff',
                    boxShadow: 3,
                    marginBottom: 3,
                }}
            >
                <QRScanner
                    delay={300}
                    style={{ width: '100%' }}
                    onError={handleError}
                    onScan={handleScan}
                    facingMode="environment"
                    width={cameraWidth}
                    flashMode={flashMode ? 'torch' : 'off'}
                />
            </Paper>

            {/* Customization Inputs */}
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
            </Box>

            {/* Display Scanned Data */}
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

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || !scanResult}
                sx={{ paddingX: 4 }}
            >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Submit to Firebase'}
            </Button>
        </Box>
    );
};

export default QRCodeScanner;