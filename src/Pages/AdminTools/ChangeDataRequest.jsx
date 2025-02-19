import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase-config';
import { ref, get, push } from 'firebase/database';
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
import { ThemeContext } from '../../context/ThemeContext'; // Adjust the import path as needed

const ChangeDataRequest = () => {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState('');
    const [newValue, setNewValue] = useState('');
    const [selectedReason, setSelectedReason] = useState('');

    const { theme } = useContext(ThemeContext);
    const reasons = ['Misclick', 'Judges Decision', 'Data Error', 'Other'];

    useEffect(() => {
        const fetchMatches = async () => {
            const matchesRef = ref(db, 'matches');
            const matchesSnapshot = await get(matchesRef);
            if (matchesSnapshot.exists()) {
                setMatches(Object.keys(matchesSnapshot.val()));
            }
        };
        fetchMatches();
    }, []);

    useEffect(() => {
        if (selectedMatch) {
            const fetchTeams = async () => {
                const teamsRef = ref(db, `matches/${selectedMatch}`);
                const teamsSnapshot = await get(teamsRef);
                if (teamsSnapshot.exists()) {
                    const teamsData = teamsSnapshot.val();
                    const teamNumbers = Object.keys(teamsData).map(key => teamsData[key].team_number);
                    setTeams(teamNumbers);
                } else {
                    setTeams([]);
                }
            };
            fetchTeams();
        }
    }, [selectedMatch]);

    useEffect(() => {
        const fetchFields = () => {
            const scoutingFormFields = [
                'Match', 'Notes',
                'L1', 'L2', 'L3', 'L4', 'climbOption', 'removeAlgae',
                'autoL1', 'autoL2', 'autoL3', 'autoL4', 'autoRemoveAlgae'
            ];
            setFields(scoutingFormFields);
        };
        fetchFields();
    }, []);

    const handleSubmit = async () => {
        const changeRequestRef = ref(db, 'changeRequests');
        await push(changeRequestRef, {
            matchId: selectedMatch,
            team: selectedTeam,
            field: selectedField,
            newValue,
            reason: selectedReason,
            status: 'pending'
        });
        setSelectedMatch('');
        setSelectedTeam('');
        setSelectedField('');
        setNewValue('');
        setSelectedReason('');
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: theme === 'light' ? '#f5f5f5' : '#333', minHeight: '100vh', color: theme === 'light' ? '#000' : '#fff' }}>
            <Paper sx={{ padding: 4, maxWidth: 600, margin: 'auto', boxShadow: 3, backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>
                <Typography variant="h4" sx={{ marginBottom: 4, color: theme === 'light' ? '#012265' : '#d4af37' }}>Request Data Change</Typography>
                <FormControl fullWidth margin="normal" sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>
                    <InputLabel>Match</InputLabel>
                    <Select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)}>
                        {matches.map((match) => (
                            <MenuItem key={match} value={match}>{match}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>
                    <InputLabel>Team</InputLabel>
                    <Select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                        {teams.map((team) => (
                            <MenuItem key={team} value={team}>{team}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>
                    <InputLabel>Field</InputLabel>
                    <Select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
                        {fields.map((field) => (
                            <MenuItem key={field} value={field}>{field}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="New Value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}
                />
                <FormControl fullWidth margin="normal" sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>
                    <InputLabel>Reason</InputLabel>
                    <Select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
                        {reasons.map((reason) => (
                            <MenuItem key={reason} value={reason}>{reason}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2, backgroundColor: theme === 'light' ? '#012265' : '#d4af37', '&:hover': { backgroundColor: theme === 'light' ? '#d4af37' : '#012265', color: theme === 'light' ? '#012265' : '#d4af37' } }}>Submit Request</Button>
            </Paper>
        </Box>
    );
};

export default ChangeDataRequest;