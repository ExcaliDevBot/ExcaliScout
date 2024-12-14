import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Typography, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({ username: '', role: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [addSuccess, setAddSuccess] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletedUserId, setDeletedUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://ScoutingSystem.pythonanywhere.com/users');
                const data = await response.json();
                if (data.status === 'success') {
                    setUsers(data.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        try {
            const response = await fetch('https://ScoutingSystem.pythonanywhere.com/add_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            const data = await response.json();
            if (data.status === 'success') {
                setUsers([...users, { ...newUser, user_id: data.user_id }]);
                setNewUser({ username: '', role: '', password: '' });
                setAddSuccess(true);
                setTimeout(() => setAddSuccess(false), 3000); // Show success message for 3 seconds
            } else {
                alert('Failed to add user');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add user');
        }
    };

    const handleEditUser = async (userId) => {
        try {
            const response = await fetch('https://ScoutingSystem.pythonanywhere.com/update_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...editingUser, user_id: userId }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                setUsers(users.map(user => (user.user_id === userId ? editingUser : user)));
                setEditingUser(null);
                setEditSuccess(true);
                setTimeout(() => setEditSuccess(false), 3000); // Show success message for 3 seconds
            } else {
                alert('Failed to edit user');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to edit user');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch('https://ScoutingSystem.pythonanywhere.com/delete_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                setDeletedUserId(userId);
                setTimeout(() => {
                    setUsers(users.filter(user => user.user_id !== userId));
                    setDeletedUserId(null);
                }, 500); // Delay to allow the fade-out effect
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));

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
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="normal_scouter">Normal Scouter</MenuItem>
                                <MenuItem value="pit_scouter">Pit Scouter</MenuItem>
                                <MenuItem value="super_scouter">Super Scouter</MenuItem>
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
                        <Card key={user.user_id} sx={{ width: '100%', maxWidth: 600, mb: 2, boxShadow: 3 }}>
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
                                        onClick={() => handleDeleteUser(user.user_id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                                {editingUser && editingUser.user_id === user.user_id && (
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
                                                <MenuItem value="ADMIN">Admin</MenuItem>
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
                                            onClick={() => handleEditUser(user.user_id)}
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
