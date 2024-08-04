import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import MyMatches from './Pages/MyMatches/MyMatches';
import ScoutingForm from './Pages/Scouting/Scouting';
import MatchAssign from './Pages/MatchAssign/MatchAssign';
import Profile from './Pages/Profile/Profile';
import ManageUsers from './Pages/ManageUsers/ManageUsers';
import { UserProvider } from './context/UserContext';
import SuperScouting from "./Pages/Scouting/Super/SuperScouting";
import PitScouting from "./Pages/Scouting/Pit/PitScouting";
import ScoutNav from "./Pages/Nav/ScoutNav"
import Actions from "./Pages/Actions/Actions";
function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/ScoutNav" element={<ScoutNav />} />
                    <Route path="/Pit-Scouting" element={<PitScouting />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/Super-scouting" element={<SuperScouting />} />
                    <Route path="/assign" element={<MatchAssign />} />
                    <Route path="/MyMatches" element={<MyMatches />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/Actions" element={<Actions />} />
                    <Route path="/scout/:match_id" element={<ScoutingForm />} />
                    <Route path="/scout" element={<ScoutingForm />} />
                    <Route path="/manage-users" element={<ManageUsers />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
