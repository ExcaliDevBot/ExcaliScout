import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config";
import { ref, push } from "firebase/database";
import { UserContext } from "../../../context/UserContext";
import { Box, Button, Typography, TextField, CircularProgress, Paper } from "@mui/material";
import { green, red } from "@mui/material/colors";

const questionsList = {
    0: "תאר אוטונומי?",
    1: "תאר טלאופ + אנדגיים",
    2: "תאר שימוש בטראפ",
    3: "תאר הגנה",
    4: "תאר התמודוות מול הגנה",
    5: "פרט רוטיישנס",
    6: "ירי - מיקום + גובה + זמן",
    7: "איסוף - רצפה/פידר + זמן",
    8: "תאר כימיה עם שאר הברית",
    9: "הערות",
};

function SuperScouting() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [teamNumber, setTeamNumber] = useState("");
    const [matchNumber, setMatchNumber] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleChange = (event, questionId) => {
        setFormData({
            ...formData,
            [questionId]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const dataToSend = {
            username: user?.username || "Unknown User",
            team_number: teamNumber,
            match_number: matchNumber,
            questions: Object.keys(formData).map((questionId) => ({
                question: questionsList[questionId],
                answer: formData[questionId] || "",
            })),
        };

        try {
            const superScoutingRef = ref(db, "superScoutingResults");
            await push(superScoutingRef, dataToSend);
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data.");
        } finally {
            setLoading(false);
        }
    };

    const handleTeamMatchSubmit = () => {
        if (teamNumber && matchNumber) {
            setIsFormVisible(true);
        } else {
            alert("Please enter both Team Number and Match Number.");
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 900, margin: "auto" }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                {user ? (
                    <Typography variant="h6" sx={{ color: green[700], mb: 2 }}>
                        Logged in as: {user.username}
                    </Typography>
                ) : (
                    <Typography variant="h6" sx={{ color: red[700], mb: 2 }}>
                        User not logged in.
                    </Typography>
                )}

                {!isFormVisible ? (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6">Enter Match Details</Typography>
                        <TextField
                            label="Team Number"
                            variant="outlined"
                            fullWidth
                            value={teamNumber}
                            onChange={(e) => setTeamNumber(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Match Number"
                            variant="outlined"
                            fullWidth
                            value={matchNumber}
                            onChange={(e) => setMatchNumber(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ textAlign: "center" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, px: 4 }}
                                onClick={handleTeamMatchSubmit}
                            >
                                Start Super Scouting
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 4, paddingLeft: 1 }}>
                            <Typography variant="h6">Match Details</Typography>
                            <p>
                                <strong>Team Number:</strong> {teamNumber}
                            </p>
                            <p>
                                <strong>Match Number:</strong> {matchNumber}
                            </p>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            {Object.keys(questionsList).map((questionId, index) => (
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
                            ))}
                            <Box sx={{ textAlign: "center" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3, px: 4 }}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </Box>
                        </form>
                    </>
                )}
            </Paper>
        </Box>
    );
}

export default SuperScouting;
