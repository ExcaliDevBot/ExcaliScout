import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './MyMatches.css';
import Navbar from "../Navbar/Navbar";

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
                        <tr key={match.match_number}>
                            <td>{match.match_number}</td>
                            <td>{user.username}</td>
                            <td className={match.alliance === 'Red' ? 'red-text' : 'blue-text'}>
                                {match.alliance}
                            </td>
                            <td>{match.team_number}</td>
                            <td>
                                <button onClick={() => navigate(`/scout/${match.match_number}`, { state: { match, user } })}>Scout Now</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyMatches;