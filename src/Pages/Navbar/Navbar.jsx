import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import {
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Navbar = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleProfileMenuOpen = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleActionsMenuOpen = (event) => {
        setActionsAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setProfileAnchorEl(null);
        setActionsAnchorEl(null);
    };

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#012265' }}>
            <Toolbar>
                {/* Hamburger Menu for small screens */}
                <IconButton
                    edge="start"
                    color="#012265"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Drawer for mobile navigation */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                >
                    <List>
                        <ListItem button onClick={() => navigate('/')}>Home</ListItem>
                        {user && (
                            <ListItem button onClick={() => navigate('/my_matches')}>
                                My Matches
                            </ListItem>
                        )}
                        {user && user.role === 'ADMIN' && (
                            <ListItem button onClick={handleActionsMenuOpen}>
                                Actions
                            </ListItem>
                        )}
                    </List>
                </Drawer>

                {/* Logo linking to home */}
                <Box
                    component={Link}
                    to="/"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        flexGrow: 1,
                        textDecoration: 'none',
                    }}
                >
                    <Box
                        component="img"
                        src="https://www.excaliburfrc.com/static/img/logo_bg_removed.png"
                        alt="Logo"
                        sx={{
                            height: 40, // Adjust height as needed
                            width: 'auto',
                        }}
                    />
                </Box>

                <Button color="#012265" onClick={() => navigate('/')}>Home</Button>
                {user && (
                    <Button color="#012265" onClick={() => navigate('/my_matches')}>
                        My Matches
                    </Button>
                )}
                {user && user.role === 'admin' && (
                    <Button
                        color="inherit"
                        onClick={handleActionsMenuOpen}
                        endIcon={<MoreVertIcon />}
                    >
                        Actions
                    </Button>
                )}

                {/* Actions Dropdown */}
                <Menu
                    anchorEl={actionsAnchorEl}
                    open={Boolean(actionsAnchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => navigate('/manage-users')}>Manage Users</MenuItem>
                    <MenuItem onClick={() => navigate('/assign-matches')}>Assign Matches</MenuItem>
                    <MenuItem onClick={() => navigate('/pit-assign')}>Assign Pit Scouting</MenuItem>
                    <MenuItem onClick={() => navigate('/super-assign')}>Assign Super Matches</MenuItem>
                </Menu>

                {/* Profile Dropdown */}
                {user ? (
                    <>
                        <IconButton
                            color="inherit"
                            onClick={handleProfileMenuOpen}
                        >
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            anchorEl={profileAnchorEl}
                            open={Boolean(profileAnchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => navigate('/profile')}>View Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button color="inherit" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
