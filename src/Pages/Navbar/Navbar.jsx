import React, { useContext } from 'react';
import './Navbar.css';
import { UserContext } from '../../context/UserContext';

function Navbar() {
    const { user } = useContext(UserContext);

    const handleClickScout = () => {
        window.location.href = '/Scouting';
    };

    const handleClickScoutNav = () => {
        window.location.href = '/ScoutNav';
    };

    const handleClickLogin = () => {
        window.location.href = '/Login';
    };

    const handleClickMyMatches = () => {
        window.location.href = '/MyMatches';
    };

    const handleClickActions = () => {
        window.location.href = '/Actions';
    };

    const renderUserLink = () => {
        if (!user) {
            return <a onClick={handleClickLogin}>Login</a>;
        } else if (user.role === 'ADMIN') {
            return <a onClick={handleClickActions}>Actions</a>;
        } else {
            return <a onClick={handleClickMyMatches}>My Matches</a>;
        }
    };

    return (
        <div className="navbar">
            <span>Hello, {user?.username || 'Guest'}</span>
            <div>
                <a href="/">Home</a>
                <a onClick={handleClickScoutNav}>Scout</a>
                {renderUserLink()}
                <a href="#Simbucks">Simbucks</a>
            </div>
        </div>
    );
}

export default Navbar;