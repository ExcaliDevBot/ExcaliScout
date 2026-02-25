import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Button,
    Typography,
    Box,
    Paper,
} from '@mui/material';
import {getDatabase, ref, get, update} from 'firebase/database';
import {debounce} from 'lodash';
import {ThemeContext} from '../../context/ThemeContext'; // Adjust the import path as needed

function MatchAssign() {
    const [matches, setMatches] = useState([]);
    const [scouters, setScouters] = useState([]);
    const db = getDatabase();
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchesRef = ref(db, 'matches');
                const matchesSnapshot = await get(matchesRef);
                const usersRef = ref(db, 'users');
                const usersSnapshot = await get(usersRef);

                if (matchesSnapshot.exists() && usersSnapshot.exists()) {
                    const matchArray = Object.keys(matchesSnapshot.val()).map(key => ({
                        ...matchesSnapshot.val()[key],
                        id: key,
                    }));
                    const userArray = Object.keys(usersSnapshot.val()).map(key => ({
                        ...usersSnapshot.val()[key],
                        user_id: key,
                    }));

                    setMatches(matchArray);
                    setScouters(userArray);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [db]);

    // Use a simple debounced function instead of useCallback-wrapped debounce to satisfy react-hooks/exhaustive-deps in CRA
    const debounceUpdateFirebase = debounce((matchId, position, scouterName) => {
        const matchRef = ref(db, `matches/${matchId}`);
        update(matchRef, {
            [`${position}/scouter_name`]: scouterName,
        }).catch(error => {
            console.error("Error updating match in Firebase:", error);
        });
    }, 300);

    const handleScouterChange = useCallback(
        (matchId, position, scouterName) => {
            setMatches(prevMatches =>
                prevMatches.map(match =>
                    match.id === matchId
                        ? {
                            ...match,
                            [position]: {
                                ...match[position],
                                scouter_name: scouterName,
                            },
                        }
                        : match
                )
            );

            debounceUpdateFirebase(matchId, position, scouterName);
        },
        [setMatches]
    );

    const handleSaveAssignments = async () => {
        try {
            const updates = {};
            matches.forEach(match => {
                updates[`matches/${match.id}`] = match;
            });

            await update(ref(db), updates);
            alert('Assignments saved successfully!');
        } catch (error) {
            console.error('Error saving assignments:', error);
            alert('Failed to save assignments');
        }
    };

const handleAutoAssign = () => {
    const pitScouters = scouters.filter(scouter => scouter.role === 'pit');
    const strategyScouters = scouters.filter(scouter => scouter.role === 'strategy');
    const photographerScouters = scouters.filter(scouter => scouter.role === 'photographer');
    const normalScouters = scouters.filter(scouter => scouter.role === 'normal scouter');

    if (pitScouters.length < 3 || strategyScouters.length < 3 || normalScouters.length < 6) {
        alert('Not enough scouters to assign matches.');
        return;
    }

    const updatedMatches = [...matches];
    let pitIndex = 0;
    let strategyIndex = 0;
    let photographerIndex = 0;
    let normalIndex = 0;

    updatedMatches.forEach((match, matchIndex) => {
        const is6738Playing = match.teams && match.teams.includes(6738);
        const isPreviousMatch = matchIndex > 0 && updatedMatches[matchIndex - 1].teams && updatedMatches[matchIndex - 1].teams.includes(6738);

        // Check if this match or the previous one involves team 6738
        if (is6738Playing || isPreviousMatch) {
            // 1. Assign pit role scouters to match 6738 plays and the match before it
            for (let i = 0; i < 3; i++) {
                const position = i < 3 ? `red${i + 1}` : `blue${i - 2}`;
                if (match[position]) { // Ensure position exists
                    match[position].scouter_name = pitScouters[pitIndex].username;
                    pitIndex = (pitIndex + 1) % pitScouters.length;
                }
            }

            // 2. Assign strategy role scouters to remaining spots in the match
            for (let i = 3; i < 6; i++) {
                const position = i < 3 ? `red${i + 1}` : `blue${i - 2}`;
                if (match[position]) { // Ensure position exists
                    match[position].scouter_name = strategyScouters[strategyIndex].username;
                    strategyIndex = (strategyIndex + 1) % strategyScouters.length;
                }
            }
        } else {
            // 3. Assign photographer role scouters to all non-6738 matches
            for (let i = 0; i < 6; i++) {
                const position = i < 3 ? `red${i + 1}` : `blue${i - 2}`;
                if (match[position]) { // Ensure position exists
                    if (photographerIndex < photographerScouters.length) {
                        match[position].scouter_name = photographerScouters[photographerIndex].username;
                        photographerIndex++;
                    } else {
                        match[position].scouter_name = normalScouters[normalIndex].username;
                        normalIndex = (normalIndex + 1) % normalScouters.length;
                    }
                }
            }
        }
    });

    setMatches(updatedMatches);
};
    const sortedMatches = [...matches].sort((a, b) => a.match_id - b.match_id);

    return (
        <Box sx={{
            padding: 3,
            maxWidth: '1200px',
            margin: 'auto',
            fontFamily: 'sans-serif',
            backgroundColor: theme === 'light' ? '#fff' : '#333',
            color: theme === 'light' ? '#000' : '#fff'
        }}>
            <Typography variant="h4" align="center" sx={{mb: 3, color: theme === 'light' ? '#012265' : '#d4af37'}}>
                Match Assignment
            </Typography>

            <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, mb: 3}}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveAssignments}
                    sx={{
                        width: 200,
                        backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                        '&:hover': {
                            backgroundColor: theme === 'light' ? '#d4af37' : '#012265',
                            color: theme === 'light' ? '#012265' : '#d4af37'
                        }
                    }}
                >
                    Save Assignments
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAutoAssign}
                    sx={{
                        width: 200,
                        backgroundColor: theme === 'light' ? '#4caf50' : '#2c6f2b',
                        '&:hover': {backgroundColor: theme === 'light' ? '#2c6f2b' : '#4caf50'}
                    }}
                >
                    Auto Assign Scouters
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{
                overflowX: 'auto',
                boxShadow: 3,
                backgroundColor: theme === 'light' ? '#fff' : '#444'
            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{
                                backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                                color: theme === 'light' ? '#d4af37' : '#012265',
                                fontWeight: 'bold'
                            }}>
                                Match Number
                            </TableCell>
                            {[1, 2, 3, 4, 5, 6].map(index => (
                                <TableCell
                                    key={index}
                                    align="center"
                                    sx={{
                                        backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                                        color: theme === 'light' ? '#d4af37' : '#012265',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Scouter {index}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedMatches.map(match => (
                            <TableRow key={match.id}>
                                <TableCell align="center" sx={{
                                    backgroundColor: theme === 'light' ? '#fff' : '#444',
                                    color: theme === 'light' ? '#000' : '#fff'
                                }}>{match.match_id}</TableCell>
                                {[1, 2, 3, 4, 5, 6].map(index => {
                                    const position = index <= 3 ? `red${index}` : `blue${index - 3}`;
                                    const teamNumber = match[position]?.team_number || 'N/A';
                                    return (
                                        <TableCell key={index} align="center" sx={{
                                            backgroundColor: theme === 'light' ? '#fff' : '#444',
                                            color: theme === 'light' ? '#000' : '#fff'
                                        }}>
                                            <Typography variant="body2" sx={{mb: 1}}>
                                                Team: {teamNumber}
                                            </Typography>
                                            <Select
                                                value={match[position]?.scouter_name || ''}
                                                onChange={e => handleScouterChange(match.id, position, e.target.value)}
                                                fullWidth
                                                displayEmpty
                                                sx={{
                                                    minWidth: 120,
                                                    backgroundColor: theme === 'light' ? '#fff' : '#444',
                                                    color: theme === 'light' ? '#000' : '#fff'
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>Select Scouter</em>
                                                </MenuItem>
                                                {scouters.map(scouter => (
                                                    <MenuItem key={scouter.user_id} value={scouter.username}>
                                                        {scouter.username}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default MatchAssign;

