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
            <h2>My Matches</h2>
            <table>
                <thead>
                    <tr>
                        <th>Match Number</th>
                        <th>Scouter</th>
                        <th>Alliance</th>
                        <th>Team Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map(match => (
                        <tr key={match.match_id}>
                            <td>{match.match_id}</td>
                            <td>{user.username}</td>
                            <td>{match.alliance}</td>
                            <td>{match.team_number}</td>
                            <td>
                                <button onClick={() => navigate(`/scout/${match.match_id}`, { state: { match, user } })}>Scout Now</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyMatches;