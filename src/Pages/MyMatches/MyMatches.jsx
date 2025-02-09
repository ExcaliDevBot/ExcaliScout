import React, {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {getDatabase, ref, get} from 'firebase/database';
import {UserContext} from '../../context/UserContext';
import {ThemeContext} from '../../context/ThemeContext';
import {
    Box, Button, Card, CardContent, CircularProgress, Typography, Divider, IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

function MyMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submittedMatches, setSubmittedMatches] = useState([]);
    const [infoContent, setInfoContent] = useState({});
    const {user} = useContext(UserContext);
    const {theme} = useContext(ThemeContext);
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
            ...prev, [match.match_number]: prev[match.match_number] ? null : {...match, parentNodeName},
        }));
    };

    return (<Box sx={{
            p: 4, backgroundColor: theme === 'light' ? '#f0f0f0' : '#121212', color: theme === 'light' ? '#000' : '#fff'
        }}>
            <Typography variant="h4"
                        sx={{textAlign: 'center', mb: 4, color: theme === 'light' ? '#012265' : '#d4af37'}}>
                My Matches
            </Typography>
            {loading ? (<Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <CircularProgress/>
                </Box>) : matches.length > 0 ? (<Box
                    sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    }}
                >
                    {matches.map((match, index) => (<Card
                            key={`${match.match_number}-${match.team_number}`}
                            sx={{
                                width: '100%',
                                maxWidth: 400,
                                boxShadow: 3,
                                borderRadius: 2,
                                border: match.isSuperScouting ? '4px solid #d4af37' : match.isPitScouting ? '4px solid #2a93b9' : 'none',
                                backgroundColor: theme === 'light' ? (match.isPitScouting ? '#f0f8ff' : '#fff') : (match.isPitScouting ? '#1e1e1e' : '#333'),
                                color: theme === 'light' ? '#000' : '#fff',
                                position: 'relative',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6"
                                            sx={{color: match.isPitScouting ? '#2a93b9' : '#d4af37', mb: 1}}>
                                    Match {match.match_number}
                                </Typography>
                                <Typography variant="body1">Team: {match.team_number}</Typography>
                                {!match.isSuperScouting && !match.isPitScouting && (<Typography
                                        variant="body1"
                                        sx={{color: match.alliance === 'Red' ? 'red' : 'blue'}}
                                    >
                                        Alliance: {match.alliance}
                                    </Typography>)}
                                {match.isPitScouting && (<>
                                        <Typography variant="body2" sx={{color: '#2a93b9'}}>
                                            Pit Scouting Assigned
                                        </Typography>
                                        <IconButton
                                            sx={{position: 'absolute', bottom: 8, right: 8}}
                                            onClick={() => handleInfoClick(match)}
                                        >
                                            <InfoIcon sx={{color: 'gray'}}/>
                                        </IconButton>
                                    </>)}
                                {match.isSuperScouting && (<>
                                        <Typography variant="body2" sx={{color: '#d4af37'}}>
                                            Super Scouting Assigned
                                        </Typography>
                                        <IconButton
                                            sx={{position: 'absolute', bottom: 8, right: 8}}
                                            onClick={() => handleInfoClick(match)}
                                        >
                                            <InfoIcon sx={{color: 'gray'}}/>
                                        </IconButton>
                                    </>)}
                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: submittedMatches.includes(`${match.match_number}-${match.team_number}`) ? 'green' : (theme === 'light' ? '#012265' : '#d4af37'),
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: submittedMatches.includes(`${match.match_number}-${match.team_number}`) ? 'green' : (theme === 'light' ? '#d4af37' : '#012265'),
                                            color: 'white'
                                        },
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
                                                navigate(`/pit-scout`, {state: {teamNumber: match.team_number}});
                                            } else {
                                                navigate(`/scout/new`, {state: {match, user}});
                                            }
                                        }
                                    }}
                                    disabled={submittedMatches.includes(`${match.match_number}-${match.team_number}`)}
                                >
                                    {submittedMatches.includes(`${match.match_number}-${match.team_number}`) ? 'Completed!' : 'Scout Now'}
                                </Button>
                                {infoContent[match.match_number] && (<>
                                        <Divider sx={{my: 2}}/>
                                        <Typography variant="body2" sx={{color: 'gray'}}>
                                            Assigned By: {match.assignedBy}
                                        </Typography>
                                        <Typography variant="body2" sx={{color: 'gray'}}>
                                            Serial ID: {infoContent[match.match_number].assignmentId}
                                        </Typography>
                                    </>)}
                            </CardContent>
                        </Card>))}
                </Box>) : (<Typography variant="body1" sx={{textAlign: 'center', mt: 2}}>
                    No matches left for you :( Check back later!
                </Typography>)}

            {(user && (user.role === 'admin' || user.role === 'super_scouter')) && (<Button
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
                </Button>)}
            {(user && (user.role === 'admin' || user.role === 'pit_scouter')) && (<Button
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
                </Button>)}
            {(user) && (<Button
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
                    onClick={() => navigate('/scout/new', {state: {user}})}
                >
                    New Scouting Form
                </Button>)}
        </Box>);
}

export default MyMatches;