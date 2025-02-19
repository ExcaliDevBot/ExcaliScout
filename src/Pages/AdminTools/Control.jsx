import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../firebase-config';
import { ref, get } from 'firebase/database';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Divider,
    Grid,
    Card,
    CardContent,
    Container
} from '@mui/material';
import { ThemeContext } from '../../context/ThemeContext'; // Adjust the import path as needed

const Control = () => {
    const [matches, setMatches] = useState([]);
    const [submittedMatches, setSubmittedMatches] = useState([]);
    const [scouterMisses, setScouterMisses] = useState({});
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const fetchData = async () => {
            const matchesRef = ref(db, 'matches');
            const scoutingDataRef = ref(db, 'scoutingData');
            const matchesSnapshot = await get(matchesRef);
            const scoutingDataSnapshot = await get(scoutingDataRef);

            if (matchesSnapshot.exists()) {
                const matchesData = matchesSnapshot.val();
                const formattedMatches = Object.keys(matchesData).map(key => ({
                    matchId: key,
                    ...matchesData[key]
                })).sort((a, b) => a.match_id - b.match_id);
                setMatches(formattedMatches);
            } else {
                setMatches([]);
            }

            if (scoutingDataSnapshot.exists()) {
                const scoutingData = scoutingDataSnapshot.val();
                const submitted = Object.keys(scoutingData);
                setSubmittedMatches(submitted);
            } else {
                setSubmittedMatches([]);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const misses = {};
        matches.forEach(match => {
            ['blue1', 'blue2', 'blue3', 'red1', 'red2', 'red3'].forEach(team => {
                const matchKey = `M${match.match_id}T${match[team]?.team_number}`;
                if (match[team] && !submittedMatches.includes(matchKey)) {
                    const scouter = match[team].scouter_name;
                    if (scouter) {
                        if (!misses[scouter]) {
                            misses[scouter] = { count: 0, lastMissedMatch: null, lastMissedTeam: null };
                        }
                        misses[scouter].count += 1;
                        misses[scouter].lastMissedMatch = match.match_id;
                        misses[scouter].lastMissedTeam = match[team].team_number;
                    }
                }
            });
        });
        setScouterMisses(misses);
    }, [matches, submittedMatches]);

    const getCellColor = (match, team) => {
        const matchKey = `M${match.match_id}T${match[team]?.team_number}`;
        if (submittedMatches.includes(matchKey)) {
            return 'green';
        } else if (match[team]) {
            return 'red';
        } else {
            return 'gray';
        }
    };

    const totalMatches = matches.length * 6; // 6 teams per match
    const sentForms = submittedMatches.length;
    const notSentForms = totalMatches - sentForms;
    const accuracy = ((sentForms / notSentForms) * 100).toFixed(2);

    const sortedScouters = Object.entries(scouterMisses)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3);

    return (
        <Container sx={{ backgroundColor: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}>
            <Box>
                <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: 'bold', color: theme === 'light' ? '#012265' : '#d4af37' }}>
                    Scouting Data
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                            <Card sx={{ backgroundColor: theme === 'light' ? '#e0f7fa' : '#004d40' }}>
                                <CardContent>
                                    <Typography variant="h6">Total Forms</Typography>
                                    <Typography variant="h5">{totalMatches}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card sx={{ backgroundColor: theme === 'light' ? '#e8f5e9' : '#1b5e20' }}>
                                <CardContent>
                                    <Typography variant="h6">Sent Forms</Typography>
                                    <Typography variant="h5">{sentForms}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card sx={{ backgroundColor: theme === 'light' ? '#ffebee' : '#b71c1c' }}>
                                <CardContent>
                                    <Typography variant="h6">Not Sent Forms</Typography>
                                    <Typography variant="h5">{notSentForms}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card sx={{ backgroundColor: theme === 'light' ? '#fff3e0' : '#e65100' }}>
                                <CardContent>
                                    <Typography variant="h6">Accuracy</Typography>
                                    <Typography variant="h5">{accuracy}%</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme === 'light' ? '#d4af37' : '#ffeb3b' }}>Inaccurate Scouter</Typography>
                    <TableContainer component={Paper} sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Scouter Name</TableCell>
                                    <TableCell>Missed Games</TableCell>
                                    <TableCell>Last Missed Match & Team</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedScouters.map(([scouter, data]) => (
                                    <TableRow key={scouter}>
                                        <TableCell>{scouter}</TableCell>
                                        <TableCell>{data.count}</TableCell>
                                        <TableCell>
                                            <Box sx={{ backgroundColor: theme === 'light' ? '#ffebee' : '#b71c1c', padding: '8px', borderRadius: '4px' }}>
                                                <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'inline' }}>
                                                    Match {data.lastMissedMatch} -
                                                </Typography>
                                                {' '}
                                                <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'inline' }}>
                                                    Team {data.lastMissedTeam}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Divider sx={{ my: 2 }} />
                <TableContainer component={Paper} sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Match ID</TableCell>
                                <TableCell>Blue 1</TableCell>
                                <TableCell>Blue 2</TableCell>
                                <TableCell>Blue 3</TableCell>
                                <TableCell>Red 1</TableCell>
                                <TableCell>Red 2</TableCell>
                                <TableCell>Red 3</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {matches.map((match) => (
                                <TableRow key={match.matchId}>
                                    <TableCell>{match.matchId}</TableCell>
                                    <TableCell style={{ backgroundColor: getCellColor(match, 'blue1') }}>
                                        {match.blue1?.team_number || 'N/A'}<br />
                                        {match.blue1?.scouter_name || 'N/A'}
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: getCellColor(match, 'blue2') }}>
                                        {match.blue2?.team_number || 'N/A'}<br />
                                        {match.blue2?.scouter_name || 'N/A'}
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: getCellColor(match, 'blue3') }}>
                                        {match.blue3?.team_number || 'N/A'}<br />
                                        {match.blue3?.scouter_name || 'N/A'}
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: getCellColor(match, 'red1') }}>
                                        {match.red1?.team_number || 'N/A'}<br />
                                        {match.red1?.scouter_name || 'N/A'}
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: getCellColor(match, 'red2') }}>
                                        {match.red2?.team_number || 'N/A'}<br />
                                        {match.red2?.scouter_name || 'N/A'}
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: getCellColor(match, 'red3') }}>
                                        {match.red3?.team_number || 'N/A'}<br />
                                        {match.red3?.scouter_name || 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default Control;