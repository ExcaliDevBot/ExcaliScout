import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
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
                    const pitScoutingAssignmentsRef = ref(db, `pitScoutingAssignments`);
                    const snapshotMatches = await get(matchesRef);
                    const snapshotSuperScouting = await get(superScoutingAssignmentsRef);
                    const snapshotPitScouting = await get(pitScoutingAssignmentsRef);

                    if (snapshotMatches.exists() && snapshotSuperScouting.exists() && snapshotPitScouting.exists()) {
                        const allMatches = Object.values(snapshotMatches.val());
                        const allSuperScoutingAssignments = Object.values(snapshotSuperScouting.val());
                        const allPitScoutingAssignments = Object.values(snapshotPitScouting.val());

                        // Combine regular matches with super scouting assignments
                        const userMatches = allMatches
                            .map((match) => {
                                if (!match || !match.match_id) return null;  // Add a check to ensure match is valid

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
                                            superScoutingQuestions: isSuperScouting
                                                ? Object.values(allSuperScoutingAssignments.find(assignment =>
                                                    assignment.match.match_number === match.match_id)?.questions || {})
                                                : [],
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
                                if (!match) return null;
                                return {
                                    match_number: match.match_number,
                                    team_number: match.team_number,
                                    isSuperScouting: true, // Mark as super scouting
                                    superScoutingQuestions: Object.values(assignment.questions || []), // Get relevant questions
                                };
                            })
                            .filter(Boolean);  // Remove null matches

                        // Fetch pit scouting assignments for the user
                        const pitScoutingMatches = allPitScoutingAssignments
                            .filter(assignment => assignment.user === user.username) // Filter pit scouting assignments for the current user
                            .map((assignment) => {
                                const match = assignment;  // The entire assignment object
                                if (!match || !match.team_number) return null;
                                return {
                                    match_number: match.match_number || "Pit Scouting", // Add match_number if available, else show "Pit Scouting"
                                    team_number: match.team_number,
                                    isPitScouting: true, // Mark as pit scouting
                                };
                            })
                            .filter(Boolean);  // Remove null matches

                        // Merge pit scouting matches first, then super scouting and user-specific matches
                        const mergedMatches = [
                            ...pitScoutingMatches,  // Put pit scouting at the top
                            ...superScoutingMatches,
                            ...userMatches
                        ];

                        // Sort by match number
                        mergedMatches.sort((a, b) => a.match_number - b.match_number);

                        setMatches(mergedMatches);
                    } else {
                        console.log('No matches, super scouting, or pit scouting assignments found in Firebase.');
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
                            key={`${match.match_number}-${match.team_number}`} // Ensure a unique key
                            sx={{
                                width: '100%',
                                maxWidth: 400,
                                boxShadow: 3,
                                borderRadius: 2,
                                border: match.isSuperScouting ? '4px solid #d4af37' : 'none', // Apply golden border if super scouting
                                backgroundColor: match.isPitScouting ? '#f0f8ff' : 'white', // Different color for pit scouting matches
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ color: match.isPitScouting ? '#003366' : '#d4af37', mb: 1 }}>
                                    Match {match.match_number}
                                </Typography>
                                <Typography variant="body1">Team: {match.team_number}</Typography>
                                {!match.isSuperScouting && !match.isPitScouting && (
                                    <Typography
                                        variant="body1"
                                        sx={{ color: match.alliance === 'Red' ? 'red' : 'blue' }}
                                    >
                                        Alliance: {match.alliance}
                                    </Typography>
                                )}
                                {match.isPitScouting && (
                                    <Typography variant="body2" sx={{ color: '#003366' }}>
                                        Pit Scouting Assigned
                                    </Typography>
                                )}
                                {match.isSuperScouting && (
                                    <Typography variant="body2" sx={{ color: '#d4af37' }}>
                                        Super Scouting Assigned
                                    </Typography>
                                )}
                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#012265',
                                        '&:hover': { backgroundColor: '#d4af37', color: '#012265' },
                                    }}
                                    onClick={() => {
                                        if (match.isSuperScouting) {
                                            navigate(`/super-scout`, { state: { match, questions: match.superScoutingQuestions } });
                                        } else if (match.isPitScouting) {
                                            navigate('/pit-scout', { state: { teamNumber: match.team_number, matchNumber: match.match_number } });
                                        } else {
                                            navigate(`/scout/${match.match_number}`, { state: { match, user } });
                                        }
                                    }}
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

            {/* Add role-based buttons for admins */}
            {(user && (user.role === 'admin' || user.role === 'super_scouter')) && (
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
                    onClick={() => navigate('/super-scout')}
                >
                    New Super Scouting Form
                </Button>
            )}
            {(user && (user.role === 'admin' || user.role === 'pit_scouter')) && (
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
                    onClick={() => navigate('/pit-scout')}
                >
                    New Pit Scouting Form
                </Button>
            )}
            {(user) && (
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
            )}
        </Box>
    );
}

export default MyMatches;
