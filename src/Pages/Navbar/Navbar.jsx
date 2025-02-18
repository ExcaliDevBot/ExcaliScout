import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import {
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Button,
    useMediaQuery,
    useTheme,
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <div>
            <AppBar position="fixed" sx={{ backgroundColor: '#012265', boxShadow: 'none' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box
                        component={Link}
                        to="/my_matches"
                        sx={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 20px',
                        }}
                    >
                        <Box
                            component="img"
                            src="https://www.excaliburfrc.com/static/img/logo_bg_removed.png"
                            alt="Logo"
                            sx={{
                                height: 40,
                                width: 'auto',
                                objectFit: 'contain',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                }
                            }}
                        />
                    </Box>
                    {isMobile ? (
                        <>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                                sx={{ color: '#d4af37' }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor="left"
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                                sx={{
                                    '& .MuiDrawer-paper': {
                                        backgroundColor: '#012265',
                                        color: '#fff',
                                    }
                                }}
                            >
                                <List>
                                    <ListItem button component={Link} to="/my_matches">
                                        <ListItemText primary="My Matches" sx={{ color: '#fff' }} />
                                    </ListItem>
                                    {user && user.role === 'admin' && (
                                        <ListItem button onClick={handleActionsMenuOpen}>
                                            <ListItemText primary="Actions" sx={{ color: '#fff' }} />
                                        </ListItem>
                                    )}
                                </List>
                            </Drawer>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                            {/* Other content */}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <IconButton
                                    color="inherit"
                                    onClick={handleProfileMenuOpen}
                                    sx={{
                                        '&:hover': {
                                            color: '#d4af37',
                                        }
                                    }}
                                >
                                    <AccountCircleIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={profileAnchorEl}
                                    open={Boolean(profileAnchorEl)}
                                    onClose={handleMenuClose}
                                    sx={{
                                        '& .MuiMenu-paper': {
                                            backgroundColor: '#012265',
                                            color: '#fff',
                                        }
                                    }}
                                >
                                    <MenuItem onClick={() => navigate('/scan-match')}>Scan Match</MenuItem>
                                    <MenuItem onClick={() => navigate('/profile')}>View Profile</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                                {user && user.role === 'admin' && (
                                    <IconButton
                                        color="inherit"
                                        onClick={handleActionsMenuOpen}
                                        sx={{
                                            '&:hover': {
                                                color: '#d4af37',
                                            },
                                            marginLeft: 2
                                        }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                )}
                                <Menu
                                    anchorEl={actionsAnchorEl}
                                    open={Boolean(actionsAnchorEl)}
                                    onClose={handleMenuClose}
                                    sx={{
                                        '& .MuiMenu-paper': {
                                            backgroundColor: '#012265',
                                            color: '#fff',
                                        }
                                    }}
                                >
                                    <MenuItem onClick={() => navigate('/manage-users')}>Manage Users</MenuItem>
                                    <MenuItem onClick={() => navigate('/scouting-data')}>Scouter Control</MenuItem>
                                    <MenuItem onClick={() => navigate('/assign-matches')}>Assign Matches</MenuItem>
                                    <MenuItem onClick={() => navigate('/pit-assign')}>Assign Pit</MenuItem>
                                    <MenuItem onClick={() => navigate('/super-assign')}>Assign Super</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button
                                color="inherit"
                                onClick={() => navigate('/login')}
                                sx={{
                                    '&:hover': {
                                        color: '#d4af37',
                                        transition: 'color 0.3s ease',
                                    }
                                }}
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ marginTop: '60px' }}>
                {/* The rest of your content goes here */}
            </Box>
        </div>
    );
};

export default Navbar;