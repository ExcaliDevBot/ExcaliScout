// src/Pages/Navbar/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Navbar.css';

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    const toggleActionsDropdown = () => {
        setActionsDropdownOpen(!actionsDropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button onClick={() => navigate('/')}>Home</button>
                {user && <button onClick={() => navigate('/scout')}>Scout</button>}
                {user && user.role === "ADMIN" && (
                    <div className="dropdown">
                        <button onClick={toggleActionsDropdown} className="dropbtn">Actions</button>
                        {actionsDropdownOpen && (
                            <div className="dropdown-content">
                                <Link to="/manage-users"> Manage Users</Link>
                                <Link to="/assign">Assign Matches</Link>
                                {/* Add more admin actions here */}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="navbar-right">
                {user ? (
                    <>
                        <div className="dropdown">
                            <button onClick={toggleProfileDropdown} className="dropbtn">Profile</button>
                            {profileDropdownOpen && (
                                <div className="dropdown-content">
                                    <Link to="/profile"> View Profile</Link>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;