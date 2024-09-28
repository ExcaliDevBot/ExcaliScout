import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    const toggleActionsDropdown = () => {
        setActionsDropdownOpen(!actionsDropdownOpen);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <div className="hamburger" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className={`navbar-items ${menuOpen ? 'active' : ''}`}>
                <div className="navbar-left">
                    <button onClick={() => navigate('/')}>Home</button>
                    {user && <button onClick={() => navigate('/MyMatches')}>My Matches</button>}
                    {user && user.role === "ADMIN" && (
                        <div className="dropdown">
                            <button onClick={toggleActionsDropdown} className="dropbtn">Actions</button>
                            {actionsDropdownOpen && (
                                <div className="dropdown-content">
                                    <Link to="/manage-users">Manage Users</Link>
                                    <Link to="/assign">Assign Matches</Link>
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
                                        <Link to="/profile">View Profile</Link>
                                        <button onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                    <button onClick={() => navigate('/login')}>Login</button>)}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;