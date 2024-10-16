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
import PitScouting from "./Pages/Scouting/Pit/PitScouting";
import ScoutNav from "./Pages/Nav/ScoutNav";
import Actions from "./Pages/Actions/Actions";
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Pages/Navbar/Navbar';
import Home from "./Pages/Home/Home";

function App() {
    return (
        <UserProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/ScoutNav" element={<ProtectedRoute><ScoutNav /></ProtectedRoute>} />
                    <Route path="/Pit-Scouting" element={<ProtectedRoute><PitScouting /></ProtectedRoute>} />
                    <Route path="/super-scout" element={<ProtectedRoute><SuperScouting /></ProtectedRoute>} />
                    <Route path="/assign" element={<AdminRoute><MatchAssign /></AdminRoute>} />
                    <Route path="/MyMatches" element={<ProtectedRoute><MyMatches /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/Actions" element={<ProtectedRoute><Actions /></ProtectedRoute>} />
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
