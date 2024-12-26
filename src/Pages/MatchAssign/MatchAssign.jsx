import React, { useState, useEffect } from 'react';
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
                if (matchesSnapshot.exists()) {
                    const matchArray = Object.keys(matchesSnapshot.val()).map(key => ({
                        ...matchesSnapshot.val()[key],
                        id: key,
                    }));
                    setMatches(matchArray);
                }

                const usersRef = ref(db, 'users');
                const usersSnapshot = await get(usersRef);
                if (usersSnapshot.exists()) {
                    const userArray = Object.keys(usersSnapshot.val()).map(key => ({
                        ...usersSnapshot.val()[key],
                        user_id: key,
                    }));
                    setScouters(userArray);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [db]);

    const handleScouterChange = (matchId, position, scouterName) => {
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
    };

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
                        {matches.map(match => (
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
