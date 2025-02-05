import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Button, Typography, Box } from '@mui/material';
import { getDatabase, ref, get, update } from 'firebase/database';
import { debounce } from 'lodash';

function MatchAssign() {
    const [matches, setMatches] = useState([]);
    const [scouters, setScouters] = useState([]);
    const db = getDatabase();

    useEffect(() => {
        // Fetch matches and scouters data once when the component mounts
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
        // Update state immediately for a responsive UI
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

        // Debounce Firebase updates to minimize writes
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
            // Prepare data for batch update
            const updates = {};
            matches.forEach(match => {
                updates[`matches/${match.id}`] = match;
            });

            // Perform batch update in Firebase
            await update(ref(db), updates);
            alert('Assignments saved successfully!');
        } catch (error) {
            console.error('Error saving assignments:', error);
            alert('Failed to save assignments');
        }
    };

    const handleAutoAssign = () => {
        // Filter out admins (if any)
        const nonAdminScouters = scouters.filter(scouter => !scouter.isAdmin);

        // Ensure there are enough scouters
        if (nonAdminScouters.length < 6) {
            alert('You need at least 6 scouters to assign matches.');
            return;
        }

        const totalMatchPositions = 62 * 6;  // Total positions needed (62 matches * 6 positions per match)
        let scouterIndex = 0;  // Track scouter position in the list
        let matchIndex = 0;    // Track the match number

        // Copy the matches for updates
        const updatedMatches = [...matches];

        // Array to store the next available scouter for each match position
        let scouterCycleIndex = 0;  // Used to track which scouter is assigned to the current match position

        // Loop through all matches
        while (matchIndex < 62) {
            const match = updatedMatches[matchIndex];

            // Assign scouters to this match's positions
            ['red1', 'red2', 'blue1', 'blue2', 'red3', 'blue3'].forEach(position => {
                const scouter = nonAdminScouters[scouterIndex];
                if (scouter) {
                    match[position].scouter_name = scouter.username;
                }
            });

            // After assigning the scouter to a match, move to the next scouter for the next match
            if ((matchIndex + 1) % 3 === 0) {  // After every 3 matches, the scouter gets a break
                scouterIndex = (scouterIndex + 1) % nonAdminScouters.length;  // Move to the next scouter
            }

            matchIndex++; // Move to the next match
        }

        setMatches(updatedMatches); // Update the match positions with assigned scouters
    };

    // Sort matches by match number
    const sortedMatches = [...matches].sort((a, b) => a.match_id - b.match_id);

    return (
        <Box sx={{ padding: 3, maxWidth: '1200px', margin: 'auto', fontFamily: 'sans-serif' }}>
            <Typography variant="h4" align="center" sx={{ mb: 3, color: '#012265' }}>
                Match Assignment
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveAssignments}
                    sx={{ width: 200, backgroundColor: '#012265', '&:hover': { backgroundColor: '#d4af37' } }}
                >
                    Save Assignments
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAutoAssign}
                    sx={{ width: 200, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#2c6f2b' } }}
                >
                    Auto Assign Scouters
                </Button>
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ backgroundColor: '#012265', color: '#d4af37', fontWeight: 'bold' }}>
                                Match Number
                            </TableCell>
                            {[1, 2, 3, 4, 5, 6].map(index => (
                                <TableCell
                                    key={index}
                                    align="center"
                                    sx={{ backgroundColor: '#012265', color: '#d4af37', fontWeight: 'bold' }}
                                >
                                    Scouter {index}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedMatches.map(match => (
                            <TableRow key={match.id}>
                                <TableCell align="center">{match.match_id}</TableCell>
                                {[1, 2, 3, 4, 5, 6].map(index => {
                                    const position = index <= 3 ? `red${index}` : `blue${index - 3}`;
                                    return (
                                        <TableCell key={index} align="center">
                                            <Select
                                                value={match[position]?.scouter_name || ''}
                                                onChange={e => handleScouterChange(match.id, position, e.target.value)}
                                                fullWidth
                                                displayEmpty
                                                sx={{ minWidth: 120 }}
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
