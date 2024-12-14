import React, { useState, useEffect, useContext } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from '@mui/material';

function MyMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const fetchSuperScoutingMatches = async () => {
        const gid = '21713347';
        const publicSpreadsheetUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRojRhLgZSPXJopPdni1V4Z-inXXY3a__2NaVMsoJHPs9d25ZQ7t56QX67mncr6yo-w4B8WCWyHFe2m/pub?output=csv&gid=${gid}`;
        const cacheBuster = `cacheBuster=${new Date().getTime()}`;
        const urlWithCacheBuster = `${publicSpreadsheetUrl}&${cacheBuster}`;

        return new Promise((resolve, reject) => {
            Papa.parse(urlWithCacheBuster, {
                download: true,
                header: false,
                complete: (results) => {
                    const uniqueMatches = new Set();
                    const superScoutingMatches = results.data
                        .map((row, index) => ({
                            name: row[0],
                            match_number: row[1],
                            team_number: row[2],
                            questions: row.slice(3),
                            index: index,
                            isSuperScouting: true,
                        }))
                        .filter((match) => {
                            if (!user.username || !match.match_number || !match.team_number || match.name !== user.username) {
                                return false;
                            }
                            const key = `${user.username}-${match.match_number}-${match.team_number}`;
                            if (uniqueMatches.has(key)) {
                                return false;
                            } else {
                                uniqueMatches.add(key);
                                return true;
                            }
                        });
                    resolve(superScoutingMatches);
                },
                error: (error) => {
                    reject(error);
                },
            });
        });
    };

    useEffect(() => {
        if (user) {
            const fetchMatches = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`https://ScoutingSystem.pythonanywhere.com/matches_assignments?user_id=${user.user_id}`);
                    const data = await response.json();
                    let dbMatches = [];
                    if (data.status === 'success') {
                        dbMatches = data.matches.map((match) => ({ ...match, isSuperScouting: false }));
                    }

                    let superScoutingMatches = [];
                    if (user.role === 'super_scouter') {
                        superScoutingMatches = await fetchSuperScoutingMatches();
                    }

                    const combinedMatches = [...dbMatches, ...superScoutingMatches];
                    combinedMatches.sort((a, b) => a.match_number - b.match_number);

                    setMatches(combinedMatches);
                } catch (error) {
                    console.error('Fetching data failed', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchMatches();
        }
    }, [user]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: '#012265' }}>
                My Matches
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {matches.map((match, index) => (
                        <Card
                            key={index}
                            sx={{
                                width: '100%',
                                maxWidth: 400,
                                boxShadow: 3,
                                borderRadius: 2,
                                border: match.isSuperScouting ? '4px solid #d4af37' : 'none',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#d4af37', mb: 1 }}>
                                    Match {match.match_number}
                                </Typography>
                                <Typography variant="body1">Team: {match.team_number}</Typography>
                                {!match.isSuperScouting && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: match.alliance === 'Red' ? 'red' : 'blue', fontWeight: 'bold' }}
                                    >
                                        Alliance: {match.alliance}
                                    </Typography>
                                )}
                                {match.completed ? (
                                    <Typography sx={{ color: 'green', mt: 2 }}>Completed!</Typography>
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 2,
                                            backgroundColor: match.isSuperScouting ? '#045404' : '#012265',
                                            '&:hover': {
                                                backgroundColor: '#d4af37',
                                                color: '#012265',
                                            },
                                        }}
                                        onClick={() => {
                                            if (match.isSuperScouting) {
                                                navigate(`/super-scout`, { state: { match, user, questions: match.questions } });
                                            } else {
                                                navigate(`/scout/${match.match_number}`, { state: { match, user } });
                                            }
                                        }}
                                    >
                                        Scout Now
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
            <Button
                variant="outlined"
                sx={{
                    mt: 4,
                    display: 'block',
                    mx: 'auto',
                    color: '#012265',
                    borderColor: '#012265',
                    '&:hover': {
                        backgroundColor: '#d4af37',
                        color: '#012265',
                        borderColor: '#d4af37',
                    },
                }}
                onClick={() => navigate('/scout/new', { state: { user } })}
            >
                New Scouting Form
            </Button>
        </Box>
    );
}

export default MyMatches;
