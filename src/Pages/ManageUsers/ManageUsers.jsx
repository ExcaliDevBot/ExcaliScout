import React, { useState, useEffect } from 'react';
import { ref, onValue, set, update, remove } from 'firebase/database';
import { db } from '../../firebase-config'; // Ensure this path matches your project structure
import { Box, Button, Card, CardContent, CircularProgress, Typography, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({ username: '', role: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [addSuccess, setAddSuccess] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        const usersRef = ref(db, 'users');
        setLoading(true);

        // Fetch users from Firebase using the 'users' node
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert Firebase data into a list of users
                const usersList = Object.entries(data).map(([username, user]) => ({
                    username, // username is now the key
                    ...user,
                }));
                setUsers(usersList);
            } else {
                setUsers([]);
            }
            setLoading(false);
        });
    }, []);

    const handleAddUser = async () => {
        try {
            const usersRef = ref(db, 'users');
            // Set the user with the username as the key
            await set(ref(db, `users/${newUser.username}`), newUser);
            setNewUser({ username: '', role: '', password: '' });
            setAddSuccess(true);
            setTimeout(() => setAddSuccess(false), 3000);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleEditUser = async (username) => {
        try {
            const userRef = ref(db, `users/${username}`);
            await update(userRef, editingUser); // Use username as key for editing
            setEditingUser(null);
            setEditSuccess(true);
            setTimeout(() => setEditSuccess(false), 3000);
        } catch (error) {
            console.error('Error editing user:', error);
        }
    };

    const handleDeleteUser = async (username) => {
        try {
            const userRef = ref(db, `users/${username}`);
            await remove(userRef); // Use username as key for deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: '#012265' }}>
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
                        sx={{ width: '100%', maxWidth: 400 }}
                    />

                    {/* Add User Form */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <TextField
                            label="Username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            sx={{ width: '100%', maxWidth: 400 }}
                        />
                        <FormControl sx={{ width: '100%', maxWidth: 400 }}>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="normal scouter">Normal Scouter</MenuItem>
                                <MenuItem value="pit scouter">Pit Scouter</MenuItem>
                                <MenuItem value="super scouter">Super Scouter</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            sx={{ width: '100%', maxWidth: 400 }}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#012265',
                                '&:hover': { backgroundColor: '#d4af37', color: '#012265' },
                            }}
                            onClick={handleAddUser}
                        >
                            Add User
                        </Button>
                        {addSuccess && <Typography sx={{ color: 'green', mt: 2 }}>User added successfully!</Typography>}
                    </Box>

                    {/* User Table */}
                    {filteredUsers.map((user) => (
                        <Card key={user.username} sx={{ width: '100%', maxWidth: 600, mb: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#d4af37', mb: 1 }}>
                                    {user.username}
                                </Typography>
                                <Typography variant="body1">Role: {user.role}</Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#012265',
                                            '&:hover': { backgroundColor: '#d4af37', color: '#012265' },
                                        }}
                                        onClick={() => setEditingUser(user)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteUser(user.username)} // Use username to delete
                                    >
                                        Delete
                                    </Button>
                                </Box>
                                {editingUser && editingUser.username === user.username && (
                                    <Box sx={{ mt: 2 }}>
                                        <TextField
                                            label="New Username"
                                            value={editingUser.username}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, username: e.target.value })
                                            }
                                            sx={{ mb: 2 }}
                                        />
                                        <FormControl sx={{ width: '100%', maxWidth: 400 }}>
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                value={editingUser.role}
                                                onChange={(e) =>
                                                    setEditingUser({ ...editingUser, role: e.target.value })
                                                }
                                            >
                                                <MenuItem value="Admin">Admin</MenuItem>
                                                <MenuItem value="normal_scouter">Normal Scouter</MenuItem>
                                                <MenuItem value="pit_scouter">Pit Scouter</MenuItem>
                                                <MenuItem value="super_scouter">Super Scouter</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="New Password"
                                            type="password"
                                            value={editingUser.password}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, password: e.target.value })
                                            }
                                            sx={{ mb: 2 }}
                                        />
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#012265',
                                                '&:hover': { backgroundColor: '#d4af37', color: '#012265' },
                                            }}
                                            onClick={() => handleEditUser(user.username)} // Use username to edit
                                        >
                                            Save Changes
                                        </Button>
                                        {editSuccess && <Typography sx={{ color: 'green', mt: 2 }}>User edited successfully!</Typography>}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default ManageUsers;
