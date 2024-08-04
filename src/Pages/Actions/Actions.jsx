import React, { useState, useEffect, useContext } from 'react';
import './Actions.css';
import { UserContext } from '../../context/UserContext';
import Navbar from '../Navbar/Navbar';

function Actions() {
    const { user } = useContext(UserContext);
    const [scouters, setScouters] = useState([]);
    const [incompleteScouters, setIncompleteScouters] = useState([]);

    useEffect(() => {
        fetchScouters();
    }, []);

    const fetchScouters = async () => {
        const response = await fetch('https://ScoutingSystem.pythonanywhere.com/scouters');
        const data = await response.json();
        if (data.status === 'success') {
            setScouters(data.scouters);
            setIncompleteScouters(data.scouters.filter(scouter => !scouter.matchesCompleted));
        }
    };

    const checkMatches = (scouter) => {
        return scouter.matchesCompleted ? { status: 'Completed', className: 'completed' } : { status: 'Pending', className: 'pending' };
    };

    return (
        <div>
            <Navbar />
            <div className="dashboard">
                <h2>Admin Dashboard</h2>
                <div className="tool-section">
                    <h3>Scouter Match Completion</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Scouter Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scouters.map(scouter => {
                                const matchStatus = checkMatches(scouter);
                                return (
                                    <tr key={scouter.id} className={matchStatus.className}>
                                        <td>{scouter.name}</td>
                                        <td>{matchStatus.status}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="tool-section">
                    <h3>Incomplete Scouters</h3>
                    <ul>
                        {incompleteScouters.map(scouter => (
                            <li key={scouter.id}>{scouter.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Actions;