import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import './ManageUsers.css';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'Normal Scouter' });
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch('http://localhost:5000/users');
        const data = await response.json();
        if (data.status === 'success') {
            setUsers(data.users);
        }
    };

    const handleAddUser = async () => {
        const response = await fetch('http://localhost:5000/add_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        const data = await response.json();
        if (data.status === 'success') {
            fetchUsers();
            setNewUser({ username: '', password: '', role: 'Normal Scouter' });
        }
    };

    const handleDeleteUser = async (user_id) => {
        const response = await fetch('http://localhost:5000/delete_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id })
        });
        const data = await response.json();
        if (data.status === 'success') {
            fetchUsers();
        }
    };

    const handleUpdateUser = async (user_id, role) => {
        const response = await fetch('http://localhost:5000/update_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, role })
        });
        const data = await response.json();
        if (data.status === 'success') {
            fetchUsers();
        }
    };

    return (
        <div className="container">
            <h2>Manage Users</h2>
            <div className="form-container">
                <h3>Add New User</h3>
                <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="Normal Scouter">Normal Scouter</option>
                    <option value="Super Scouter">Super Scouter</option>
                    <option value="Pit Scouter">Pit Scouter</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                <button onClick={handleAddUser}>Add User</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.username}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleUpdateUser(user.user_id, e.target.value)}
                                >
                                    <option value="Normal Scouter">Normal Scouter</option>
                                    <option value="Super Scouter">Super Scouter</option>
                                    <option value="Pit Scouter">Pit Scouter</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageUsers;