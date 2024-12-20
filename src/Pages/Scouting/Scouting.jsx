import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";
import {
    Button, TextField, Select, MenuItem, Typography, FormControl, InputLabel, Box, Grid,
} from "@mui/material";
import TeleField from "./Game/Teleop";
import { db } from "../../firebase-config";
import {ref, set} from "firebase/database";

function ScoutingForm() {
    const location = useLocation();
    const { match, user } = location.state || {};
    const isNewForm = !match;
    const [formData, setFormData] = useState({
        Name: user ? user.username : '',
        Team: match ? match.team_number : '',
        Match: match ? match.match_number : '',
        Alliance: match ? match.alliance : '',
        TeleNotes: '',
        checkboxes: Array(8).fill(false),
        TelePoints: [],
        Pcounter: 0,
        counter1: 0,
        counter2: 0,
        climbed: false,
        deliveryCount: 0,
        trapCounter: 0,
        defensivePins: 0,
    });
    const [barcodeData, setBarcodeData] = useState('');
    const [mode, setMode] = useState('teleop');
    const [eraserMode, setEraserMode] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        const generateBarcode = () => {
            const barcodeString = `
                ${user.username},
                ${match.team_number},
                ${match.match_number},
                ${formData.checkboxes.filter((checked) => checked).length},
                ${formData.counter1},
                ${formData.TelePoints.filter((point) => point.color === 1).length},
                ${formData.defensivePins},
                ${formData.TelePoints.filter((point) => point.color === 2).length},
                ${formData.Pcounter},
                ${formData.climbed},
                ${formData.TelePoints.map((point) => `(${point.x.toFixed(2)};${point.y.toFixed(2)};G)`).join(';')},
                ${formData.TelePoints.filter((point) => point.color === 2).map((point) => `(${point.x.toFixed(2)};${point.y.toFixed(2)};O)`).join(';')},
                ${formData.deliveryCount},
            `.replace(/\n/g, '').replace(/\s+/g, ' ').trim();

            return barcodeString.replace(/true/g, 'TRUE');
        };

        setBarcodeData(generateBarcode());
    }, [formData, mode, user]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { Team, Match, Alliance, Name } = formData;

        if (!Team || !Match || !Alliance || !Name) {
            alert("Please ensure all required fields are filled out.");
        }

        try {
            // Get a reference to the scoutingData node in Realtime Database
            const dbRef = ref(db, 'scoutingData/' + new Date().getTime());
            await set(dbRef, {
                ...formData,
                Team: match.team_number,
                Match: Match || "Unknown",
                Alliance: Alliance || "Unknown",
                Name: user.username || "Unknown",
                submittedAt: new Date().toISOString(),
            });
            alert("Submission successful!");
            setIsButtonDisabled(true);
        } catch (error) {
            console.error("Error submitting data:", error);
            alert(`Error submitting data: ${error.message}`);
        }
    };


    const handleAutoClick = () => setMode('checkbox');
    const handleTeleopClick = () => setMode('teleop');

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Scouting Form
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label=""
                        variant="outlined"
                        fullWidth
                        name="Team"
                        value={match.team_number}
                        onChange={handleInputChange}
                        disabled={!isNewForm}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Match"
                        variant="outlined"
                        fullWidth
                        name="Match"
                        value={formData.Match}
                        onChange={handleInputChange}
                        disabled={!isNewForm}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: 3 }}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Alliance</InputLabel>
                        <Select
                            label="Alliance"
                            name="Alliance"
                            value={formData.Alliance}
                            onChange={handleInputChange}
                            disabled={!isNewForm}
                        >
                            <MenuItem value="Red">Red</MenuItem>
                            <MenuItem value="Blue">Blue</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Notes"
                        variant="outlined"
                        fullWidth
                        name="TeleNotes"
                        value={formData.TeleNotes}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                    />
                </Grid>
            </Grid>

            <div className="button-container" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-evenly' }}>
                <Button
                    variant="contained"
                    onClick={handleAutoClick}
                    sx={{
                        backgroundColor: '#3f51b5',
                        '&:active': { backgroundColor: '#303f9f' },
                        '&:disabled': { backgroundColor: '#c5cae9' },
                    }}
                >
                    Autonomous
                </Button>
                <Button
                    variant="contained"
                    onClick={handleTeleopClick}
                    sx={{
                        backgroundColor: '#f44336',
                        '&:active': { backgroundColor: '#d32f2f' },
                        '&:disabled': { backgroundColor: '#ffebee' },
                    }}
                >
                    Teleop
                </Button>
            </div>

            <TeleField
                formData={formData}
                setFormData={setFormData}
                mode={mode}
                eraserMode={eraserMode}
                setEraserMode={setEraserMode}
            />

            <div className="submit-container" style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isButtonDisabled}
                    sx={{
                        backgroundColor: '#4caf50',
                        '&:active': { backgroundColor: '#388e3c' },
                        '&:disabled': { backgroundColor: '#c8e6c9' },
                    }}
                    onClick={handleSubmit}
                >
                    Send Data
                </Button>
            </div>

            <div className="barcode-container" style={{ textAlign: 'center', marginTop: '30px' }}>
                <QRCode value={barcodeData} size={256} />
            </div>
        </Box>
    );
}

export default ScoutingForm;
