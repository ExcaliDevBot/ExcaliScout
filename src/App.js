import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {UserProvider} from './context/UserContext';
import {SpeedInsights} from '@vercel/speed-insights/react';
import {Analytics} from "@vercel/analytics/react"
import Navbar from './Pages/Navbar/Navbar';

// Pages
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import MyMatches from './Pages/MyMatches/MyMatches';
import ScoutingForm from './Pages/Scouting/Scouting';
import MatchAssign from './Pages/AdminTools/MatchAssign';
import Profile from './Pages/Profile/Profile';
import ManageUsers from './Pages/AdminTools/ManageUsers';
import SuperScouting from './Pages/Scouting/Super/SuperScouting';
import AdminSuperAssign from './Pages/AdminTools/AdminSuperAssign';
import PitScouting from './Pages/Scouting/Pit/PitScouting';
import PitScoutingAssign from './Pages/AdminTools/PitScoutingAssign';
import QRCodeScanner from './Pages/Scanner/QRCodeScanner';
import ChangeDataRequest from './Pages/AdminTools/ChangeDataRequest';
import ApproveChangeRequests from './Pages/AdminTools/ApproveChangeRequests';

// Routes and Access Control
import AdminRoute from './Routes/AdminRoute';
import ProtectedRoute from './Routes/ProtectedRoute';
import ScoutingDataPage from './Pages/AdminTools/Control';
import React from "react";
import {ThemeProvider} from './context/ThemeContext';
import {LanguageProvider} from "./context/LanguageContext";
import OfflineSubmissions from "./Pages/MyMatches/OfflineSubmissions";

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <UserProvider>
                    <Router>
                        <Navbar/>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/" element={<Home/>}/>

                            {/* Protected Routes */}
                            <Route path={"/scan-match"} element={<ProtectedRoute><QRCodeScanner/></ProtectedRoute>}/>
                            <Route path="/pit-scout" element={<ProtectedRoute><PitScouting/></ProtectedRoute>}/>
                            <Route path="/super-scout" element={<ProtectedRoute><SuperScouting/></ProtectedRoute>}/>
                            <Route path="/my_matches" element={<ProtectedRoute><MyMatches/></ProtectedRoute>}/>
                            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                            <Route path="/scout/:match_id" element={<ProtectedRoute><ScoutingForm/></ProtectedRoute>}/>
                            <Route path="/scout" element={<ProtectedRoute><ScoutingForm/></ProtectedRoute>}/>
                            <Route path="/approve-change-requests"
                                   element={<ProtectedRoute><ApproveChangeRequests/></ProtectedRoute>}/>
                            {/* Admin Routes */}
                            <Route path="/change-data-request" element={<AdminRoute><ChangeDataRequest/></AdminRoute>}/>
                            <Route path="/offline_submissions" element={<OfflineSubmissions />} />
                            <Route path="/pit-assign" element={<AdminRoute><PitScoutingAssign/></AdminRoute>}/>
                            <Route path="/assign-matches" element={<AdminRoute><MatchAssign/></AdminRoute>}/>
                            <Route path="/super-assign" element={<AdminRoute><AdminSuperAssign/></AdminRoute>}/>
                            <Route path="/manage-users" element={<AdminRoute><ManageUsers/></AdminRoute>}/>
                            <Route path="/scouting-data" element={<AdminRoute><ScoutingDataPage/></AdminRoute>}/>
                            {/* Catch-all Route */}
                            <Route path="/no-access" element={<div>No Access</div>}/>
                        </Routes>
                    </Router>
                    <SpeedInsights/>
                    <Analytics/>
                </UserProvider>
            </LanguageProvider>
        </ThemeProvider>

    );
}

export default App;
