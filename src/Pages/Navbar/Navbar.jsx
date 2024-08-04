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

    return (
        <div className="navbar">
            <span>{user?.username || 'Guest'}</span>
            <a href="/">Home</a>
            <a onClick={handleClickScoutNav}>Scout</a>
            <a onClick={handleClickLogin}>Login</a>
            <a href="#Simbucks">Simbucks</a>
        </div>
    );
}

export default Navbar;