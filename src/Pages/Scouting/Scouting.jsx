import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    Dialog,
    DialogContent,
    DialogTitle,
    Alert,
} from "@mui/material";
import { db } from "../../firebase-config";
import { ref, set, get, child } from "firebase/database";
import Teleop from "./Game/Teleop";
import Auto from "./Game/Auto";
import { ThemeContext } from "../../ThemeContext";
import { EmojiEvents, Star, HelpOutline } from '@mui/icons-material';
import QRCode from "qrcode.react"; // Ensure this import is present

function ScoutingForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { match, user } = location.state || {};
    const isNewForm = !match;
    const { theme } = useContext(ThemeContext);

    const [formData, setFormData] = useState({
        Name: user ? user.username : '',
        Team: match ? match.team_number : '',
        Match: match ? match.match_number : '',
        Alliance: match ? match.alliance : '',
        WinnerPrediction: '',
        Notes: '',
        L1: 0,
        L2: 0,
        L3: 0,
        L4: 0,
        climbOption: '',
        autoAlgaeCount: 0,
        autoCoralCount: 0,
        algaeCount: 0,
    });

    const [barcodeData, setBarcodeData] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [winnerDialogOpen, setWinnerDialogOpen] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        const generateBarcode = () => {
            const barcodeString = `
        Name: ${formData.Name || "Unknown"},
        Team: ${formData.Team || "Unknown"},
        Match: ${formData.Match || "Unknown"},
        WinnerPrediction: ${formData.WinnerPrediction || "None"},
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

    useEffect(() => {
        const checkIfDataExists = async (team, match) => {
            const nodeName = `M${match}T${team}`;
            const dbRef = ref(db);
            const snapshot = await get(child(dbRef, `scoutingData/${nodeName}`));
            return snapshot.exists();
        };

        if (formData.Team && formData.Match) {
            checkIfDataExists(formData.Team, formData.Match).then(exists => {
                if (exists) {
                    navigate('/my_matches');
                }
            });
        }
    }, [formData.Team, formData.Match, navigate]);

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
            ...counters,
            climbOption,
        }));
    };

    const handleWinnerSelect = (winner) => {
        setFormData((prev) => ({ ...prev, WinnerPrediction: winner }));
        setWinnerDialogOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.Team || !formData.Match || !formData.Alliance || !formData.Name || !formData.WinnerPrediction) {
            setAlertMessage("Please fill in all required fields.");
            setAlertSeverity("warning");
            return;
        }

        const dataToSubmit = {
            ...formData,
            submittedAt: new Date().toISOString(),
        };

        try {
            const nodeName = `M${formData.Match}T${formData.Team}`;
            const dbRef = ref(db, `scoutingData/${nodeName}`);
            await set(dbRef, dataToSubmit);
            setAlertMessage("Submission successful!");
            setAlertSeverity("success");
            setIsButtonDisabled(true);
        } catch (error) {
            console.error("Error submitting data:", error);
            setAlertMessage("Error submitting data. Please try again.");
            setAlertSeverity("error");
        }
    };

    return (
        <>
            <Dialog open={winnerDialogOpen} onClose={() => { }} disableBackdropClick>
                <DialogTitle>Which Alliance Do You Think Will Win?</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => handleWinnerSelect("Red")}
                            sx={{ backgroundColor: '#ff0000', color: '#fff', '&:hover': { backgroundColor: '#ff0000' } }}
                        >
                            Red
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleWinnerSelect("Tie")}
                            sx={{ backgroundColor: '#9e9e9e', color: '#fff', '&:hover': { backgroundColor: '#757575' } }}
                        >
                            Tie
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleWinnerSelect("Blue")}
                            sx={{ backgroundColor: '#00458c', color: '#fff', '&:hover': { backgroundColor: '#00458c' } }}
                        >
                            Blue
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            <Box
                sx={{
                    padding: 3,
                    maxWidth: '900px',
                    margin: 'auto',
                    textAlign: 'center',
                    backgroundColor: theme === 'dark' ? '#121212' : '#fff',
                    color: theme === 'dark' ? '#fff' : '#000',
                    borderRadius: 2,
                    boxShadow: 4,
                }}
            >
                <Typography variant="h4" gutterBottom>
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
                            InputProps={{
                                style: { color: 'inherit' },
                            }}
                            sx={{
                                backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                            }}
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
                            InputProps={{
                                style: { color: 'inherit' },
                            }}
                            sx={{
                                backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                            }}
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
                                sx={{
                                    backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                                    color: 'inherit',
                                }}
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
                            InputProps={{
                                style: { color: 'inherit' },
                            }}
                            sx={{
                                backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                            }}
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


                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        padding: 2,
                        border: "1px solid",
                        borderColor: theme === "dark" ? "#555" : "#ccc",
                        borderRadius: 2,
                        backgroundColor: theme === "dark" ? "#1c1c1c" : "#f9f9f9",
                        boxShadow: 3,
                        maxWidth: "400px",
                        margin: "0 auto",
                    }}
                >
                    {formData.WinnerPrediction === "Red" && (
                        <EmojiEvents color="error" style={{ marginRight: 8 }} />
                    )}
                    {formData.WinnerPrediction === "Blue" && (
                        <Star color="primary" style={{ marginRight: 8 }} />
                    )}
                    {formData.WinnerPrediction === "Tie" && (
                        <HelpOutline color="action" style={{ marginRight: 8 }} />
                    )}

                    <Typography
                        variant="h6"
                        sx={{
                            color: theme === "dark" ? "#fff" : "#000",
                        }}
                    >
                        Predicted Winner: {formData.WinnerPrediction || "None"}
                    </Typography>
                </Box>

                <Divider sx={{ marginY: 3 }} />

                <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isButtonDisabled}
                        sx={{
                            backgroundColor: '#4c74af',
                            '&:hover': { backgroundColor: '#388e3c' },
                            color: '#fff',
                            paddingX: 6, // Increase padding for a bigger button
                            paddingY: 2, // Increase padding for a bigger button
                            fontSize: '1.25rem', // Increase font size for a bigger button
                        }}
                    >
                        Submit
                    </Button>
                </Box>

                {alertMessage && (
                    <Alert severity={alertSeverity} sx={{ marginTop: 2 }}>
                        {alertMessage}
                    </Alert>
                )}

                <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Barcode
                    </Typography>
                    <Paper
                        elevation={3}
                        sx={{
                            display: 'inline-block',
                            padding: 3,
                            borderRadius: 2,
                            backgroundColor: '#fff',
                        }}
                    >
                        <QRCode value={barcodeData} size={256} />
                    </Paper>
                </Box>
            </Box>
        </>
    );
}

export default ScoutingForm;