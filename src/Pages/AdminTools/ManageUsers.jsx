import React, { useState, useEffect, useContext } from 'react';
import { ref, onValue, set, update, remove } from 'firebase/database';
import { db } from '../../firebase-config';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Container
} from '@mui/material';
import { ThemeContext } from '../../context/ThemeContext'; // Adjust the import path as needed

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({ username: '', role: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const usersRef = ref(db, 'users');
        setLoading(true);

        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(data ? Object.entries(data).map(([username, user]) => ({ username, ...user })) : []);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const showFeedback = (message) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(''), 3000);
    };

    const handleAddUser = async () => {
        if (!newUser.username || !newUser.role || !newUser.password) {
            alert('Please fill in all fields before adding a user.');
            return;
        }
        try {
            await set(ref(db, `users/${newUser.username}`), newUser);
            setNewUser({ username: '', role: '', password: '' });
            showFeedback('User added successfully!');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleEditUser = async (username) => {
        if (!editingUser.role || !editingUser.password) {
            alert('Please fill in all fields before saving changes.');
            return;
        }
        try {
            const userRef = ref(db, `users/${username}`);
            const updatedUser = { role: editingUser.role, password: editingUser.password };
            await update(userRef, updatedUser);
            setEditingUser(null);
            showFeedback('User edited successfully!');
        } catch (error) {
            console.error('Error editing user:', error);
        }
    };

    const handleDeleteUser = async (username) => {
        try {
            const userRef = ref(db, `users/${username}`);
            await remove(userRef);
            showFeedback('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container sx={{ p: 4, backgroundColor: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: theme === 'light' ? '#012265' : '#d4af37' }}>
                Manage Users
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {/* Search Bar */}
                    <TextField
                        variant="outlined"
                        placeholder="Search by username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: '100%', maxWidth: 400, backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}
                    />

                    {/* Add User Form */}
                    <Card sx={{ width: '100%', maxWidth: 600, p: 2, mt: 2, backgroundColor: theme === 'light' ? '#f5f5f5' : '#555' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, color: theme === 'light' ? '#012265' : '#d4af37' }}>
                                Add New User
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Username"
                                        value={newUser.username}
                                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                        fullWidth
                                        sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value.toLowerCase() })}
                                            sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}
                                        >
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="normal scouter">Normal Scouter</MenuItem>
                                            <MenuItem value="pit scouter">Pit Scouter</MenuItem>
                                            <MenuItem value="super scouter">Super Scouter</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Password"
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        fullWidth
                                        sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                                            '&:hover': { backgroundColor: theme === 'light' ? '#d4af37' : '#012265', color: theme === 'light' ? '#012265' : '#d4af37' },
                                        }}
                                        onClick={handleAddUser}
                                    >
                                        Add User
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {feedbackMessage && (
                        <Typography sx={{ color: 'green', mt: 2 }}>{feedbackMessage}</Typography>
                    )}

                    {/* User List */}
                    {filteredUsers.map((user) => (
                        <Card key={user.username} sx={{ width: '100%', maxWidth: 600, mb: 2, boxShadow: 3, backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ color: theme === 'light' ? '#d4af37' : '#ffeb3b', mb: 1 }}>
                                    {user.username}
                                </Typography>
                                <Typography variant="body1">Role: {user.role}</Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                                            '&:hover': { backgroundColor: theme === 'light' ? '#d4af37' : '#012265', color: theme === 'light' ? '#012265' : '#d4af37' },
                                        }}
                                        onClick={() => setEditingUser({ ...user, password: '' })}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteUser(user.username)}
                                    >
                                        Delete
                                    </Button>
                                </Box>

                                {editingUser && editingUser.username === user.username && (
                                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField
                                            label="Username"
                                            value={editingUser.username}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            fullWidth
                                            sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}
                                        />
                                        <FormControl fullWidth sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}>
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                value={editingUser.role}
                                                onChange={(e) =>
                                                    setEditingUser({ ...editingUser, role: e.target.value.toLowerCase() })
                                                }
                                                sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}
                                            >
                                                <MenuItem value="admin">Admin</MenuItem>
                                                <MenuItem value="normal scouter">Normal Scouter</MenuItem>
                                                <MenuItem value="super scouter">Super Scouter</MenuItem>
                                                <MenuItem value="pit">Pit</MenuItem>
                                                <MenuItem value="photographer">Photographer</MenuItem>
                                                <MenuItem value="strategy">Strategy</MenuItem>
                                                <MenuItem value="spectator">Spectator</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="New Password"
                                            type="password"
                                            value={editingUser.password}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, password: e.target.value })
                                            }
                                            fullWidth
                                            sx={{ backgroundColor: theme === 'light' ? '#fff' : '#444', color: theme === 'light' ? '#000' : '#fff' }}
                                        />
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: theme === 'light' ? '#012265' : '#d4af37',
                                                '&:hover': { backgroundColor: theme === 'light' ? '#d4af37' : '#012265', color: theme === 'light' ? '#012265' : '#d4af37' },
                                            }}
                                            onClick={() => handleEditUser(user.username)}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Container>
    );
}

export default ManageUsers;