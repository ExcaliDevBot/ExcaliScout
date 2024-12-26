import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    const { user } = useContext(UserContext);  // Get the current user from context
    const location = useLocation();
    const navigate = useNavigate();
    const { match, questions } = location.state || {};
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            console.error("User not found.");
            navigate("/login");  // Redirect to login if the user is not found
        }
    }, [user, navigate]);

    if (!match || !questions) {
        return <div>Error: Match or questions data is missing.</div>;
    }

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
            username: user?.username || "Unknown User",  // Safely access username
            team_number: match.team_number,
            match_number: match.match_number,
            questions: questions.map((questionId) => ({
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

                <Box sx={{ mb: 4, paddingLeft: 1 }}>
                    <Typography variant="h6">Match Details</Typography>
                    <p><strong>Team Number:</strong> {match.team_number}</p>
                    <p><strong>Match Number:</strong> {match.match_number}</p>
                </Box>

                <form onSubmit={handleSubmit}>
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
                                        sx={{
                                            mt: 1,
                                            borderRadius: "8px",
                                            backgroundColor: "#f5f5f5",
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "#ccc",
                                                },
                                            },
                                            "&:hover .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "#3f51b5", // Add hover effect
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            )
                    )}

                    <Box sx={{ textAlign: "center" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, px: 4 }}
                            type="submit"
                            disabled={loading}
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
