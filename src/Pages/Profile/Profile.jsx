import React from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import Navbar from "../Navbar/Navbar";

function Profile() {
    const user = useCurrentUser();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
         <div>
            <Navbar/>
        <div>
            <h1>Welcome, {user.username}</h1>
            <p>Role: {user.role}</p>
            <p>User ID: {user.user_id}</p>
        </div>
             </div>
    );
}

export default Profile;
