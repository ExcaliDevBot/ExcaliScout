import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database'; // Remove onValue as it's not needed for fetching here
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
    const { user } = useContext(UserContext);  // Get current user
    const navigate = useNavigate();
    const db = getDatabase();

    useEffect(() => {
        if (user) {
            const fetchMatches = async () => {
                setLoading(true);
                try {
                    const matchesRef = ref(db, `matches`);
                    const superScoutingAssignmentsRef = ref(db, `superScoutingAssignments`);
                    const snapshotMatches = await get(matchesRef);
                    const snapshotSuperScouting = await get(superScoutingAssignmentsRef);

                    if (snapshotMatches.exists() && snapshotSuperScouting.exists()) {
                        const allMatches = Object.values(snapshotMatches.val());
                        const allSuperScoutingAssignments = Object.values(snapshotSuperScouting.val());

                        console.log('Fetched matches from Firebase:', allMatches);
                        console.log('Fetched super scouting assignments from Firebase:', allSuperScoutingAssignments);

                        // Combine regular matches with super scouting assignments
                        const userMatches = allMatches
                            .map((match) => {
                                const positions = ['red1', 'red2', 'red3', 'blue1', 'blue2', 'blue3'];
                                let isSuperScouting = false;

                                // Check if the match is assigned for super scouting for the current user
                                for (const position of positions) {
                                    if (match[position]?.scouter_name === user.username) {
                                        // Check if the current match is assigned for super scouting
                                        isSuperScouting = allSuperScoutingAssignments.some(
                                            (assignment) =>
                                                assignment.user === user.username &&
                                                String(assignment.match.match_number) === String(match.match_id)
                                        );
                                        return {
                                            match_number: match.match_id,
                                            team_number: match[position]?.team_number,
                                            alliance: position.startsWith('red') ? 'Red' : 'Blue',
                                            isSuperScouting, // Set the flag based on the super scouting assignment data
                                        };
                                    }
                                }
                                return null;
                            })
                            .filter(Boolean); // Remove any null values

                        // Include super scouting matches where the user is assigned
                        const superScoutingMatches = allSuperScoutingAssignments
                            .filter(assignment => assignment.user === user.username)
                            .map((assignment) => {
                                const match = assignment.match; // The match assigned to the user
                                return {
                                    match_number: match.match_number,
                                    team_number: match.team_number,
                                    alliance: match.alliance,
                                    isSuperScouting: true, // Mark as super scouting
                                };
                            });

                        // Merge user-specific matches and super scouting matches
                        const mergedMatches = [...userMatches, ...superScoutingMatches];
                        mergedMatches.sort((a, b) => a.match_number - b.match_number); // Sort by match number

                        setMatches(mergedMatches);
                    } else {
                        console.log('No matches or super scouting assignments found in Firebase.');
                        setMatches([]);
                    }
                } catch (error) {
                    console.error('Error fetching matches:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchMatches();
        }
    }, [user, db]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: '#012265' }}>
                My Matches
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : matches.length > 0 ? (
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
                                border: match.isSuperScouting ? '4px solid #d4af37' : 'none', // Apply golden border if super scouting
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#d4af37', mb: 1 }}>
                                    Match {match.match_number}
                                </Typography>
                                <Typography variant="body1">Team: {match.team_number}</Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ color: match.alliance === 'Red' ? 'red' : 'blue' }}
                                >
                                    Alliance: {match.alliance}
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#012265',
                                        '&:hover': { backgroundColor: '#d4af37', color: '#012265' },
                                    }}
                                    onClick={() =>
                                        navigate(`/scout/${match.match_number}`, { state: { match, user } })
                                    }
                                >
                                    Scout Now
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                    No matches assigned to you.
                </Typography>
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
