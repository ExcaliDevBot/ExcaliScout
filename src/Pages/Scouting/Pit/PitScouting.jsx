import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config";
import { ref, get, set } from "firebase/database";
import { UserContext } from "../../../context/UserContext";
import { Box, Button, Typography, TextField, CircularProgress, Paper } from "@mui/material";
import { green, red } from "@mui/material/colors";

const PitScouting = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [teamNumber, setTeamNumber] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (!user) {
            console.error("User not found.");
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
            setFormData({
                ...formData,
                robotImage: file,
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const pitScoutingRef = ref(db, "pitScoutingResults");
            await set(pitScoutingRef, { ...formData, teamNumber, username: user?.username });
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data.");
        } finally {
            setLoading(false);
        }
    };

    const handleNewPitScoutingForm = () => {
        setFormData({}); // Clear the form for a new entry
        setIsFormVisible(false); // Hide the form until the user enters team number
    };

    const handleTeamSubmit = () => {
        if (teamNumber) {
            setIsFormVisible(true);
        } else {
            alert("Please enter a Team Number.");
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 900, margin: "auto" }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                {user ? (
                    <Typography variant="h6" sx={{ color: green[700], mb: 2 }}>

                    </Typography>
                ) : (
                    <Typography variant="h6" sx={{ color: red[700], mb: 2 }}>
                        User not logged in.
                    </Typography>
                )}

                {!isFormVisible ? (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6">Enter Team Number</Typography>
                        <TextField
                            label="Team Number"
                            variant="outlined"
                            fullWidth
                            value={teamNumber}
                            onChange={(e) => setTeamNumber(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ textAlign: "center" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, px: 4 }}
                                onClick={handleTeamSubmit}
                            >
                                Start Pit Scouting
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6">Pit Scouting for Team {teamNumber}</Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Robot Image (Take a picture):
                                </Typography>
                                <TextField
                                    type="file"
                                    fullWidth
                                    name="robotImage"
                                    accept="image/*"
                                    inputProps={{ capture: "camera" }}
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src={imagePreview}
                                            alt="Robot Preview"
                                            style={{ maxWidth: '100%', height: 'auto' }}
                                        />
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Describe Robot Strengths:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name="strengths"
                                    value={formData.strengths || ""}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Describe Robot Weaknesses:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name="weaknesses"
                                    value={formData.weaknesses || ""}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
                                Submit
                            </Button>
                            {loading && <CircularProgress />}
                        </form>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default PitScouting;
