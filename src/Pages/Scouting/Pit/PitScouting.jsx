import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../../firebase-config";
import { ref, get, set } from "firebase/database";
import { UserContext } from "../../../context/UserContext";
import { Box, Button, Typography, TextField, CircularProgress, Paper } from "@mui/material";
import { green, red } from "@mui/material/colors";

const PitScouting = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const { teamNumber, matchNumber } = state || {};
    const [imagePreview, setImagePreview] = useState(null); // State for image preview

    useEffect(() => {
        if (!user) {
            console.error("User not found.");
            navigate("/login");
        } else if (teamNumber && matchNumber) {
            const fetchPitData = async () => {
                setLoading(true);
                try {
                    const pitScoutingRef = ref(db, "pitScoutingResults");
                    const snapshot = await get(pitScoutingRef);
                    if (snapshot.exists()) {
                        const pitData = Object.values(snapshot.val()).find(
                            (data) => data.teamNumber === teamNumber && data.matchNumber === matchNumber
                        );
                        if (pitData) {
                            setFormData(pitData);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching pit data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchPitData();
        }
    }, [user, teamNumber, matchNumber, navigate]);

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
                setImagePreview(reader.result); // Set the preview of the image
            };
            reader.readAsDataURL(file); // Convert the image to a base64 string
            setFormData({
                ...formData,
                robotImage: file, // Store the file in the form data
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const pitScoutingRef = ref(db, "pitScoutingResults");
            await set(pitScoutingRef, { ...formData, username: user?.username });
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
                        Logged in as: {user.username}
                    </Typography>
                ) : (
                    <Typography variant="h6" sx={{ color: red[700], mb: 2 }}>
                        User not logged in.
                    </Typography>
                )}

                <Typography variant="h6" sx={{ mb: 2 }}>
                    Pit Scouting for Match {matchNumber} - Team {teamNumber}
                </Typography>

                <form onSubmit={handleSubmit}>
                    {/* Form fields pre-filled with data */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                            Robot Image (Take a picture):
                        </Typography>
                        <TextField
                            type="file"
                            fullWidth
                            name="robotImage"
                            accept="image/*"
                            inputProps={{ capture: "camera" }} // This tells the browser to use the camera
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <Box sx={{ mt: 2 }}>
                                <img src={imagePreview} alt="Robot Preview" style={{ maxWidth: '100%', height: 'auto' }} />
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
            </Paper>
        </Box>
    );
};

export default PitScouting;
