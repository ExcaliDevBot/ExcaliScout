import React, { useState, useEffect, useContext } from "react";
import { Button, Typography, Paper, Box, Alert } from "@mui/material";
import { ref, set } from "firebase/database";
import { db } from "../../firebase-config";
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

const OfflineSubmissions = () => {
    const { theme } = useContext(ThemeContext);
    const { language } = useContext(LanguageContext);
    const t = translations[language];

    const [pendingSubmissions, setPendingSubmissions] = useState([]);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("offlineSubmissions")) || [];
        setPendingSubmissions(saved);
    }, []);

    const handleSubmit = async (data, index) => {
        try {
            const nodeName = `M${data.Match}T${data.Team}`;
            const dbRef = ref(db, `scoutingData/${nodeName}`);
            await set(dbRef, data);

            const updatedList = [...pendingSubmissions];
            updatedList.splice(index, 1);
            setPendingSubmissions(updatedList);
            localStorage.setItem("offlineSubmissions", JSON.stringify(updatedList));

            setAlert({ severity: "success", message: t.submissionSuccess || "Submitted successfully!" });
        } catch (error) {
            console.error("Submission error:", error);
            setAlert({ severity: "error", message: t.submissionError || "Submission failed!" });
        }
    };

    return (
        <Box sx={{ padding: 3, maxWidth: '800px', margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                {t.pendingSubmissions || "Pending Submissions"}
            </Typography>

            {alert && <Alert severity={alert.severity} sx={{ mb: 2 }}>{alert.message}</Alert>}

            {pendingSubmissions.length === 0 ? (
                <Typography>{t.noPendingSubmissions || "No saved data to submit."}</Typography>
            ) : (
                pendingSubmissions.map((data, index) => (
                    <Paper key={index} sx={{ padding: 2, mb: 2 }}>
                        <Typography><strong>{t.team || "Team"}:</strong> {data.Team}</Typography>
                        <Typography><strong>{t.match || "Match"}:</strong> {data.Match}</Typography>
                        <Typography><strong>{t.alliance || "Alliance"}:</strong> {data.Alliance}</Typography>
                        <Typography><strong>{t.predictedWinner || "Prediction"}:</strong> {data.WinnerPrediction}</Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => handleSubmit(data, index)}
                        >
                            {t.submit || "Submit"}
                        </Button>
                    </Paper>
                ))
            )}
        </Box>
    );
};

export default OfflineSubmissions;
