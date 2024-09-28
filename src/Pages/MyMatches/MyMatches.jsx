import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './MyMatches.css';

function MyMatches() {
    const [matches, setMatches] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchMatches = async () => {
                const response = await fetch(`https://ScoutingSystem.pythonanywhere.com/matches_assignments?user_id=${user.user_id}`);
                const data = await response.json();
                if (data.status === 'success') {
                    setMatches(data.matches);
                }
            };

            fetchMatches();
        }
    }, [user]);

    return (
        <div className="container">
            <h1>My Matches</h1>
            <div className="matches-container">
                {matches.map(match => (
                    <div key={match.match_number} className="match-card">
                        <h2>Match {match.match_number}</h2>
                        <p>Team: {match.team_number}</p>
                        <p className={match.alliance === 'Red' ? 'red-text' : 'blue-text'}>
                            Alliance: {match.alliance}
                        </p>
                        <button onClick={() => navigate(`/scout/${match.match_number}`, { state: { match, user } })}>
                            Scout Now
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={() => navigate('/scout/new', { state: { user } })}>
                New Scouting Form
            </button>
        </div>
    );
}

export default MyMatches;