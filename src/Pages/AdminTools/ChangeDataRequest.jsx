import React, {useState, useEffect} from 'react';
import {db} from '../../firebase-config';
import {ref, get, push} from 'firebase/database';
import {Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Paper} from '@mui/material';

const ChangeDataRequest = () => {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState('');
    const [newValue, setNewValue] = useState('');
    const [selectedReason, setSelectedReason] = useState('');

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
        <Box sx={{padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
            <Paper sx={{padding: 4, maxWidth: 600, margin: 'auto', boxShadow: 3}}>
                <Typography variant="h4" sx={{marginBottom: 4, color: '#012265'}}>Request Data Change</Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Match</InputLabel>
                    <Select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)}>
                        {matches.map((match) => (
                            <MenuItem key={match} value={match}>{match}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Team</InputLabel>
                    <Select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                        {teams.map((team) => (
                            <MenuItem key={team} value={team}>{team}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
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
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Reason</InputLabel>
                    <Select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
                        {reasons.map((reason) => (
                            <MenuItem key={reason} value={reason}>{reason}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{marginTop: 2}}>Submit
                    Request</Button>
            </Paper>
        </Box>
    );
};

export default ChangeDataRequest;