// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import MyMatches from './Pages/MyMatches/MyMatches';
import ScoutingForm from './Pages/Scouting/Scouting';
import MatchAssign from './Pages/MatchAssign/MatchAssign';
import Profile from './Pages/Profile/Profile';
import ManageUsers from './Pages/ManageUsers/ManageUsers';
import { UserProvider } from './context/UserContext'; // Make sure this is correctly imported
import SuperScouting from "./Pages/Scouting/Super/SuperScouting";
import AdminSuperAssign from "./Pages/AdminSuperAssign/AdminSuperAssign";
import PitScouting from "./Pages/Scouting/Pit/PitScouting";
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Pages/Navbar/Navbar';
import Home from "./Pages/Home/Home";
import ScouterPerformance from "./Pages/ScouterPerformance/ScouterPerformance";
import PitScoutingAssign from "./Pages/AdminTools/PitScoutingAssign";
// src/App.js

// Add the new route

function App() {
    return (
        <UserProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/PitScoutingAssign" element={<AdminRoute><PitScoutingAssign /></AdminRoute>} />
                    <Route path="/Pit-Scouting" element={<ProtectedRoute><PitScouting /></ProtectedRoute>} />
                    <Route path="/super-scout" element={<ProtectedRoute><SuperScouting /></ProtectedRoute>} />
                    <Route path="/ScouterPerformance" element={<ProtectedRoute><ScouterPerformance /></ProtectedRoute>} />
                    <Route path="/assign" element={<AdminRoute><MatchAssign /></AdminRoute>} />
                    <Route path="/super-assign" element={<AdminRoute><AdminSuperAssign /></AdminRoute>} />
                    <Route path="/MyMatches" element={<ProtectedRoute><MyMatches /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/scout/:match_id" element={<ProtectedRoute><ScoutingForm /></ProtectedRoute>} />
                    <Route path="/scout" element={<ProtectedRoute><ScoutingForm /></ProtectedRoute>} />
                    <Route path="/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
                    <Route path="/no-access" element={<div>No Access</div>} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
