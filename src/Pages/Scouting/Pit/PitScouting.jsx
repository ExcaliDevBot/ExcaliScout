import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../../firebase-config";
import { ref, set } from "firebase/database";
import { UserContext } from "../../../context/UserContext";
import { ThemeContext } from "../../../context/ThemeContext";
import {
    Box,
    Button,
    Typography,
    TextField,
    CircularProgress,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    AlertTitle
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { amber } from '@mui/material/colors';

// Helper to create question data
const createQuestion = (id, label, type = 'toggle', options = []) => ({ id, label, type, options });

const questions = {
    capabilities: [
        createQuestion(0, "האם הרובוט יכול לטפס לגבוה"),
        createQuestion(1, "האם הרובוט יכול לטפס לנמוך"),
        createQuestion(2, "האם הרובוט מסוגל לנקד ב L1"),
        createQuestion(3, "האם הרובוט מסוגל לנקד בL2"),
        createQuestion(4, "האם הרובוט מסוגל לנקד ב L3"),
        createQuestion(5, "האם הרובוט מסוגל לנקד בL4"),
        createQuestion(6, "האם הרובוט מסוגל לאסוף מהרצפה"),
        createQuestion(7, "האם הרובוט מסוגל לאסוף מהפידר"),
        createQuestion(8, "האם הרובוט מסוגל לנקד Algae בפרוססור"),
        createQuestion(9, "האם הרובוט מסוגל לנקד Algae ברשת"),
    ],
    technical: [
        createQuestion(14, 'משקל הרובוט (ק"ג)', 'number'),
        createQuestion(15, 'מנועי הנעה (סוורב)', 'text'),
        createQuestion(16, 'מנועי סיבוב (סוורב)', 'text'),
        createQuestion(17, 'גודל מרכב (מטר, עשרוני)', 'number'),
        createQuestion(18, 'המרה בסוורב', 'text'),
        createQuestion(19, 'שניות לנקד ל-L4', 'number'),
        createQuestion(20, 'סייקלים ממוצע למקצה', 'number'),
    ],
    scout: [
        createQuestion(21, 'האם האיסוף מהפידר דורש דיוק כמו של 2230/2231?'),
        createQuestion(22, 'האם האיסוף מהפידר מתנדנד כמו הרובוט שלנו בעונה?'),
        createQuestion(23, 'האם האיסוף מהרצפה בגודל מרכב או פחות?'),
    ],
    notes: createQuestion(13, 'הערות כלליות אחרות', 'multiline'),
};

function PitScouting() {
    const { user } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { teamNumber } = location.state || {};
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [manualTeamNumber, setManualTeamNumber] = useState(teamNumber || "");

    useEffect(() => {
        if (!user) {
            console.error("משתמש לא נמצא.");
            navigate("/login");
        }
    }, [user, navigate]);

    const handleChange = (questionId, value) => {
        setFormData(prev => ({ ...prev, [questionId]: value }));
    };

    const handleToggleChange = (questionId, event, newValue) => {
        if (newValue !== null) {
            handleChange(questionId, newValue);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const dataToSend = {
            scout: user?.username || "משתמש לא ידוע",
            timestamp: new Date().toISOString(),
            answers: { ...formData },
        };

        try {
            const pitScoutingRef = ref(db, `pitScouting/${manualTeamNumber}`);
            await set(pitScoutingRef, dataToSend);
            alert("המידע נשלח בהצלחה!");
            navigate("/scouting"); // Navigate away after success
        } catch (error) {
            console.error("שגיאה בשליחת המידע:", error);
            alert("שגיאה בשליחת המידע.");
        } finally {
            setLoading(false);
        }
    };

    const renderQuestion = (q) => {
        switch (q.type) {
            case 'toggle':
                return (
                    <ToggleButtonGroup
                        value={formData[q.id]}
                        exclusive
                        onChange={(e, val) => handleToggleChange(q.id, e, val)}
                        fullWidth
                        size="small"
                    >
                        <ToggleButton value="yes" color="success">כן</ToggleButton>
                        <ToggleButton value="no" color="error">לא</ToggleButton>
                    </ToggleButtonGroup>
                );
            case 'number':
            case 'text':
                return (
                    <TextField
                        label={q.label}
                        variant="outlined"
                        fullWidth
                        size="small"
                        type={q.type}
                        value={formData[q.id] || ''}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                    />
                );
            case 'multiline':
                 return (
                    <TextField
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        label={q.label}
                        value={formData[q.id] || ''}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1000, margin: "auto", direction: "rtl" }}>
            <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" fontWeight="bold">פיט סקאוטינג</Typography>
                        <Typography variant="body2" color="text.secondary">סקאוט: {user ? user.username : "לא מחובר"}</Typography>
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: 250 } }}>
                        <TextField
                            label="מספר קבוצה"
                            variant="outlined"
                            fullWidth
                            required
                            disabled={!!teamNumber}
                            value={manualTeamNumber}
                            onChange={(e) => setManualTeamNumber(e.target.value.replace(/\D/g, ''))}
                            type="number"
                        />
                    </Box>
                </Stack>
            </Paper>

            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ '& .MuiAccordionSummary-content': { mr: 1 } }}>
                            <Typography variant="h6">יכולות רובוט</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                {questions.capabilities.map(q => (
                                    <Paper key={q.id} variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom>{q.label}</Typography>
                                        {renderQuestion(q)}
                                    </Paper>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ '& .MuiAccordionSummary-content': { mr: 1 } }}>
                            <Typography variant="h6">מפרט טכני</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                                {questions.technical.map(q => (
                                    <Paper key={q.id} variant="outlined" sx={{ p: 2 }}>
                                        {renderQuestion(q)}
                                    </Paper>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Paper variant="outlined" sx={{ p: 2 }}>
                        {renderQuestion(questions.notes)}
                    </Paper>

                    <Alert severity="warning" icon={false} sx={{ mt: 2, backgroundColor: theme === 'dark' ? amber[900] : amber[50], color: theme === 'dark' ? amber[50] : 'text.primary' }}>
                        <AlertTitle sx={{fontWeight: 'bold'}}>הערות של הסקאוטר בלבד</AlertTitle>
                        יש לענות על השאלות הבאות באופן עצמאי וללא עזרה מהקבוצה הנסקרת.
                    </Alert>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                        {questions.scout.map(q => (
                            <Paper key={q.id} variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>{q.label}</Typography>
                                {renderQuestion(q)}
                            </Paper>
                        ))}
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ minWidth: 200 }}
                            type="submit"
                            disabled={loading || !manualTeamNumber}
                        >
                            {loading ? <CircularProgress size={26} color="inherit" /> : 'שלח'}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
}

export default PitScouting;