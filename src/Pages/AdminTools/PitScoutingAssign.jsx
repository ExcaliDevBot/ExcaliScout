import React, { useState, useEffect } from "react";
import { db } from "../../firebase-config";
import { ref, push, onValue, get } from "firebase/database";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, CircularProgress, List, ListItem, ListItemText, Paper } from "@mui/material";

const PitScoutingAssign = () => {
    const [users, setUsers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [teamNumber, setTeamNumber] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch the list of users and pit scouting assignments from Firebase
    useEffect(() => {
        const usersRef = ref(db, "users");
        const assignmentsRef = ref(db, "pitScoutingAssignments");

        // Fetch users
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(Object.values(data || {}));
        });

        // Fetch pit scouting assignments
        onValue(assignmentsRef, (snapshot) => {
            const data = snapshot.val();
            setAssignments(Object.values(data || {}));
        });
    }, []);

    // Handle assignment of a team to a user
    const handleAssign = async () => {
        if (!selectedUser || !teamNumber) {
            alert("Please select a user and provide a team number.");
            return;
        }

        setLoading(true);
        try {
            const assignmentRef = ref(db, "pitScoutingAssignments");
            await push(assignmentRef, {
                user: selectedUser,
                team_number: teamNumber,
            });
            alert("Assignment successfully added!");
            setSelectedUser("");
            setTeamNumber("");
        } catch (error) {
            console.error("Error assigning team:", error);
            alert("Error assigning team.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 600, margin: "auto", backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" sx={{ color: "#012265", mb: 4 }}>
                Assign Pit Scouting
            </Typography>

            {/* User selection and team number input */}
            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                <InputLabel>Select Scouter</InputLabel>
                <Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    label="Select Scouter"
                >
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.username}>
                            {user.username}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Team Number"
                type="number"
                fullWidth
                value={teamNumber}
                onChange={(e) => setTeamNumber(e.target.value)}
                sx={{ marginBottom: 3 }}
            />

            <Box sx={{ textAlign: "center" }}>
                <Button
                    variant="contained"
                    sx={{
                        mt: 2,
                        backgroundColor: "#012265",
                        '&:hover': { backgroundColor: "#d4af37", color: "#012265" },
                        paddingX: 4,
                        paddingY: 2,
                        fontSize: 16,
                    }}
                    onClick={handleAssign}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Assign Team"}
                </Button>
            </Box>

            {/* Display current assignments */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" align="center" sx={{ color: "#012265", mb: 3 }}>
                    Current Pit Scouting Assignments
                </Typography>

                {assignments.length > 0 ? (
                    <Paper sx={{ padding: 2 }}>
                        <List>
                            {assignments.map((assignment, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`User: ${assignment.user}`}
                                        secondary={`Assigned Team: ${assignment.team_number}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ) : (
                    <Typography variant="body1" sx={{ textAlign: "center", color: "#777" }}>
                        No pit scouting assignments yet.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default PitScoutingAssign;
