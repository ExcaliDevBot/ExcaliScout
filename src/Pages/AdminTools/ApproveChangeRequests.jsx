import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase-config';
import { ref, get, update, remove } from 'firebase/database';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { UserContext } from '../../context/UserContext';

const ApproveChangeRequests = () => {
    const {user} = useContext(UserContext);
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
        <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ marginBottom: 4, color: '#012265', textAlign: 'center' }}>Approve Change Requests</Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#012265' }}>
                            <TableCell sx={{ color: '#fff' }}>Match ID</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Team</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Field</TableCell>
                            <TableCell sx={{ color: '#fff' }}>New Value</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map(([id, request]) => (
                            <TableRow key={id}>
                                <TableCell>{request.matchId}</TableCell>
                                <TableCell>{request.team}</TableCell>
                                <TableCell>{request.field}</TableCell>
                                <TableCell>{request.newValue}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleApprove(id, request)}
                                        sx={{ marginRight: 1 }}
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