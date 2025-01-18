import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { UserContext } from '../../context/UserContext';
import { ThemeContext } from '../../ThemeContext';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
    Popover,
    IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

function MyMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const db = getDatabase();
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    const handlePopoverOpen = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverContent('');
    };

    const open = Boolean(anchorEl);

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

                        const userMatches = allMatches
                            .map((match) => {
                                if (!match || !match.match_id) return null;

                                const positions = ['red1', 'red2', 'red3', 'blue1', 'blue2', 'blue3'];
                                let isSuperScouting = false;

                                for (const position of positions) {
                                    if (match[position]?.scouter_name === user.username) {
                                        isSuperScouting = allSuperScoutingAssignments.some(
                                            (assignment) =>
                                                assignment.user === user.username &&
                                                String(assignment.match.match_number) === String(match.match_id)
                                        );
                                        return {
                                            match_number: match.match_id,
                                            team_number: match[position]?.team_number,
                                            alliance: position.startsWith('red') ? 'Red' : 'Blue',
                                            isSuperScouting,
                                            superScoutingQuestions: isSuperScouting
                                                ? Object.values(allSuperScoutingAssignments.find(assignment =>
                                                    assignment.match.match_number === match.match_id)?.questions || {})
                                                : [],
                                            assignedBy: isSuperScouting
                                                ? allSuperScoutingAssignments.find(assignment =>
                                                    assignment.match.match_number === match.match_id)?.assignedBy
                                                : null,
                                        };
                                    }
                                }
                                return null;
                            })
                            .filter(Boolean);

                        const superScoutingMatches = allSuperScoutingAssignments
                            .filter(assignment => assignment.user === user.username)
                            .map((assignment) => {
                                const match = assignment.match;
                                if (!match) return null;
                                return {
                                    match_number: match.match_number,
                                    team_number: match.team_number,
                                    isSuperScouting: true,
                                    superScoutingQuestions: Object.values(assignment.questions || []),
                                    assignedBy: assignment.assignedBy,
                                };
                            })
                            .filter(Boolean);

                        const pitScoutingMatches = allPitScoutingAssignments
                            .filter(assignment => assignment.user === user.username)
                            .map((assignment) => {
                                const match = assignment;
                                if (!match || !match.team_number) return null;
                                return {
                                    match_number: match.match_number || "Pit Scouting",
                                    team_number: match.team_number,
                                    isPitScouting: true,
                                    assignedBy: assignment.assignedBy,
                                };
                            })
                            .filter(Boolean);

                        const mergedMatches = [
                            ...pitScoutingMatches,
                            ...superScoutingMatches,
                            ...userMatches
                        ];

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
        <Box sx={{ p: 4, backgroundColor: theme === 'light' ? '#f0f0f0' : '#121212', color: theme === 'light' ? '#000' : '#fff' }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: theme === 'light' ? '#012265' : '#d4af37' }}>
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
                            key={`${match.match_number}-${match.team_number}`}
                            sx={{
                                width: '100%',
                                maxWidth: 400,
                                boxShadow: 3,
                                borderRadius: 2,
                                border: match.isSuperScouting ? '4px solid #d4af37' : 'none',
                                backgroundColor: theme === 'light' ? (match.isPitScouting ? '#f0f8ff' : '#fff') : (match.isPitScouting ? '#1e1e1e' : '#333'),
                                color: theme === 'light' ? '#000' : '#fff',
                                position: 'relative',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ color: match.isPitScouting ? '#2a93b9' : '#d4af37', mb: 1 }}>
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
                                    <>
                                        <Typography variant="body2" sx={{ color: '#2a93b9' }}>
                                            Pit Scouting Assigned
                                        </Typography>
                                        <IconButton
                                            sx={{ position: 'absolute', bottom: 8, right: 8 }}
                                            onMouseEnter={(e) => handlePopoverOpen(e, `Assigned By ${match.assignedBy}, Serial Number ${Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111}`)}
                                            onMouseLeave={handlePopoverClose}
                                        >
                                            <InfoIcon sx={{ color: 'gray' }} />
                                        </IconButton>
                                    </>
                                )}
                                {match.isSuperScouting && (
                                    <>
                                        <Typography variant="body2" sx={{ color: '#d4af37' }}>
                                            Super Scouting Assigned
                                        </Typography>
                                        <IconButton
                                            sx={{ position: 'absolute', bottom: 8, right: 8 }}
                                            onMouseEnter={(e) => handlePopoverOpen(
                                                e, `Assigned By ${match.assignedBy},\nSerial Number ${Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111}`
                                            )}
                                            onMouseLeave={handlePopoverClose}
                                        >
                                            <InfoIcon sx={{ color: 'gray' }} />
                                        </IconButton>
                                    </>
                                )}
                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                                        color: theme === 'light' ? '#fff' : '#012265',
                                        '&:hover': { backgroundColor: theme === 'light' ? '#d4af37' : '#012265', color: theme === 'light' ? '#012265' : '#d4af37' },
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

            {(user && (user.role === 'admin' || user.role === 'super_scouter')) && (
                <Button
                    variant="outlined"
                    sx={{
                        mt: 4,
                        display: 'block',
                        mx: 'auto',
                        color: theme === 'light' ? '#012265' : '#d4af37',
                        borderColor: theme === 'light' ? '#012265' : '#d4af37',
                        '&:hover': {
                            backgroundColor: theme === 'light' ? '#d4af37' : '#012265',
                            color: theme === 'light' ? '#012265' : '#d4af37',
                            borderColor: theme === 'light' ? '#d4af37' : '#012265',
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
                        color: theme === 'light' ? '#012265' : '#d4af37',
                        borderColor: theme === 'light' ? '#012265' : '#d4af37',
                        '&:hover': {
                            backgroundColor: theme === 'light' ? '#d4af37' : '#012265',
                            color: theme === 'light' ? '#012265' : '#d4af37',
                            borderColor: theme === 'light' ? '#d4af37' : '#012265',
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
                        color: theme === 'light' ? '#012265' : '#d4af37',
                        borderColor: theme === 'light' ? '#012265' : '#d4af37',
                        '&:hover': {
                            backgroundColor: theme === 'light' ? '#d4af37' : '#012265',
                            color: theme === 'light' ? '#012265' : '#d4af37',
                            borderColor: theme === 'light' ? '#d4af37' : '#012265',
                        },
                    }}
                    onClick={() => navigate('/scout/new', { state: { user } })}
                >
                    New Scouting Form
                </Button>
            )}

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography>{popoverContent}</Typography>
                </Box>
            </Popover>
        </Box>
    );
}

export default MyMatches;