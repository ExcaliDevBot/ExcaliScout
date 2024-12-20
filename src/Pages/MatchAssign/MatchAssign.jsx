import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Button, Typography, Box } from '@mui/material';

function MatchAssign() {
    const [matches, setMatches] = useState([]);
    const [scouters, setScouters] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch('https://ScoutingSystem.pythonanywhere.com/matches');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setMatches(data.matches);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('https://ScoutingSystem.pythonanywhere.com/users');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setScouters(data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchMatches();
        fetchUsers();
    }, []);

    const handleScouterChange = (matchId, scouterIndex, userId) => {
        setMatches(matches.map(match => {
            if (match.id === matchId) {
                return { ...match, [`scouter${scouterIndex}`]: userId };
            }
            return match;
        }));
    };

    const handleManualAssign = async () => {
        try {
            const response = await fetch('https://ScoutingSystem.pythonanywhere.com/manual_assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matches }),
            });
            const data = await response.json();
            if (data.status === 'success') {
            } else {
                alert('Failed to save assignments');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to save assignments');
        }
    };

    const handleReassign = async () => {
        try {
            const response = await fetch('https://ScoutingSystem.pythonanywhere.com/reassign_scouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (data.status === 'success') {
                setMatches(data.matches);
            } else {
                alert('Failed to reassign scouters');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to reassign scouters');
        }
    };

    return (
        <Box sx={{ padding: 3, maxWidth: '1200px', margin: 'auto', fontFamily: 'sans-serif' }}>
            <Typography variant="h4" align="center" sx={{ mb: 3, color: '#012265' }}>
                Match Assignment
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Button variant="contained" color="primary" onClick={handleManualAssign} sx={{ width: 200 }}>
                    Save Assignments
                </Button>
                <Button variant="outlined" color="primary" onClick={handleReassign} sx={{ width: 200 }}>
                    Reassign Scouters
                </Button>
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ backgroundColor: '#012265', color: '#d4af37' }}>Match Number</TableCell>
                            {[1, 2, 3, 4, 5, 6].map(index => (
                                <TableCell key={index} align="center" sx={{ backgroundColor: '#012265', color: '#d4af37' }}>
                                    Scouter {index}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {matches.map(match => (
                            <TableRow key={match.id}>
                                <TableCell align="center">{match.id}</TableCell>
                                {[1, 2, 3, 4, 5, 6].map(index => (
                                    <TableCell key={index} align="center">
                                        <Select
                                            value={match[`scouter${index}`] || ''}
                                            onChange={(e) => handleScouterChange(match.id, index, e.target.value)}
                                            fullWidth
                                        >
                                            <MenuItem value="">
                                                <em>Select Scouter</em>
                                            </MenuItem>
                                            {scouters.map(scouter => (
                                                <MenuItem key={scouter.user_id} value={scouter.user_id}>
                                                    {scouter.username}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default MatchAssign;
