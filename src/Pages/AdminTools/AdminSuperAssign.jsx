import React, { useState, useEffect, useContext } from "react";
import { db } from "../../firebase-config";
import { ref, push, onValue, remove } from "firebase/database";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Checkbox, ListItemText, TextField, CircularProgress, List, ListItem, ListItemSecondaryAction, IconButton, Paper, Alert } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
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
    const [customQuestion, setCustomQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "" });
    const { user: currentUser } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const usersRef = ref(db, "users");
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            const filteredUsers = Object.values(data || {}).filter(user => user.role === "super scouter" || user.role === "admin");
            setUsers(filteredUsers);
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
            setAlert({ message: "Please select a user, match, and questions.", type: "error" });
            return;
        }

        setLoading(true);
        const assignmentRef = ref(db, "superScoutingAssignments");
        try {
            await push(assignmentRef, {
                user: selectedUser,
                match: { match_number: matchNumber, team_number: teamNumber },
                questions: selectedQuestions,
                customQuestion: customQuestion,
                assignedBy: currentUser?.username || 'Unknown User',
            });
            setAlert({ message: "Assignment successfully added!", type: "success" });
            setSelectedUser("");
            setMatchNumber("");
            setTeamNumber("");
            setSelectedQuestions([]);
            setCustomQuestion("");
        } catch (error) {
            console.error("Error assigning match:", error);
            setAlert({ message: "Error assigning match.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await remove(ref(db, `superScoutingAssignments/${id}`));
            setAlert({ message: "Assignment successfully removed!", type: "success" });
        } catch (error) {
            console.error("Error removing assignment:", error);
            setAlert({ message: "Error removing assignment.", type: "error" });
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 600, margin: "auto", backgroundColor: theme === 'light' ? "#fff" : "#333", color: theme === 'light' ? "#000" : "#fff", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" sx={{ color: theme === 'light' ? "#012265" : "#d4af37", mb: 4 }}>
                Assign Super Scouting Matches
            </Typography>

            {alert.message && (
                <Alert severity={alert.type} onClose={() => setAlert({ message: "", type: "" })} sx={{ mb: 3 }}>
                    {alert.message}
                </Alert>
            )}

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

            <TextField
                label="Custom Question"
                fullWidth
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                sx={{ marginBottom: 3 }}
            />

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
                                secondary={`Questions: ${assignment.questions.map((id) => questionsList[id]).join(", ")}, Custom Question: ${assignment.customQuestion}`}
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