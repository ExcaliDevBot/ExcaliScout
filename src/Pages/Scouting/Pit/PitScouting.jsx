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
    Select,
    MenuItem,
    Divider,
    Card,
    CardContent,
    Container,
    Chip,
    Avatar,
    Alert,
    Fade,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    FormControl,
    InputLabel,
    Grid,
    IconButton,
    Tooltip
} from "@mui/material";
import {
    Engineering,
    Person,
    CheckCircle,
    Settings,
    Warning,
    Speed,
    Build,
    Assessment
} from '@mui/icons-material';

const questionsList = {
    0: { question: "גובה הטיפוס (מטר מקסימלי)", type: "scale" },
    1: { question: "האם הטיפוס מפריע לקבוצה אחרת לטפס", type: "yesno" },
    2: { question: "האם הרובוט מסוגל לנקד ב L1", type: "yesno" },
    3: { question: "האם הרובוט מסוגל לנקד בL2 ", type: "yesno" },
    4: { question: "האם הרובוט מסוגל לנקד ב L3", type: "yesno" },
    5: { question: "האם הרובוט מסוגל לנקד בL4 ", type: "yesno" },
    6: { question: "האם הרובוט מסוגל לאסוף מהרצפה", type: "yesno" },
    7: { question: "האם הרובוט מסוגל לאסוף מהפידר", type: "yesno" },
    8: { question: "האם הרובוט מסוגל לנקד Algae בפרוססור", type: "yesno" },
    9: { question: "האם הרובוט מסוגל לנקד Algae ברשת", type: "yesno" },
    10: { question: "האם הרובוט יוצא מאזור ההתחלה באוטונומי", type: "yesno" },
    11: { question: "האם אתם מסוגלים להעיף Algae מהריף", type: "yesno" },
    12: { question: "תאר פירוט אוטונומיי לגבי כל מסלול", type: "open" },
    13: { question: "הערות כלליות אחרות", type: "open" },
};

const steps = [
    { label: 'Team Information', icon: <Person /> },
    { label: 'Robot Capabilities', icon: <Engineering /> },
    { label: 'Technical Details', icon: <Settings /> },
    { label: 'Final Review', icon: <CheckCircle /> }
];

function PitScouting() {
    const { user } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { teamNumber } = location.state || {};
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [manualTeamNumber, setManualTeamNumber] = useState(teamNumber || "");
    const [activeStep, setActiveStep] = useState(0);
    const [completedSections, setCompletedSections] = useState(new Set());

    useEffect(() => {
        if (!user) {
            console.error("User not found.");
            navigate("/login");
        }
    }, [user, navigate]);

    const handleChange = (event, questionId, newValue) => {
        setFormData({
            ...formData,
            [questionId]: newValue !== undefined ? newValue : event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const dataToSend = {
            username: user?.username || "Unknown User",
            answers: Object.keys(questionsList).reduce((acc, questionId) => {
                acc[questionId] = formData[questionId] || "";
                return acc;
            }, {}),
        };

        try {
            const pitScoutingRef = ref(db, `pitScoutingResults/${manualTeamNumber}`);
            await set(pitScoutingRef, dataToSend);
            setActiveStep(3);
            setTimeout(() => {
                navigate('/my_matches');
            }, 2000);
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data.");
        } finally {
            setLoading(false);
        }
    };

    const getCompletionPercentage = () => {
        const totalQuestions = Object.keys(questionsList).length;
        const answeredQuestions = Object.keys(formData).filter(key => formData[key] && formData[key] !== "").length;
        return Math.round((answeredQuestions / totalQuestions) * 100);
    };

    const renderYesNoQuestion = (questionId, question) => (
        <Card 
            key={questionId}
            elevation={2}
            sx={{ 
                mb: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)'
                },
                border: formData[questionId] ? `2px solid ${theme === 'dark' ? '#d4af37' : '#012265'}` : 'none'
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2, 
                        fontWeight: 'bold', 
                        textAlign: "right",
                        color: theme === 'dark' ? '#fff' : '#333'
                    }}
                >
                    {question}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant={formData[questionId] === 'yes' ? 'contained' : 'outlined'}
                        onClick={() => handleChange(null, questionId, 'yes')}
                        sx={{
                            minWidth: 120,
                            py: 1.5,
                            backgroundColor: formData[questionId] === 'yes' ? '#4caf50' : 'transparent',
                            borderColor: '#4caf50',
                            color: formData[questionId] === 'yes' ? '#fff' : '#4caf50',
                            '&:hover': {
                                backgroundColor: '#4caf50',
                                color: '#fff'
                            }
                        }}
                    >
                        כן
                    </Button>
                    <Button
                        variant={formData[questionId] === 'no' ? 'contained' : 'outlined'}
                        onClick={() => handleChange(null, questionId, 'no')}
                        sx={{
                            minWidth: 120,
                            py: 1.5,
                            backgroundColor: formData[questionId] === 'no' ? '#f44336' : 'transparent',
                            borderColor: '#f44336',
                            color: formData[questionId] === 'no' ? '#fff' : '#f44336',
                            '&:hover': {
                                backgroundColor: '#f44336',
                                color: '#fff'
                            }
                        }}
                    >
                        לא
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    const renderOpenQuestion = (questionId, question) => (
        <Card 
            key={questionId}
            elevation={2}
            sx={{ 
                mb: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2, 
                        fontWeight: 'bold', 
                        textAlign: "right",
                        color: theme === 'dark' ? '#fff' : '#333'
                    }}
                >
                    {question}
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData[questionId] || ""}
                    onChange={(e) => handleChange(e, questionId)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: theme === 'dark' ? '#424242' : '#f8f9fa',
                            '&:hover fieldset': {
                                borderColor: theme === 'dark' ? '#d4af37' : '#012265',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: theme === 'dark' ? '#d4af37' : '#012265',
                            }
                        }
                    }}
                />
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Fade in timeout={800}>
                <Box>
                    {/* Header Section */}
                    <Paper
                        elevation={6}
                        sx={{
                            background: `linear-gradient(135deg, ${theme === 'dark' ? '#1a1a1a' : '#012265'} 0%, ${theme === 'dark' ? '#333' : '#0c3c72'} 50%, ${theme === 'dark' ? '#d4af37' : '#d4af37'} 100%)`,
                            color: '#fff',
                            p: 4,
                            mb: 4,
                            borderRadius: 3,
                            textAlign: 'center'
                        }}
                    >
                        <Engineering sx={{ fontSize: 48, mb: 2 }} />
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Pit Scouting
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Robot Analysis & Technical Assessment
                        </Typography>
                        
                        {/* Progress Indicator */}
                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                            <Typography variant="body1">Progress:</Typography>
                            <Chip 
                                label={`${getCompletionPercentage()}%`}
                                color="primary"
                                sx={{ 
                                    backgroundColor: '#fff',
                                    color: '#012265',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                    </Paper>

                    {/* User Status Card */}
                    <Card 
                        elevation={3}
                        sx={{ 
                            mb: 3,
                            border: user ? '2px solid #4caf50' : '2px solid #f44336',
                            borderRadius: 2
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar 
                                    sx={{ 
                                        bgcolor: user ? '#4caf50' : '#f44336',
                                        width: 56,
                                        height: 56
                                    }}
                                >
                                    {user ? <CheckCircle /> : <Warning />}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Scout Status
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: user ? '#4caf50' : '#f44336' }}>
                                        {user ? `Logged in as: ${user.username}` : "User not logged in"}
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={user ? "Active" : "Inactive"}
                                    color={user ? "success" : "error"}
                                    variant="outlined"
                                />
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Team Information Card */}
                    <Card elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar sx={{ bgcolor: theme === 'dark' ? '#d4af37' : '#012265' }}>
                                    <Assessment />
                                </Avatar>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Team Information
                                </Typography>
                            </Box>
                            
                            {!teamNumber ? (
                                <Box>
                                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                                        Enter Team Number:
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        value={manualTeamNumber}
                                        onChange={(e) => setManualTeamNumber(e.target.value)}
                                        type="number"
                                        placeholder="Enter team number..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: theme === 'dark' ? '#424242' : '#f8f9fa',
                                                fontSize: '1.2rem',
                                                '&:hover fieldset': {
                                                    borderColor: theme === 'dark' ? '#d4af37' : '#012265',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: theme === 'dark' ? '#d4af37' : '#012265',
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Alert severity="info" sx={{ borderRadius: 2 }}>
                                    <Typography variant="h6">
                                        Scouting Team: <strong>{manualTeamNumber}</strong>
                                    </Typography>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* Main Form */}
                    <Paper 
                        elevation={6} 
                        sx={{ 
                            p: 4, 
                            borderRadius: 3,
                            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff'
                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            {/* Robot Capabilities Section */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Avatar sx={{ bgcolor: theme === 'dark' ? '#d4af37' : '#012265' }}>
                                        <Build />
                                    </Avatar>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        Robot Capabilities
                                    </Typography>
                                </Box>
                                
                                <Grid container spacing={3}>
                                    {Object.entries(questionsList).map(([questionId, questionData]) => {
                                        if (questionData.type === 'yesno') {
                                            return (
                                                <Grid item xs={12} md={6} key={questionId}>
                                                    {renderYesNoQuestion(questionId, questionData.question)}
                                                </Grid>
                                            );
                                        }
                                        return null;
                                    })}
                                </Grid>
                            </Box>

                            <Divider sx={{ my: 4, borderWidth: 2 }} />

                            {/* Open Questions Section */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Avatar sx={{ bgcolor: theme === 'dark' ? '#d4af37' : '#012265' }}>
                                        <Speed />
                                    </Avatar>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        Detailed Analysis
                                    </Typography>
                                </Box>
                                
                                {Object.entries(questionsList).map(([questionId, questionData]) => {
                                    if (questionData.type === 'open') {
                                        return renderOpenQuestion(questionId, questionData.question);
                                    }
                                    return null;
                                })}
                            </Box>

                            {/* Submit Section */}
                            <Box 
                                sx={{ 
                                    textAlign: 'center',
                                    p: 4,
                                    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f8f9fa',
                                    borderRadius: 2,
                                    border: `2px dashed ${theme === 'dark' ? '#d4af37' : '#012265'}`
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Ready to Submit?
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
                                    Please review your answers before submitting
                                </Typography>
                                
                                <Button
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disabled={loading || !manualTeamNumber}
                                    sx={{
                                        px: 6,
                                        py: 2,
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        borderRadius: 3,
                                        background: `linear-gradient(45deg, ${theme === 'dark' ? '#d4af37' : '#012265'} 30%, ${theme === 'dark' ? '#b8941f' : '#0c3c72'} 90%)`,
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                                        },
                                        '&:disabled': {
                                            background: '#ccc',
                                            transform: 'none',
                                            boxShadow: 'none'
                                        }
                                    }}
                                >
                                    {loading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CircularProgress size={24} sx={{ color: '#fff' }} />
                                            <span>Submitting...</span>
                                        </Box>
                                    ) : (
                                        'Submit Pit Scouting Report'
                                    )}
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Box>
            </Fade>
        </Container>
    );
}

export default PitScouting;