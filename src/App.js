import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './Pages/Navbar/Navbar';

// Pages
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import MyMatches from './Pages/MyMatches/MyMatches';
import ScoutingForm from './Pages/Scouting/Scouting';
import MatchAssign from './Pages/MatchAssign/MatchAssign';
import Profile from './Pages/Profile/Profile';
import ManageUsers from './Pages/ManageUsers/ManageUsers';
import SuperScouting from './Pages/Scouting/Super/SuperScouting';
import AdminSuperAssign from './Pages/AdminTools/AdminSuperAssign';
import PitScouting from './Pages/Scouting/Pit/PitScouting';
import PitScoutingAssign from './Pages/AdminTools/PitScoutingAssign';

// Routes and Access Control
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';

function App() {
    return (
        <UserProvider>
            <Router>
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />

                    {/* Protected Routes */}
                    <Route path="/pit-scout" element={<ProtectedRoute><PitScouting /></ProtectedRoute>} />
                    <Route path="/super-scout" element={<ProtectedRoute><SuperScouting /></ProtectedRoute>} />
                    <Route path="/my_matches" element={<ProtectedRoute><MyMatches /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/scout/:match_id" element={<ProtectedRoute><ScoutingForm /></ProtectedRoute>} />
                    <Route path="/scout" element={<ProtectedRoute><ScoutingForm /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/pit-assign" element={<AdminRoute><PitScoutingAssign /></AdminRoute>} />
                    <Route path="/assign-matches" element={<AdminRoute><MatchAssign /></AdminRoute>} />
                    <Route path="/super-assign" element={<AdminRoute><AdminSuperAssign /></AdminRoute>} />
                    <Route path="/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />

                    {/* Catch-all Route */}
                    <Route path="/no-access" element={<div>No Access</div>} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
