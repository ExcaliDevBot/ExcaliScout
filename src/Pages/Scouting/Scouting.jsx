import React, {useEffect, useState, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
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
import {db} from "../../firebase-config";
import {ref, set, get, child} from "firebase/database";
import Teleop from "./Game/Teleop";
import Auto from "./Game/Auto";
import {ThemeContext} from "../../context/ThemeContext";
import {LanguageContext} from "../../context/LanguageContext";
import {EmojiEvents, Star, HelpOutline} from '@mui/icons-material';
import QRCode from "qrcode.react";
import translations from '../../translations';

const ScoutingForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {match, user} = location.state || {};
    const isNewForm = !match;
    const {theme} = useContext(ThemeContext);
    const {language} = useContext(LanguageContext);
    const t = translations[language];

    const [formData, setFormData] = useState({
        Name: user ? user.username : '',
        Team: match ? match.team_number : '',
        Match: match ? match.match_number : '',
        Alliance: match ? match.alliance : '',
        WinnerPrediction: '',
        Notes: '',
        // 2026 auto & teleop keys will be merged in from children
    });

    const [barcodeData, setBarcodeData] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [winnerDialogOpen, setWinnerDialogOpen] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        const generateBarcode = () => {
            // Compact, 2026-specific barcode payload as JSON string
            const payload = {
                n: formData.Name || 'Unknown',
                t: formData.Team || 'Unknown',
                m: formData.Match || 'Unknown',
                a: formData.Alliance || 'Unknown',
                wp: formData.WinnerPrediction || 'None',
                notes: formData.Notes || '',

                // 2026 AUTO
                aStartX: formData.auto2026StartX ?? null,
                aStartY: formData.auto2026StartY ?? null,
                aFuel: formData.auto2026FuelPoints || [], // [{x,y}]
                aCl: formData.auto2026ClimbPerformed ?? false,
                aClLvl: formData.auto2026ClimbLevel ?? null,
                aClSide: formData.auto2026ClimbSide || null,

                // 2026 TELEOP
                tAutoW: formData.teleop2026AutoWinner || null, // 'red' | 'blue'
                tMoved: formData.teleop2026MovedInAuto ?? null, // bool
                tDel: formData.teleop2026DeliveryPoints || [], // [{x,y}]
                tShot: formData.teleop2026ShotPoints || [], // [{x,y}]
                tBalls: formData.teleop2026EstimatedBalls ?? null,
            };

            // QR content as single-line JSON
            return JSON.stringify(payload);
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
        const {name, value} = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleAutoChange = (autoData) => {
        // autoData already comes as flat 2026 keys from Auto.jsx
        setFormData((prev) => ({
            ...prev,
            ...autoData,
        }));
    };

    const handleTeleChange = (teleData) => {
        // teleData already comes as flat 2026 keys from Teleop.jsx
        setFormData((prev) => ({
            ...prev,
            ...teleData,
        }));
    };

    const handleWinnerSelect = (winner) => {
        setFormData((prev) => ({...prev, WinnerPrediction: winner}));
        setWinnerDialogOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const {
            Team,
            Match,
            Alliance,
            Name,
            WinnerPrediction,
        } = formData;

        // Only basic fields are required now
        if (!Team || !Match || !Alliance || !Name || !WinnerPrediction) {
            setAlertMessage(language === 'he'
                ? 'נא למלא קבוצה, משחק, ברית, שם ומי צפית שינצח.'
                : 'Please fill in team, match, alliance, name, and predicted winner.');
            setAlertSeverity('warning');
            return false;
        }

        const dataToSubmit = {
            ...formData,
            submittedAt: new Date().toISOString(),
        };

        try {
            const nodeName = `M${formData.Match}T${formData.Team}`;
            const dbRef = ref(db, `scoutingData/${nodeName}`);
            await set(dbRef, dataToSubmit);
            setAlertMessage(t.submissionSuccess);
            setAlertSeverity('success');
            setIsButtonDisabled(true);
        } catch (error) {
            console.error('Error submitting data:', error);
            setAlertMessage(t.submissionError);
            setAlertSeverity('error');
        }
    };

    return (
        <>
            <Dialog open={winnerDialogOpen} onClose={() => {
            }} disableBackdropClick>
                <DialogTitle>{t.whichAlliance}</DialogTitle>
                <DialogContent>
                    <Box sx={{display: 'flex', justifyContent: 'space-around', marginTop: 2}}>
                        <Button
                            variant="contained"
                            onClick={() => handleWinnerSelect("Red")}
                            sx={{backgroundColor: '#ff0000', color: '#fff', '&:hover': {backgroundColor: '#ff0000'}}}
                        >
                            {t.red}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleWinnerSelect("Tie")}
                            sx={{backgroundColor: '#9e9e9e', color: '#fff', '&:hover': {backgroundColor: '#757575'}}}
                        >
                            {t.tie}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleWinnerSelect("Blue")}
                            sx={{backgroundColor: '#00458c', color: '#fff', '&:hover': {backgroundColor: '#00458c'}}}
                        >
                            {t.blue}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Alert severity="info">{t.rememberTrack}</Alert>

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
                    direction: language === 'he' ? 'rtl' : 'ltr',
                }}
            >
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={t.team}
                            variant="outlined"
                            fullWidth
                            name="Team"
                            value={formData.Team}
                            onChange={handleInputChange}
                            disabled={!isNewForm}
                            InputProps={{
                                style: {color: 'inherit'},
                            }}
                            sx={{
                                backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={t.match}
                            variant="outlined"
                            fullWidth
                            name="Match"
                            value={formData.Match}
                            onChange={handleInputChange}
                            disabled={!isNewForm}
                            InputProps={{
                                style: {color: 'inherit'},
                            }}
                            sx={{
                                backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} sx={{marginTop: 3}}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>{t.alliance}</InputLabel>
                            <Select
                                label={t.alliance}
                                name="Alliance"
                                value={formData.Alliance}
                                onChange={handleInputChange}
                                disabled={!isNewForm}
                                sx={{
                                    backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                                    color: 'inherit',
                                }}
                            >
                                <MenuItem value="Red">{t.red}</MenuItem>
                                <MenuItem value="Blue">{t.blue}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={t.notes}
                            variant="outlined"
                            fullWidth
                            name="Notes"
                            value={formData.Notes}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                            InputProps={{
                                style: {color: 'inherit'},
                            }}
                            sx={{
                                backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                            }}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{marginY: 3}}/>

                <Auto onChange={handleAutoChange} />

                <Divider sx={{marginY: 3}}/>

                <Box sx={{marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1}}>
                    <Teleop onChange={handleTeleChange} />
                    <Typography variant="caption" sx={{ color: theme === 'dark' ? '#ccc' : '#555' }}>
                        {'בטלאופ: נגיעה אחת במגרש = נקודת זריקה, לחיצה כפולה = נקודת דליברי (אם סימנת דליברי).'}
                    </Typography>
                </Box>

                <Divider sx={{marginY: 3}}/>

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
                        <EmojiEvents color="error" style={{marginRight: 8}}/>
                    )}
                    {formData.WinnerPrediction === "Blue" && (
                        <Star color="primary" style={{marginRight: 8}}/>
                    )}
                    {formData.WinnerPrediction === "Tie" && (
                        <HelpOutline color="action" style={{marginRight: 8}}/>
                    )}

                    <Typography
                        variant="h6"
                        sx={{
                            color: theme === "dark" ? "#fff" : "#000",
                        }}
                    >
                        {t.predictedWinner}: {formData.WinnerPrediction || "None"}
                    </Typography>
                </Box>

                <Divider sx={{marginY: 3}}/>

                <Box sx={{textAlign: 'center', marginTop: 4}}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isButtonDisabled}
                        sx={{
                            backgroundColor: '#4c74af',
                            color: '#fff',
                            paddingX: 6,
                            paddingY: 2,
                            fontSize: '1.25rem',
                        }}
                    >
                        {t.submit}
                    </Button>
                </Box>

                {alertMessage && (
                    <Alert severity={alertSeverity} sx={{marginTop: 2}}>
                        {alertMessage}
                    </Alert>
                )}

                <Box sx={{textAlign: 'center', marginTop: 2}}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            const localData = JSON.parse(localStorage.getItem("offlineSubmissions")) || [];
                            localData.push({...formData, submittedAt: new Date().toISOString()});
                            localStorage.setItem("offlineSubmissions", JSON.stringify(localData));
                            setAlertMessage(t.savedLocally || "Saved locally!");
                            setAlertSeverity("info");
                        }}
                        sx={{
                            borderColor: '#4c74af',
                            color: '#4c74af',
                            paddingX: 4,
                            paddingY: 1.5,
                            fontSize: '1rem',
                        }}
                    >
                        {t.saveLocally || "Save Locally"}
                    </Button>
                </Box>

                <Box sx={{textAlign: 'center', marginTop: 4}}>
                    <Typography variant="h6" gutterBottom>
                        {t.barcode}
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
                        <QRCode value={barcodeData} size={256}/>
                    </Paper>
                </Box>
            </Box>
        </>
    );
};

export default ScoutingForm;
