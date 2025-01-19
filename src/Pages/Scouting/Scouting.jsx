import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";
import {
    Button,
    TextField,
    Select,
    MenuItem,
    Typography,
    FormControl,
    InputLabel,
    Box,
    Grid,
    Paper,
    Divider,
} from "@mui/material";
import { db } from "../../firebase-config";
import { ref, set } from "firebase/database";
import Teleop from "./Game/Teleop";
import Auto from "./Game/Auto";

function ScoutingForm() {
    const location = useLocation();
    const { match, user } = location.state || {};
    const isNewForm = !match;

    const [formData, setFormData] = useState({
        Name: user ? user.username : '',
        Team: match ? match.team_number : '',
        Match: match ? match.match_number : '',
        Alliance: match ? match.alliance : '',
        Notes: '',
        L1: 0,
        L2: 0,
        L3: 0,
        L4: 0,
        climbOption: '',
        autoAlgaeCount: 0,
        autoCoralCount: 0,
        algaeCount: 0
    });

    const [barcodeData, setBarcodeData] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        const generateBarcode = () => {
            const barcodeString = `
        Name: ${formData.Name || "Unknown"},
        Team: ${formData.Team || "Unknown"},
        Match: ${formData.Match || "Unknown"},
        Notes: ${formData.Notes || "Unknown"},
        L1: ${formData.L1 || 0},
        L2: ${formData.L2 || 0},
        L3: ${formData.L3 || 0},
        L4: ${formData.L4 || 0},
        AutoAlgaeCount: ${formData.autoAlgaeCount || 0},
        AutoCoralCount: ${formData.autoCoralCount || 0},
        AlgaeCount: ${formData.algaeCount || 0},
        ClimbOption: ${formData.climbOption || "None"}
        `.replace(/\n/g, "").replace(/\s+/g, " ").trim();

            return barcodeString.replace(/true/g, "TRUE");
        };

        setBarcodeData(generateBarcode());
    }, [formData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAutoChange = (autoData) => {
        setFormData((prev) => ({
            ...prev,
            ...autoData,
        }));
    };

    const handleTeleChange = ({ counters, climbOption }) => {
        setFormData((prev) => ({
            ...prev,
            ...counters,  // This will include L1, L2, L3, L4, and teleAlgaeCount
            climbOption,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.Team || !formData.Match || !formData.Alliance || !formData.Name) {
            alert("Please fill in all required fields.");
            return;
        }

        const dataToSubmit = {
            ...formData,
            submittedAt: new Date().toISOString(),
        };

        try {
            const dbRef = ref(db, `scoutingData/${new Date().getTime()}`);
            await set(dbRef, dataToSubmit);
            alert("Submission successful!");
            setIsButtonDisabled(true);
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data. Please try again.");
        }
    };

    return (
        <Box sx={{ padding: 3, maxWidth: '900px', margin: 'auto', textAlign: 'center' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Scouting Form
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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

                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Notes"
                        variant="outlined"
                        fullWidth
                        name="Notes"
                        value={formData.Notes}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ marginY: 3 }} />

            <Auto onChange={handleAutoChange} />

            <Divider sx={{ marginY: 3 }} />

            <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}>
                <Teleop onChange={handleTeleChange} />
            </Box>

            <Divider sx={{ marginY: 3 }} />

            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                    sx={{ backgroundColor: '#4caf50', paddingX: 4 }}
                >
                    Submit
                </Button>
            </Box>

            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Barcode
                </Typography>
                <Paper elevation={3} sx={{ display: 'inline-block', padding: 3, borderRadius: 2, marginBottom: 11 }}>
                    <QRCode value={barcodeData} size={256} />
                </Paper>
            </Box>
        </Box>
    );
}

export default ScoutingForm;