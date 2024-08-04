// src/Pages/Profile/Profile.jsx
import React from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import './Profile.css';

function Profile() {
    const user = useCurrentUser();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="profile-container">
                <h1>Welcome, {user.username}</h1>
                <p>Role: {user.role}</p>
                <p>User ID: {user.user_id}</p>
            </div>
        </div>
    );
}

export default Profile;