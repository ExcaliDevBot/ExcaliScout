import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../../firebase-config";
import { ref, set, get } from "firebase/database";
import { UserContext } from "../../../context/UserContext";
import { Box, Button, Typography, TextField, CircularProgress, Paper } from "@mui/material";

const questionsList = {
    0: "מהם האתגרים העיקריים שהרובוט נתקל בהם במהלך סייקל",
    1: "כיצד הרובוט מתמודד עם מצבי הגנה מצד רובוטים יריבים",
    2: "תאר שיתוף פעולה בין הרובוטים בברית",
    3: "אילו חלקים ברובוט נוטים לתקלות או בעיות תפעוליות",
    4: "אילו משימות הרובוט ביצע במהלך שלב האוטונומי",
    5: "מה תפקיד הרובוט בברית",
};

function SuperScouting() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { match, questions, customQuestion } = location.state || {};
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [manualMatchNumber, setManualMatchNumber] = useState("");
    const [manualTeamNumber, setManualTeamNumber] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loadedCustomQuestion, setLoadedCustomQuestion] = useState("");

    useEffect(() => {
        if (!user) {
            console.error("User not found.");
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (match && match.match_number && match.team_number) {
            const assignmentRef = ref(db, `superScoutingAssignments`);
            get(assignmentRef).then((snapshot) => {
                const data = snapshot.val();
                const assignment = Object.values(data || {}).find(
                    (item) => item.match.match_number === match.match_number && item.match.team_number === match.team_number
                );
                if (assignment) {
                    setLoadedCustomQuestion(assignment.customQuestion);
                }
            });
        }
    }, [match]);

    const handleChange = (event, questionId) => {
        setFormData({
            ...formData,
            [questionId]: event.target.value,
        });
    };

    const handleManualSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setIsSubmitted(true);

        const dataToSend = {
            username: user?.username || "Unknown User",
            team_number: match ? match.team_number : manualTeamNumber,
            match_number: match ? match.match_number : manualMatchNumber,
            questions: [
                ...Object.keys(questionsList).map((questionId) => ({
                    question: questionsList[questionId],
                    answer: formData[questionId] || "",
                })),
                { question: loadedCustomQuestion || customQuestion || "", answer: formData.customAnswer || "" }
            ],
        };

        const nodeName = `M${dataToSend.match_number}T${dataToSend.team_number}`;

        try {
            const superScoutingRef = ref(db, `superScoutingResults/${nodeName}`);
            await set(superScoutingRef, dataToSend);
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data.");
        } finally {
            setLoading(false);
        }
    };

    if (!match || !questions) {
        return (
            <Box sx={{ p: 4, maxWidth: 900, margin: "auto" }}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Match or Questions Data is Missing
                    </Typography>
                    <form onSubmit={handleManualSubmit}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                Enter Match Number:
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={manualMatchNumber}
                                onChange={(e) => setManualMatchNumber(e.target.value)}
                                type="number"
                            />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                Enter Team Number:
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={manualTeamNumber}
                                onChange={(e) => setManualTeamNumber(e.target.value)}
                                type="number"
                            />
                        </Box>

                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Answer the Questions Below
                        </Typography>

                        {Object.keys(questionsList).map((questionId) => (
                            <Box key={questionId} sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    {questionsList[questionId]}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={formData[questionId] || ""}
                                    onChange={(e) => handleChange(e, questionId)}
                                />
                            </Box>
                        ))}

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                {loadedCustomQuestion || customQuestion || "Custom Question"}
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={formData.customAnswer || ""}
                                onChange={(e) => setFormData({ ...formData, customAnswer: e.target.value })}
                            />
                        </Box>

                        <Box sx={{ textAlign: "center" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, px: 4 }}
                                type="submit"
                                disabled={loading || !manualMatchNumber || !manualTeamNumber || isSubmitted}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Submit"}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 900, margin: "auto" }}>
            <Paper elevation={3} sx={{ padding: 3 }}>

                <Box sx={{ mb: 4, paddingLeft: 1 }}>
                    <Typography variant="h6">Match Details</Typography>
                    <p><strong>Team Number:</strong> {match.team_number}</p>
                    <p><strong>Match Number:</strong> {match.match_number}</p>
                </Box>

                <form onSubmit={handleManualSubmit}>
                    {questions.map(
                        (questionId, index) =>
                            questionsList[questionId] && (
                                <Box key={index} sx={{ mb: 3 }}>
                                    <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                        {questionsList[questionId]}
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={formData[questionId] || ""}
                                        onChange={(e) => handleChange(e, questionId)}
                                    />
                                </Box>
                            )
                    )}

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                            {loadedCustomQuestion || customQuestion || "Custom Question"}
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.customAnswer || ""}
                            onChange={(e) => setFormData({ ...formData, customAnswer: e.target.value })}
                        />
                    </Box>

                    <Box sx={{ textAlign: "center" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, px: 4 }}
                            type="submit"
                            disabled={loading || isSubmitted}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Submit"}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default SuperScouting;