import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase-config';
import { ref, get, update, remove } from 'firebase/database';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { UserContext } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext'; // Adjust the import path as needed

const ApproveChangeRequests = () => {
    const { user } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const requestsRef = ref(db, 'changeRequests');
            const requestsSnapshot = await get(requestsRef);
            if (requestsSnapshot.exists()) {
                setRequests(Object.entries(requestsSnapshot.val()));
            }
        };
        fetchRequests();
    }, []);

    const handleApprove = async (id, request) => {
        if (user.username === 'Yehuda Rothstein' || user.name === 'Elad Choen') {
            const matchId = request.matchId.replace('match_', '');
            const scoutingDataRef = ref(db, `scoutingData/M${matchId}T${request.team}`);
            await update(scoutingDataRef, { [request.field]: request.newValue });
            await remove(ref(db, `changeRequests/${id}`));
            setRequests(requests.filter(([key]) => key !== id));
        } else {
            alert('You do not have permission to approve this request.');
        }
    };

    const handleReject = async (id) => {
        await remove(ref(db, `changeRequests/${id}`));
        setRequests(requests.filter(([key]) => key !== id));
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: theme === 'light' ? '#f5f5f5' : '#333', minHeight: '100vh', color: theme === 'light' ? '#000' : '#fff' }}>
            <Typography variant="h4" sx={{ marginBottom: 4, color: theme === 'light' ? '#012265' : '#d4af37', textAlign: 'center' }}>Approve Change Requests</Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 3, backgroundColor: theme === 'light' ? '#fff' : '#444' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: theme === 'light' ? '#012265' : '#d4af37' }}>
                            <TableCell sx={{ color: theme === 'light' ? '#fff' : '#012265' }}>Match ID</TableCell>
                            <TableCell sx={{ color: theme === 'light' ? '#fff' : '#012265' }}>Team</TableCell>
                            <TableCell sx={{ color: theme === 'light' ? '#fff' : '#012265' }}>Field</TableCell>
                            <TableCell sx={{ color: theme === 'light' ? '#fff' : '#012265' }}>New Value</TableCell>
                            <TableCell sx={{ color: theme === 'light' ? '#fff' : '#012265' }}>Reason</TableCell>
                            <TableCell sx={{ color: theme === 'light' ? '#fff' : '#012265' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map(([id, request]) => (
                            <TableRow key={id}>
                                <TableCell sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>{request.matchId}</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>{request.team}</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>{request.field}</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>{request.newValue}</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>{request.reason}</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleApprove(id, request)}
                                        sx={{ marginRight: 1, backgroundColor: theme === 'light' ? '#012265' : '#d4af37', '&:hover': { backgroundColor: theme === 'light' ? '#d4af37' : '#012265', color: theme === 'light' ? '#012265' : '#d4af37' } }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: 'red', color: '#fff' }}
                                        onClick={() => handleReject(id)}
                                    >
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ApproveChangeRequests;