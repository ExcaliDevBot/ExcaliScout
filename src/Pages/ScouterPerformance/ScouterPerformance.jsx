import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from '../../firebase-config';  // Import your Firebase config
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';

const ScouterPerformance = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [matchFormsData, setMatchFormsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // Add error state

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const dbRef = ref(db, 'scoutingData/');
                const snapshot = await get(dbRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const scouterStats = calculateScouterPerformance(data);
                    const matchStats = calculateMatchStats(data);
                    setPerformanceData(scouterStats);
                    setMatchFormsData(matchStats);
                } else {
                    setError('No data available');  // Set error state if no data
                }
            } catch (error) {
                setError('Error fetching data. Please try again later.');  // Set error state on failure
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceData();
    }, []);

    const calculateScouterPerformance = (data) => {
        const scouterStats = {};

        Object.values(data).forEach((form) => {
            const username = form.Name;
            const match = form.Match;

            if (!scouterStats[username]) {
                scouterStats[username] = {
                    username,
                    formsSubmitted: 0,
                    assignedMatches: new Set(),
                };
            }

            scouterStats[username].assignedMatches.add(match);
            scouterStats[username].formsSubmitted++;
        });

        return Object.values(scouterStats).map((scouter) => ({
            ...scouter,
            formsExpected: scouter.assignedMatches.size,
        }));
    };

    const calculateMatchStats = (data) => {
        const matchStats = {};

        Object.values(data).forEach((form) => {
            const match = form.Match;
            if (!matchStats[match]) {
                matchStats[match] = { match, formsSubmitted: 0 };
            }
            matchStats[match].formsSubmitted++;
        });

        return Object.values(matchStats);
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Scouter Performance
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ marginBottom: '20px' }}>
                    {error}
                </Alert>
            ) : (
                <>
                    <Typography variant="h5" sx={{ marginBottom: '20px', color: '#333' }}>Scouter Performance</Typography>

                    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="Scouter Performance Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Username</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Forms Expected</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Forms Submitted</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Missed Forms</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {performanceData.map((scouter) => (
                                    <TableRow key={scouter.username} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                                        <TableCell>{scouter.username}</TableCell>
                                        <TableCell align="right">{scouter.formsExpected}</TableCell>
                                        <TableCell align="right">{scouter.formsSubmitted}</TableCell>
                                        <TableCell align="right">{scouter.formsExpected - scouter.formsSubmitted}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="h5" sx={{ marginTop: '40px', marginBottom: '20px', color: '#333' }}>Match Form Submissions</Typography>

                    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="Match Form Submission Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#28a745', color: 'white' }}>Match</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#28a745', color: 'white' }}>Forms Submitted</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#28a745', color: 'white' }}>Forms Expected (6)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {matchFormsData.map((match) => (
                                    <TableRow key={match.match} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                                        <TableCell>{match.match}</TableCell>
                                        <TableCell align="right">
                                            <Typography sx={{ color: match.formsSubmitted === 6 ? 'green' : 'red' }}>
                                                {match.formsSubmitted}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">6</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Box>
    );
};

export default ScouterPerformance;
