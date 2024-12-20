import React from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import './Profile.css';

function Profile() {
    const user = useCurrentUser();

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <h1>Welcome, {user.username}</h1>
                    <p className="role-tag">{user.role}</p>
                </div>
                <div className="profile-info">
                    <p><strong>User ID:</strong> {user.user_id}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
