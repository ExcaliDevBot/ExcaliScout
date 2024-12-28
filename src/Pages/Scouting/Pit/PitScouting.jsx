import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../../firebase-config";
import { ref, set, get } from "firebase/database";
import { UserContext } from "../../../context/UserContext";
import { Box, Grid, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";

const PitScouting = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [formData, setFormData] = useState({
        teamNumber: state?.teamNumber || "",
        strengths: "",
        weaknesses: "",
        robotImage: null,
    });
    const [manualTeamNumber, setManualTeamNumber] = useState(state?.teamNumber || "");
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const dataToSend = {
            username: user?.username || "Unknown User",
            teamNumber: manualTeamNumber,
            strengths: formData.strengths || "",
            weaknesses: formData.weaknesses || "",
            robotImage: formData.robotImage || null,
        };

        try {
            const pitScoutingRef = ref(db, "pitScoutingResults");
            await set(pitScoutingRef, dataToSend);
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 900, margin: "auto" }}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: "10px" }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Scouting for Team {formData.teamNumber || "(Enter Team Number Below)"}
                </Typography>
                <form onSubmit={handleSubmit}>
                    {/* Team Number Input (only if teamNumber is not available) */}
                    {!formData.teamNumber && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Team Number"
                                    variant="outlined"
                                    fullWidth
                                    value={manualTeamNumber}
                                    onChange={(e) => setManualTeamNumber(e.target.value)}
                                    required
                                    sx={{ padding: "10px" }}
                                />
                            </Grid>
                        </Grid>
                    )}

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Strengths"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                name="strengths"
                                value={formData.strengths || ""}
                                onChange={handleChange}
                                sx={{ padding: "10px" }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Weaknesses"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                name="weaknesses"
                                value={formData.weaknesses || ""}
                                onChange={handleChange}
                                sx={{ padding: "10px" }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                sx={{
                                    backgroundColor: "#4CAF50",
                                    color: "#fff",
                                    marginBottom: 2,
                                    '&:hover': {
                                        backgroundColor: "#45a049"
                                    }
                                }}
                            >
                                Upload Robot Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {imagePreview && (
                                <Box sx={{ mt: 2 }}>
                                    <img
                                        src={imagePreview}
                                        alt="Robot Preview"
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            borderRadius: "10px",
                                        }}
                                    />
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                backgroundColor: "#1976D2",
                                color: "#fff",
                                padding: "10px 20px",
                                '&:hover': {
                                    backgroundColor: "#1565C0"
                                },
                                minWidth: "200px",
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default PitScouting;
