import React, { useState, useEffect, useCallback, useContext } from 'react';
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
    FormControl,
    InputLabel
} from '@mui/material';
import { getDatabase, ref, get, update } from 'firebase/database';
import { debounce } from 'lodash';
import { ThemeContext } from '../../context/ThemeContext'; // Adjust the import path as needed

function MatchAssign() {
    const [matches, setMatches] = useState([]);
    const [scouters, setScouters] = useState([]);
    const [assignmentType, setAssignmentType] = useState('');
    const db = getDatabase();
    const { theme } = useContext(ThemeContext);

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

    const handleScouterChange = useCallback((matchId, position, scouterName) => {
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
    }, []);

    const debounceUpdateFirebase = debounce((matchId, position, scouterName) => {
        const matchRef = ref(db, `matches/${matchId}`);
        update(matchRef, {
            [`${position}/scouter_name`]: scouterName,
        }).catch(error => {
            console.error("Error updating match in Firebase:", error);
        });
    }, 300);

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
        if (assignmentType === 'consecutive') {
            const normalScouters = scouters.filter(scouter => scouter.role === 'normal scouter');

            if (normalScouters.length < 6) {
                alert('You need at least 6 scouters to assign matches.');
                return;
            }

            const updatedMatches = [...matches];
            let scouterIndex = 0;
            let matchIndex = 0;

            while (matchIndex < updatedMatches.length) {
                for (let positionIndex = 1; positionIndex <= 6; positionIndex++) {
                    const position = positionIndex <= 3 ? `red${positionIndex}` : `blue${positionIndex - 3}`;
                    for (let i = 0; i < 3; i++) {
                        if (matchIndex + i < updatedMatches.length) {
                            updatedMatches[matchIndex + i][position].scouter_name = normalScouters[scouterIndex].username;
                        }
                    }
                    scouterIndex = (scouterIndex + 1) % normalScouters.length;
                }
                matchIndex += 3;
            }

            setMatches(updatedMatches);
        } else if (assignmentType === 'reserved') {
            const normalScouters = scouters.filter(scouter => scouter.role === 'normal scouter' && scouter.username !== 'Phoenix 1' && scouter.username !== 'Phoenix 2');

            if (normalScouters.length < 4) {
                alert('You need at least 4 normal scouters to assign matches.');
                return;
            }

            const updatedMatches = [...matches];
            let scouterIndex = 0;

            updatedMatches.forEach(match => {
                match.red1.scouter_name = 'Phoenix 1';
                match.blue1.scouter_name = 'Phoenix 2';

                ['red2', 'red3', 'blue2', 'blue3'].forEach(position => {
                    match[position].scouter_name = normalScouters[scouterIndex].username;
                    scouterIndex = (scouterIndex + 1) % normalScouters.length;
                });
            });

            setMatches(updatedMatches);
        } else {
            alert('Please select an assignment type.');
        }
    };

    const sortedMatches = [...matches].sort((a, b) => a.match_id - b.match_id);

    return (
        <Box sx={{ padding: 3, maxWidth: '1200px', margin: 'auto', fontFamily: 'sans-serif', backgroundColor: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}>
            <Typography variant="h4" align="center" sx={{ mb: 3, color: theme === 'light' ? '#012265' : '#d4af37' }}>
                Match Assignment
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Assignment Type</InputLabel>
                    <Select
                        value={assignmentType}
                        onChange={(e) => setAssignmentType(e.target.value)}
                        label="Assignment Type"
                        sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}
                    >
                        <MenuItem value="consecutive">Consecutive Matches</MenuItem>
                        <MenuItem value="reserved">Reserved Positions</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveAssignments}
                    sx={{ width: 200, backgroundColor: theme === 'light' ? '#012265' : '#d4af37', '&:hover': { backgroundColor: theme === 'light' ? '#d4af37' : '#012265', color: theme === 'light' ? '#012265' : '#d4af37' } }}
                >
                    Save Assignments
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAutoAssign}
                    sx={{ width: 200, backgroundColor: theme === 'light' ? '#4caf50' : '#2c6f2b', '&:hover': { backgroundColor: theme === 'light' ? '#2c6f2b' : '#4caf50' } }}
                >
                    Auto Assign Scouters
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ overflowX: 'auto', boxShadow: 3, backgroundColor: theme === 'light' ? '#fff' : '#444' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ backgroundColor: theme === 'light' ? '#012265' : '#d4af37', color: theme === 'light' ? '#d4af37' : '#012265', fontWeight: 'bold' }}>
                                Match Number
                            </TableCell>
                            {[1, 2, 3, 4, 5, 6].map(index => (
                                <TableCell
                                    key={index}
                                    align="center"
                                    sx={{ backgroundColor: theme === 'light' ? '#012265' : '#d4af37', color: theme === 'light' ? '#d4af37' : '#012265', fontWeight: 'bold' }}
                                >
                                    Scouter {index}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedMatches.map(match => (
                            <TableRow key={match.id}>
                                <TableCell align="center" sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>{match.match_id}</TableCell>
                                {[1, 2, 3, 4, 5, 6].map(index => {
                                    const position = index <= 3 ? `red${index}` : `blue${index - 3}`;
                                    return (
                                        <TableCell key={index} align="center" sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>
                                            <Select
                                                value={match[position]?.scouter_name || ''}
                                                onChange={e => handleScouterChange(match.id, position, e.target.value)}
                                                fullWidth
                                                displayEmpty
                                                sx={{ minWidth: 120, backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}
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