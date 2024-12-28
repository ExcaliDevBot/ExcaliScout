import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../../firebase-config";
import { ref, push } from "firebase/database";
import { UserContext } from "../../../context/UserContext";
import { Box, Button, Typography, TextField, CircularProgress, Paper } from "@mui/material";
import { green, red } from "@mui/material/colors";

// Define the questions for Pit Scouting
const questionsList = {
    0: "Strengths of the robot?",
    1: "Weaknesses of the robot?",
    2: "Any issues with the robot?",
    3: "Description of the robot's design?",
    4: "Any specific strategies or mechanisms used?",
};

function PitScouting() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { teamNumber } = location.state || {}; // Assuming teamNumber is passed in the state
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [manualTeamNumber, setManualTeamNumber] = useState(teamNumber || ""); // Pre-fill or set manual team number

    useEffect(() => {
        if (!user) {
            console.error("User not found.");
            navigate("/login"); // Redirect to login if the user is not found
        }
    }, [user, navigate]);

    const handleChange = (event, questionId) => {
        setFormData({
            ...formData,
            [questionId]: event.target.value,
        });
    };

    const handleManualSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Create data to send, including the team number
        const dataToSend = {
            username: user?.username || "Unknown User",
            team_number: manualTeamNumber, // Use the team number (either passed or entered)
            questions: Object.keys(questionsList).map((questionId) => ({
                question: questionsList[questionId],
                answer: formData[questionId] || "", // Empty answer if not filled
            })),
        };

        try {
            const pitScoutingRef = ref(db, "pitScoutingResults");
            await push(pitScoutingRef, dataToSend);
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 900, margin: "auto" }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                {user ? (
                    <Typography variant="h6" sx={{ color: green[700], mb: 2 }}>
                        Logged in as: {user.username} {/* Display the username */}
                    </Typography>
                ) : (
                    <Typography variant="h6" sx={{ color: red[700], mb: 2 }}>
                        User not logged in.
                    </Typography>
                )}

                {/* Display team number */}
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Team Number: {manualTeamNumber || "Not Provided"}
                </Typography>

                {/* If no team number passed, show manual input */}
                {!teamNumber && (
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
                )}

                <Typography variant="h6" sx={{ mb: 2 }}>
                    Answer the Questions Below
                </Typography>

                <form onSubmit={handleManualSubmit}>
                    {/* Dynamically render the questions */}
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

                    <Box sx={{ textAlign: "center" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, px: 4 }}
                            type="submit"
                            disabled={loading || !manualTeamNumber} // Disable if no team number
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Submit"}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default PitScouting;
