import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { UserContext } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import { LanguageContext } from '../../context/LanguageContext';
import {
    Box, Button, Card, CardContent, CircularProgress, Typography, IconButton, Chip, Stack, Container, SpeedDial, SpeedDialAction, SpeedDialIcon,
} from '@mui/material';
import { Info, QrCodeScanner, Engineering, SupervisorAccount, SportsSoccer } from '@mui/icons-material';
import translations from '../../translations';

function MyMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submittedMatches, setSubmittedMatches] = useState([]);
    const [infoContent, setInfoContent] = useState({});
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const { user } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const { language } = useContext(LanguageContext);
    const t = translations[language];
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
                    const scoutingDataRef = ref(db, `scoutingData`);
                    const currentMatchRef = ref(db, `currentMatch`);
                    const pitScoutingResultsRef = ref(db, `pitScoutingResults`);
                    const superScoutingResultsRef = ref(db, `superScoutingResults`);

                    const [snapshotMatches, snapshotSuperScouting, snapshotPitScouting, snapshotScoutingData, snapshotCurrentMatch, snapshotPitScoutingResults, snapshotSuperScoutingResults] = await Promise.all([get(matchesRef), get(superScoutingAssignmentsRef), get(pitScoutingAssignmentsRef), get(scoutingDataRef), get(currentMatchRef), get(pitScoutingResultsRef), get(superScoutingResultsRef)]);

                    if (snapshotMatches.exists() && snapshotSuperScouting.exists() && snapshotPitScouting.exists() && snapshotCurrentMatch.exists()) {
                        const allMatches = Object.values(snapshotMatches.val());
                        const allSuperScoutingAssignments = Object.entries(snapshotSuperScouting.val());
                        const allPitScoutingAssignments = Object.values(snapshotPitScouting.val());
                        const allScoutingData = snapshotScoutingData.exists() ? snapshotScoutingData.val() : {};
                        const currentMatch = snapshotCurrentMatch.val();
                        const pitScoutingResults = snapshotPitScoutingResults.exists() ? snapshotPitScoutingResults.val() : {};
                        const superScoutingResults = snapshotSuperScoutingResults.exists() ? snapshotSuperScoutingResults.val() : {};

                        const userMatches = allMatches
                            .filter(match => match.match_id >= currentMatch - 2)
                            .map((match) => {
                                if (!match || !match.match_id) return null;

                                const positions = ['red1', 'red2', 'red3', 'blue1', 'blue2', 'blue3'];
                                let isSuperScouting = false;

                                for (const position of positions) {
                                    if (match[position]?.scouter_name === user.username) {
                                        isSuperScouting = allSuperScoutingAssignments.some(([assignmentId, assignment]) => assignment.user === user.username && assignment.match.match_number === match.match_id);
                                        const nodeName = `M${match.match_id}T${match[position]?.team_number}`;
                                        if (superScoutingResults[nodeName]) {
                                            return null;
                                        }
                                        return {
                                            match_number: match.match_id,
                                            team_number: match[position]?.team_number,
                                            alliance: position.startsWith('red') ? 'Red' : 'Blue',
                                            isSuperScouting,
                                            superScoutingQuestions: isSuperScouting ? allSuperScoutingAssignments.find(([assignmentId, assignment]) => assignment.user === user.username && assignment.match.match_number === match.match_id)[1].questions : [],
                                            assignedBy: isSuperScouting ? allSuperScoutingAssignments.find(([assignmentId, assignment]) => assignment.user === user.username && assignment.match.match_number === match.match_id)[1].assignedBy : '',
                                            assignmentId: isSuperScouting ? allSuperScoutingAssignments.find(([assignmentId, assignment]) => assignment.user === user.username && assignment.match.match_number === match.match_id)[0] : '',
                                        };
                                    }
                                }
                                return null;
                            })
                            .filter(Boolean);

                        const superScoutingMatches = allSuperScoutingAssignments
                            .filter(([assignmentId, assignment]) => {
                                const nodeName = `M${assignment.match.match_number}T${assignment.team_number}`;
                                return assignment.user === user.username && !superScoutingResults[nodeName];
                            })
                            .map(([assignmentId, assignment]) => {
                                const match = assignment.match;
                                if (!match) return null;
                                return {
                                    match_number: match.match_number,
                                    team_number: match.team_number,
                                    isSuperScouting: true,
                                    superScoutingQuestions: Object.values(assignment.questions || []),
                                    assignedBy: assignment.assignedBy,
                                    assignmentId,
                                };
                            })
                            .filter(Boolean);

                        const pitScoutingMatches = allPitScoutingAssignments
                            .filter(assignment => assignment.user === user.username && !pitScoutingResults[assignment.team_number])
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

                        const mergedMatches = [...pitScoutingMatches, ...superScoutingMatches, ...userMatches];

                        mergedMatches.sort((a, b) => a.match_number - b.match_number);

                        const submittedMatches = mergedMatches.filter(match => {
                            const nodeName = `M${match.match_number}T${match.team_number}`;
                            return allScoutingData[nodeName] && allScoutingData[nodeName].submittedAt;
                        }).map(match => `${match.match_number}-${match.team_number}`);

                        console.log('All matches assigned to the user:', mergedMatches);
                        console.log('Submitted matches:', submittedMatches);

                        setMatches(mergedMatches);
                        setSubmittedMatches(submittedMatches);
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

    const handleInfoClick = async (match) => {
        const nodeName = `M${match.match_number}T${match.team_number}`;
        const matchRef = ref(db, `scoutingData/${nodeName}`);
        const snapshot = await get(matchRef);
        const parentNodeName = snapshot.exists() ? snapshot.ref.parent.key : 'Unknown';

        setInfoContent((prev) => ({
            ...prev, [match.match_number]: prev[match.match_number] ? null : { ...match, parentNodeName },
        }));
    };

    const speedDialActions = [
        ...(user && (user.role === 'admin' || user.role === 'super scouter') ? [{
            icon: <SupervisorAccount />,
            name: t.newSuperScoutingForm,
            action: () => navigate('/super-scout')
        }] : []),
        ...(user && (user.role === 'admin' || user.role === 'pit scouter') ? [{
            icon: <Engineering />,
            name: t.newPitScoutingForm,
            action: () => navigate('/pit-scout')
        }] : []),
        {
            icon: <SportsSoccer />,
            name: t.newScoutingForm,
            action: () => navigate('/scout/new', { state: { user } })
        },
        {
            icon: <QrCodeScanner />,
            name: 'Scan QR Code',
            action: () => navigate('/scan-match')
        }
    ];

    return (
        <Container 
            maxWidth="sm" 
            sx={{
                minHeight: '100vh',
                backgroundColor: theme === 'light' ? '#f5f5f5' : '#121212',
                py: 2,
                px: 1,
                direction: language === 'he' ? 'rtl' : 'ltr'
            }}
        >
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography 
                    variant="h4"
                    sx={{ 
                        color: theme === 'light' ? '#012265' : '#d4af37',
                        fontWeight: 'bold',
                        mb: 1
                    }}
                >
                    {t.myMatches}
                </Typography>
                <Typography 
                    variant="subtitle1" 
                    sx={{ 
                        color: theme === 'light' ? '#666' : '#ccc',
                        mb: 2
                    }}
                >
                    Welcome back, {user?.username}
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '50vh' 
                }}>
                    <CircularProgress size={60} sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ color: theme === 'light' ? '#666' : '#ccc' }}>
                        Loading your matches...
                    </Typography>
                </Box>
            ) : matches.length > 0 ? (
                <Stack spacing={2} sx={{ pb: 10 }}>
                    {matches.map((match, index) => (
                        <Card
                            key={`${match.match_number}-${match.team_number}`}
                            sx={{
                                width: '100%',
                                borderRadius: 3,
                                boxShadow: theme === 'light' ? '0 4px 12px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.3)',
                                border: match.isSuperScouting ? '3px solid #d4af37' : match.isPitScouting ? '3px solid #2196f3' : '2px solid transparent',
                                backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e',
                                color: theme === 'light' ? '#000' : '#fff',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme === 'light' ? '0 8px 20px rgba(0,0,0,0.15)' : '0 8px 20px rgba(0,0,0,0.4)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography 
                                            variant="h5"
                                            sx={{ 
                                                color: theme === 'light' ? '#012265' : '#d4af37',
                                                fontWeight: 'bold',
                                                mb: 0.5
                                            }}
                                        >
                                            {t.match} {match.match_number}
                                        </Typography>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                color: theme === 'light' ? '#333' : '#fff',
                                                mb: 1
                                            }}
                                        >
                                            {t.team} {match.team_number}
                                        </Typography>
                                    </Box>
                                    
                                    {(match.isSuperScouting || match.isPitScouting) && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleInfoClick(match)}
                                            sx={{ 
                                                color: theme === 'light' ? '#666' : '#ccc',
                                                '&:hover': {
                                                    backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)'
                                                }
                                            }}
                                        >
                                            <Info />
                                        </IconButton>
                                    )}
                                </Box>

                                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                    {!match.isSuperScouting && !match.isPitScouting && match.alliance && (
                                        <Chip
                                            label={`${t.alliance}: ${match.alliance}`}
                                            size="small"
                                            sx={{
                                                backgroundColor: match.alliance === 'Red' ? '#ffebee' : '#e3f2fd',
                                                color: match.alliance === 'Red' ? '#c62828' : '#1565c0',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    )}
                                    
                                    {match.isSuperScouting && (
                                        <Chip
                                            label={t.superScoutingAssigned}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#fff3e0',
                                                color: '#e65100',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    )}
                                    
                                    {match.isPitScouting && (
                                        <Chip
                                            label={t.pitScoutingAssigned}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#e3f2fd',
                                                color: '#1565c0',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    )}
                                    
                                    <Chip
                                        label={submittedMatches.includes(`${match.match_number}-${match.team_number}`) ? t.completed : 'Pending'}
                                        size="small"
                                        sx={{
                                            backgroundColor: submittedMatches.includes(`${match.match_number}-${match.team_number}`) ? '#e8f5e8' : '#fff3e0',
                                            color: submittedMatches.includes(`${match.match_number}-${match.team_number}`) ? '#2e7d32' : '#f57c00',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Stack>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        backgroundColor: submittedMatches.includes(`${match.match_number}-${match.team_number}`) 
                                            ? '#4caf50' 
                                            : (theme === 'light' ? '#012265' : '#d4af37'),
                                        '&:hover': {
                                            backgroundColor: submittedMatches.includes(`${match.match_number}-${match.team_number}`) 
                                                ? '#388e3c' 
                                                : (theme === 'light' ? '#001a4b' : '#b8941f'),
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#4caf50',
                                            color: '#fff'
                                        }
                                    }}
                                    onClick={() => {
                                        if (!submittedMatches.includes(`${match.match_number}-${match.team_number}`)) {
                                            if (match.isSuperScouting) {
                                                navigate(`/super-scout`, {
                                                    state: {
                                                        match, questions: match.superScoutingQuestions
                                                    }
                                                });
                                            } else if (match.isPitScouting) {
                                                navigate(`/pit-scout`, { state: { teamNumber: match.team_number } });
                                            } else {
                                                navigate(`/scout/new`, { state: { match, user } });
                                            }
                                        }
                                    }}
                                    disabled={submittedMatches.includes(`${match.match_number}-${match.team_number}`)}
                                >
                                    {submittedMatches.includes(`${match.match_number}-${match.team_number}`) ? t.completed : t.scoutNow}
                                </Button>

                                {infoContent[match.match_number] && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: theme === 'light' ? '#e0e0e0' : '#444' }}>
                                        <Typography variant="body2" sx={{ color: theme === 'light' ? '#666' : '#ccc', mb: 0.5 }}>
                                            <strong>{t.assignedBy}:</strong> {match.assignedBy}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: theme === 'light' ? '#666' : '#ccc' }}>
                                            <strong>{t.serialId}:</strong> {infoContent[match.match_number].assignmentId}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Card sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e',
                    borderRadius: 3
                }}>
                    <CardContent>
                        <SportsSoccer sx={{ fontSize: 64, color: theme === 'light' ? '#ccc' : '#666', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: theme === 'light' ? '#666' : '#ccc', mb: 1 }}>
                            {t.noMatchesLeft}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme === 'light' ? '#999' : '#777' }}>
                            Check back later for new assignments
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Speed Dial for Quick Actions */}
            <SpeedDial
                ariaLabel="Quick Actions"
                sx={{ 
                    position: 'fixed', 
                    bottom: 24, 
                    right: 24,
                    '& .MuiFab-primary': {
                        backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                        '&:hover': {
                            backgroundColor: theme === 'light' ? '#001a4b' : '#b8941f',
                        }
                    }
                }}
                icon={<SpeedDialIcon />}
                open={speedDialOpen}
                onClose={() => setSpeedDialOpen(false)}
                onOpen={() => setSpeedDialOpen(true)}
            >
                {speedDialActions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={() => {
                            setSpeedDialOpen(false);
                            action.action();
                        }}
                        sx={{
                            '& .MuiFab-primary': {
                                backgroundColor: theme === 'light' ? '#f5f5f5' : '#333',
                                color: theme === 'light' ? '#012265' : '#d4af37',
                                '&:hover': {
                                    backgroundColor: theme === 'light' ? '#e0e0e0' : '#444',
                                }
                            }
                        }}
                    />
                ))}
            </SpeedDial>
        </Container>
    );
}

export default MyMatches;