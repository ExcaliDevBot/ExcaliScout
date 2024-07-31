import React, { useState, useEffect } from 'react';
import './MatchAssign.css';

function MatchAssign() {
    const [matches, setMatches] = useState([]);
    const [scouters, setScouters] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch('https://ScoutingSystem.pythonanywhere.com/matches');
                const data = await response.json();
                if (data.status === 'success') {
                    setMatches(data.matches);
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('https://ScoutingSystem.pythonanywhere.com/users');
                const data = await response.json();
                if (data.status === 'success') {
                    setScouters(data.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchMatches();
        fetchUsers();
    }, []);

    const handleScouterChange = (matchId, scouterIndex, userId) => {
        setMatches(matches.map(match => {
            if (match.match_id === matchId) {
                match[`scouter${scouterIndex}`] = userId;
            }
            return match;
        }));
    };

    const handleManualAssign = async () => {
        try {
            const response = await fetch('https://ScoutingSystem.pythonanywhere.com/manual_assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ matches }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                alert('Scouters updated successfully');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to save assignments');
        }
    };

    return (
        <div className="match-assign-container">
            <h2>Match Assignment</h2>
            <table>
                <thead>
                    <tr>
                        <th>Match</th>
                        <th>Scouter 1 (Red)</th>
                        <th>Scouter 2 (Red)</th>
                        <th>Scouter 3 (Red)</th>
                        <th>Scouter 4 (Blue)</th>
                        <th>Scouter 5 (Blue)</th>
                        <th>Scouter 6 (Blue)</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map(match => (
                        <tr key={match.match_id}>
                            <td>{match.match_id}</td>
                            {[1, 2, 3, 4, 5, 6].map(scouterIndex => (
                                <td key={scouterIndex} className={scouterIndex <= 3 ? 'red-alliance' : 'blue-alliance'}>
                                    <select
                                        value={match[`scouter${scouterIndex}`] || ''}
                                        onChange={(e) => handleScouterChange(match.match_id, scouterIndex, e.target.value)}
                                    >
                                        <option value="">Select a scouter</option>
                                        {scouters.map(scouter => (
                                            <option key={scouter.user_id} value={scouter.user_id}>
                                                {scouter.username}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleManualAssign}>Save Assignments</button>
        </div>
    );
}

export default MatchAssign;