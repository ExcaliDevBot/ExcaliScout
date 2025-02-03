import React, { useState, useEffect, useContext } from "react";
import { db } from "../../firebase-config";
import { ref, push, onValue, remove } from "firebase/database";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Checkbox, ListItemText, TextField, CircularProgress, List, ListItem, ListItemSecondaryAction, IconButton, Paper } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../ThemeContext";
import DeleteIcon from '@mui/icons-material/Delete';

const questionsList = {
    0: "מהם האתגרים העיקריים שהרובוט נתקל בהם במהלך סייקל",
    1: "כיצד הרובוט מתמודד עם מצבי הגנה מצד רובוטים יריבים",
    2: "תאר שיתוף פעולה בין הרובוטים בברית",
    3: "אילו חלקים ברובוט נוטים לתקלות או בעיות תפעוליות",
    4: "אילו משימות הרובוט ביצע במהלך שלב האוטונומי",
    5: "מה תפקיד הרובוט בברית",
};

const AdminSuperAssign = () => {
    const [users, setUsers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [matchNumber, setMatchNumber] = useState("");
    const [teamNumber, setTeamNumber] = useState("");
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user: currentUser } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const usersRef = ref(db, "users");
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(Object.values(data || {}));
        });

        const matchesRef = ref(db, "matches");
        onValue(matchesRef, (snapshot) => {
            const data = snapshot.val();
            setMatches(Object.values(data || {}));
        });

        const assignmentsRef = ref(db, "superScoutingAssignments");
        onValue(assignmentsRef, (snapshot) => {
            const data = snapshot.val();
            setAssignments(Object.entries(data || {}).map(([id, value]) => ({ id, ...value })));
        });
    }, []);

    const handleAssign = async () => {
        if (!selectedUser || !matchNumber || !teamNumber || selectedQuestions.length === 0) {
            alert("Please select a user, match, and questions.");
            return;
        }

        setLoading(true);
        const assignmentRef = ref(db, "superScoutingAssignments");
        try {
            await push(assignmentRef, {
                user: selectedUser,
                match: { match_number: matchNumber, team_number: teamNumber },
                questions: selectedQuestions,
                assignedBy: currentUser?.username || 'Unknown User',
            });
            alert("Assignment successfully added!");
            setSelectedUser("");
            setMatchNumber("");
            setTeamNumber("");
            setSelectedQuestions([]);
        } catch (error) {
            console.error("Error assigning match:", error);
            alert("Error assigning match.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await remove(ref(db, `superScoutingAssignments/${id}`));
            alert("Assignment successfully removed!");
        } catch (error) {
            console.error("Error removing assignment:", error);
            alert("Error removing assignment.");
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 600, margin: "auto", backgroundColor: theme === 'light' ? "#fff" : "#333", color: theme === 'light' ? "#000" : "#fff", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" sx={{ color: theme === 'light' ? "#012265" : "#d4af37", mb: 4 }}>
                Assign Super Scouting Matches
            </Typography>

            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                <InputLabel>Select Super Scouter</InputLabel>
                <Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    label="Select Super Scouter"
                >
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.username}>
                            {user.username}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

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

            <FormControl fullWidth sx={{ marginBottom: 3 }}>
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

            <Box sx={{ textAlign: "center" }}>
                <Button
                    variant="contained"
                    sx={{
                        mt: 2,
                        backgroundColor: theme === 'light' ? "#012265" : "#d4af37",
                        '&:hover': { backgroundColor: theme === 'light' ? "#d4af37" : "#012265", color: theme === 'light' ? "#012265" : "#d4af37" },
                        paddingX: 4,
                        paddingY: 2,
                        fontSize: 16,
                    }}
                    onClick={handleAssign}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Assign Match"}
                </Button>
            </Box>

            <Typography variant="h5" align="center" sx={{ color: theme === 'light' ? "#012265" : "#d4af37", mt: 4 }}>
                Current Assignments
            </Typography>
            <Paper sx={{ padding: 2, backgroundColor: theme === 'light' ? "#f0f0f0" : "#444", color: theme === 'light' ? "#000" : "#fff" }}>
                <List>
                    {assignments.map((assignment) => (
                        <ListItem key={assignment.id}>
                            <ListItemText
                                primary={`User: ${assignment.user}, Match: ${assignment.match.match_number}, Team: ${assignment.match.team_number}`}
                                secondary={`Questions: ${assignment.questions.map((id) => questionsList[id]).join(", ")}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(assignment.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default AdminSuperAssign;