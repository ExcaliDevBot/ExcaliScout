import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
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
    Avatar,
    Typography,
    Divider,
    ListItemIcon,
} from '@mui/material';
import { 
    Menu as MenuIcon, 
    MoreVert, 
    QrCodeScanner, 
    CloudUpload, 
    Person, 
    ExitToApp,
    Dashboard,
    SupervisorAccount,
    ChangeCircle,
    Assignment,
    Engineering,
    People,
    CheckCircle
} from '@mui/icons-material';

const Navbar = () => {
    const { user, logout } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

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
            <AppBar 
                position="fixed" 
                elevation={0}
                sx={{ 
                    backgroundColor: theme === 'light' ? '#012265' : '#1a1a1a',
                    borderBottom: `1px solid ${theme === 'light' ? 'rgba(255,255,255,0.1)' : 'rgba(212,175,55,0.2)'}`,
                }}
            >
                <Toolbar sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    minHeight: { xs: 56, sm: 64 }
                }}>
                    <Box
                        component={Link}
                        to="/my_matches"
                        sx={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Box
                            component="img"
                            src="favicon.png"
                            alt="Logo"
                            sx={{
                                height: { xs: 32, sm: 40 },
                                width: 'auto',
                                objectFit: 'contain',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                }
                            }}
                        />
                        {!isMobile && (
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#d4af37',
                                    fontWeight: 'bold',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                Excalibur Scouting
                            </Typography>
                        )}
                    </Box>

                    {isMobile ? (
                        <>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                                sx={{ 
                                    color: '#d4af37',
                                    '&:hover': {
                                        backgroundColor: 'rgba(212,175,55,0.1)'
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor="left"
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                                sx={{
                                    '& .MuiDrawer-paper': {
                                        backgroundColor: theme === 'light' ? '#012265' : '#1a1a1a',
                                        color: '#fff',
                                        width: 280,
                                    }
                                }}
                            >
                                <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {user && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: '#d4af37', width: 40, height: 40 }}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                    {user.username}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#d4af37' }}>
                                                    {user.role}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                                <List sx={{ pt: 1 }}>
                                    <ListItem button component={Link} to="/my_matches" onClick={toggleDrawer(false)}>
                                        <ListItemIcon><Dashboard sx={{ color: '#d4af37' }} /></ListItemIcon>
                                        <ListItemText primary="My Matches" sx={{ color: '#fff' }} />
                                    </ListItem>
                                    <ListItem button component={Link} to="/scan-match" onClick={toggleDrawer(false)}>
                                        <ListItemIcon><QrCodeScanner sx={{ color: '#d4af37' }} /></ListItemIcon>
                                        <ListItemText primary="Scan Match" sx={{ color: '#fff' }} />
                                    </ListItem>
                                    <ListItem button component={Link} to="/offline_submissions" onClick={toggleDrawer(false)}>
                                        <ListItemIcon><CloudUpload sx={{ color: '#d4af37' }} /></ListItemIcon>
                                        <ListItemText primary="Offline Matches" sx={{ color: '#fff' }} />
                                    </ListItem>
                                    <ListItem button component={Link} to="/profile" onClick={toggleDrawer(false)}>
                                        <ListItemIcon><Person sx={{ color: '#d4af37' }} /></ListItemIcon>
                                        <ListItemText primary="Profile" sx={{ color: '#fff' }} />
                                    </ListItem>
                                    
                                    {(user && (user.role === 'admin' || user.role === 'strategy')) && (
                                        <>
                                            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                                            <ListItem>
                                                <ListItemText 
                                                    primary="Admin Tools" 
                                                    sx={{ color: '#d4af37', fontWeight: 'bold' }} 
                                                />
                                            </ListItem>
                                            <ListItem button component={Link} to="/scouting-data" onClick={toggleDrawer(false)}>
                                                <ListItemIcon><Dashboard sx={{ color: '#d4af37' }} /></ListItemIcon>
                                                <ListItemText primary="Scouter Control" sx={{ color: '#fff' }} />
                                            </ListItem>
                                            <ListItem button component={Link} to="/super-assign" onClick={toggleDrawer(false)}>
                                                <ListItemIcon><SupervisorAccount sx={{ color: '#d4af37' }} /></ListItemIcon>
                                                <ListItemText primary="Assign Super" sx={{ color: '#fff' }} />
                                            </ListItem>
                                            <ListItem button component={Link} to="/change-data-request" onClick={toggleDrawer(false)}>
                                                <ListItemIcon><ChangeCircle sx={{ color: '#d4af37' }} /></ListItemIcon>
                                                <ListItemText primary="Request Data Change" sx={{ color: '#fff' }} />
                                            </ListItem>
                                            {user.role === 'admin' && (
                                                <>
                                                    <ListItem button component={Link} to="/assign-matches" onClick={toggleDrawer(false)}>
                                                        <ListItemIcon><Assignment sx={{ color: '#d4af37' }} /></ListItemIcon>
                                                        <ListItemText primary="Assign Matches" sx={{ color: '#fff' }} />
                                                    </ListItem>
                                                    <ListItem button component={Link} to="/pit-assign" onClick={toggleDrawer(false)}>
                                                        <ListItemIcon><Engineering sx={{ color: '#d4af37' }} /></ListItemIcon>
                                                        <ListItemText primary="Assign Pit" sx={{ color: '#fff' }} />
                                                    </ListItem>
                                                    <ListItem button component={Link} to="/manage-users" onClick={toggleDrawer(false)}>
                                                        <ListItemIcon><People sx={{ color: '#d4af37' }} /></ListItemIcon>
                                                        <ListItemText primary="Manage Users" sx={{ color: '#fff' }} />
                                                    </ListItem>
                                                    <ListItem button component={Link} to="/approve-change-requests" onClick={toggleDrawer(false)}>
                                                        <ListItemIcon><CheckCircle sx={{ color: '#d4af37' }} /></ListItemIcon>
                                                        <ListItemText primary="Approve Changes" sx={{ color: '#fff' }} />
                                                    </ListItem>
                                                </>
                                            )}
                                        </>
                                    )}
                                    
                                    <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                                    <ListItem button onClick={() => { handleLogout(); toggleDrawer(false)(); }}>
                                        <ListItemIcon><ExitToApp sx={{ color: '#f44336' }} /></ListItemIcon>
                                        <ListItemText primary="Logout" sx={{ color: '#f44336' }} />
                                        </ListItem>
                                </List>
                            </Drawer>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {user && (
                                <Typography variant="body2" sx={{ color: '#d4af37' }}>
                                    Welcome, {user.username}
                                </Typography>
                            )}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user ? (
                            <>
                                {!isMobile && (
                                    <IconButton
                                        color="inherit"
                                        onClick={handleProfileMenuOpen}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(212,175,55,0.1)',
                                            }
                                        }}
                                    >
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#d4af37' }}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                )}
                                <Menu
                                    anchorEl={profileAnchorEl}
                                    open={Boolean(profileAnchorEl)}
                                    onClose={handleMenuClose}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    sx={{
                                        '& .MuiMenu-paper': {
                                            backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e',
                                            color: '#fff',
                                            minWidth: 200,
                                            borderRadius: 2,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                >
                                    <MenuItem 
                                        onClick={() => { navigate('/scan-match'); handleMenuClose(); }}
                                        sx={{ color: theme === 'light' ? '#000' : '#fff' }}
                                    >
                                        <ListItemIcon><QrCodeScanner fontSize="small" /></ListItemIcon>
                                        Scan Match
                                    </MenuItem>
                                    <MenuItem 
                                        onClick={() => { navigate('/offline_submissions'); handleMenuClose(); }}
                                        sx={{ color: theme === 'light' ? '#000' : '#fff' }}
                                    >
                                        <ListItemIcon><CloudUpload fontSize="small" /></ListItemIcon>
                                        Offline Matches
                                    </MenuItem>
                                    <MenuItem 
                                        onClick={() => { navigate('/profile'); handleMenuClose(); }}
                                        sx={{ color: theme === 'light' ? '#000' : '#fff' }}
                                    >
                                        <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                                        View Profile
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem 
                                        onClick={() => { handleLogout(); handleMenuClose(); }}
                                        sx={{ color: '#f44336' }}
                                    >
                                        <ListItemIcon><ExitToApp fontSize="small" sx={{ color: '#f44336' }} /></ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                                {!isMobile && (user && (user.role === 'admin' || user.role === 'strategy')) && (
                                    <IconButton
                                        color="inherit"
                                        onClick={handleActionsMenuOpen}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(212,175,55,0.1)',
                                            },
                                            ml: 1
                                        }}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                )}
                                <Menu
                                    anchorEl={actionsAnchorEl}
                                    open={Boolean(actionsAnchorEl)}
                                    onClose={handleMenuClose}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    sx={{
                                        '& .MuiMenu-paper': {
                                            backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e',
                                            color: '#fff',
                                            minWidth: 220,
                                            borderRadius: 2,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                >
                                    <MenuItem 
                                        onClick={() => { navigate('/scouting-data'); handleMenuClose(); }}
                                        sx={{ color: theme === 'light' ? '#000' : '#fff' }}
                                    >
                                        <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                                        Scouter Control
                                    </MenuItem>
                                    <MenuItem 
                                        onClick={() => { navigate('/super-assign'); handleMenuClose(); }}
                                        sx={{ color: theme === 'light' ? '#000' : '#fff' }}
                                    >
                                        <ListItemIcon><SupervisorAccount fontSize="small" /></ListItemIcon>
                                        Assign Super
                                    </MenuItem>
                                    <MenuItem 
                                        onClick={() => { navigate('/change-data-request'); handleMenuClose(); }}
                                        sx={{ color: theme === 'light' ? '#000' : '#fff' }}
                                    >
                                        <ListItemIcon><ChangeCircle fontSize="small" /></ListItemIcon>
                                        Request Data Change
                                    </MenuItem>
                                    {user.role === 'admin' && (
                                        <>
                                            <Divider />
                                            <MenuItem 
                                                onClick={() => { navigate('/assign-matches'); handleMenuClose(); }}
                                                sx={{ color: theme === 'light' ? '#000' : '#fff' }}
                                            >
                                                <ListItemIcon><Assignment fontSize="small" /></ListItemIcon>
                                                Assign Matches
                                            </MenuItem>
                                            <MenuItem 
                                                onClick={() => { navigate('/pit-assign'); handleMenuClose(); }}
                                                sx={{ color: theme === 'light' ? '#000' : '#fff' }}
                                            >
                                                <ListItemIcon><Engineering fontSize="small" /></ListItemIcon>
                                                Assign Pit
                                            </MenuItem>
                                            <MenuItem 
                                                onClick={() => { navigate('/manage-users'); handleMenuClose(); }}
                                                sx={{ color: theme === 'light' ? '#000' : '#fff' }}
                                            >
                                                <ListItemIcon><People fontSize="small" /></ListItemIcon>
                                                Manage Users
                                            </MenuItem>
                                            <MenuItem 
                                                onClick={() => { navigate('/approve-change-requests'); handleMenuClose(); }}
                                                sx={{ color: theme === 'light' ? '#000' : '#fff' }}
                                            >
                                                <ListItemIcon><CheckCircle fontSize="small" /></ListItemIcon>
                                                Approve Changes
                                            </MenuItem>
                                        </>
                                    )}
                                </Menu>
                            </>
                        ) : (
                            <Button
                                color="inherit"
                                onClick={() => navigate('/login')}
                                sx={{
                                    color: '#d4af37',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: 'rgba(212,175,55,0.1)',
                                    }
                                }}
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ marginTop: { xs: '56px', sm: '64px' } }}>
                {/* The rest of your content goes here */}
            </Box>
        </div>
    );
};

export default Navbar;