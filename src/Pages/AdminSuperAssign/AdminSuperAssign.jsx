import React, { useState, useEffect } from "react";
import { db } from "../../firebase-config";
import { ref, push, onValue } from "firebase/database";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Checkbox,
    ListItemText,
    TextField,
} from "@mui/material";

const questionsList = {
    0: "תאר אוטונומי?",
    1: "תאר טלאופ + אנדגיים",
    2: "תאר שימוש בטראפ",
    3: "תאר הגנה",
    4: "תאר התמודוות מול הגנה",
    5: "פרט רוטיישנס",
    6: "ירי - מיקום + גובה + זמן",
    7: "איסוף - רצפה/פידר + זמן",
    8: "תאר כימיה עם שאר הברית",
    9: "הערות",
};

const AdminSuperAssign = () => {
    const [users, setUsers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [matchNumber, setMatchNumber] = useState("");
    const [teamNumber, setTeamNumber] = useState("");
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    // Fetch users and matches (dummy implementation, replace with actual data fetching)
    useEffect(() => {
        const usersRef = ref(db, "users"); // Replace with actual Firebase path for users
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(Object.values(data || {}));
        });

        const matchesRef = ref(db, "matches"); // Replace with actual Firebase path for matches
        onValue(matchesRef, (snapshot) => {
            const data = snapshot.val();
            setMatches(Object.values(data || {}));
        });
    }, []);

    const handleAssign = () => {
        if (!selectedUser || !matchNumber || !teamNumber || selectedQuestions.length === 0) {
            alert("Please select a user, match, and questions.");
            return;
        }

        const assignmentRef = ref(db, "superScoutingAssignments");
        push(assignmentRef, {
            user: selectedUser,
            match: { match_number: matchNumber, team_number: teamNumber },
            questions: selectedQuestions,
        });

        alert("Assignment successfully added!");
        setSelectedUser("");
        setMatchNumber("");
        setTeamNumber("");
        setSelectedQuestions([]);
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Assign Super Scouting Matches
            </Typography>

            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                <InputLabel>Select Super Scouter</InputLabel>
                <Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.username}>
                            {user.username}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Text fields for Match Number and Team Number */}
            <TextField
                label="Match Number"
                type="number"
                fullWidth
                value={matchNumber}
                onChange={(e) => setMatchNumber(e.target.value)}
                sx={{ marginBottom: 3 }}
            />
            <TextField
                label="Team Number"
                type="number"
                fullWidth
                value={teamNumber}
                onChange={(e) => setTeamNumber(e.target.value)}
                sx={{ marginBottom: 3 }}
            />

            <FormControl fullWidth>
                <InputLabel>Select Questions</InputLabel>
                <Select
                    multiple
                    value={selectedQuestions}
                    onChange={(e) => setSelectedQuestions(e.target.value)}
                    renderValue={(selected) => selected.map((id) => questionsList[id]).join(", ")}
                >
                    {Object.entries(questionsList).map(([id, question]) => (
                        <MenuItem key={id} value={id}>
                            <Checkbox checked={selectedQuestions.includes(id)} />
                            <ListItemText primary={question} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 3 }}
                onClick={handleAssign}
            >
                Assign Match
            </Button>
        </Box>
    );
};

export default AdminSuperAssign;
