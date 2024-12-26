import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";
import {
    Button, TextField, Select, MenuItem, Typography, FormControl, InputLabel, Box, Grid,
} from "@mui/material";
import TeleField from "./Game/Teleop";
import { db } from "../../firebase-config";
import { ref, set } from "firebase/database";

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
                ${formData.Name || "Unknown"},
                ${formData.Team || "Unknown"},
                ${formData.Match || "Unknown"},
                ${formData.checkboxes.filter(Boolean).length},
                ${formData.counter1},
                ${formData.TelePoints.filter(point => point.color === 1).length},
                ${formData.defensivePins},
                ${formData.TelePoints.filter(point => point.color === 2).length},
                ${formData.Pcounter},
                ${formData.climbed},
                ${formData.TelePoints.map(point => `(${point.x.toFixed(2)};${point.y.toFixed(2)};G)`).join(';')},
                ${formData.TelePoints.filter(point => point.color === 2).map(point => `(${point.x.toFixed(2)};${point.y.toFixed(2)};O)`).join(';')},
                ${formData.deliveryCount}
            `.replace(/\n/g, '').replace(/\s+/g, ' ').trim();

            return barcodeString.replace(/true/g, 'TRUE');
        };

        setBarcodeData(generateBarcode());
    }, [formData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.Team || !formData.Match || !formData.Alliance || !formData.Name) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const dbRef = ref(db, `scoutingData/${new Date().getTime()}`);
            await set(dbRef, { ...formData, submittedAt: new Date().toISOString() });
            alert("Submission successful!");
            setIsButtonDisabled(true);
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data. Please try again.");
        }
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Scouting Form
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Team"
                        variant="outlined"
                        fullWidth
                        name="Team"
                        value={formData.Team}
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

            <TeleField
                formData={formData}
                setFormData={setFormData}
                mode={mode}
                eraserMode={eraserMode}
                setEraserMode={setEraserMode}
            />

            <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                    sx={{ backgroundColor: '#4caf50' }}
                >
                    Submit
                </Button>
            </Box>

            <Box sx={{ textAlign: 'center', marginTop: '30px' }}>
                <QRCode value={barcodeData} size={256} />
            </Box>
        </Box>
    );
}

export default ScoutingForm;
