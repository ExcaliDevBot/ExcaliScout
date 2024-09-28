import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Papa from 'papaparse';
import './MyMatches.css';

function MyMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const fetchSuperScoutingMatches = async () => {
        const gid = '21713347'; // GID for the superScoutingAdmin sheet
        const publicSpreadsheetUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRojRhLgZSPXJopPdni1V4Z-inXXY3a__2NaVMsoJHPs9d25ZQ7t56QX67mncr6yo-w4B8WCWyHFe2m/pub?output=csv&gid=${gid}`;
        const cacheBuster = `cacheBuster=${new Date().getTime()}`;
        const urlWithCacheBuster = `${publicSpreadsheetUrl}&${cacheBuster}`;

        return new Promise((resolve, reject) => {
            Papa.parse(urlWithCacheBuster, {
                download: true,
                header: false, // Set header to false to use column indices
                complete: function (results) {
                    const uniqueMatches = new Set();
                    const superScoutingMatches = results.data
                        .map((row, index) => ({
                            name: row[0], // Column A for names
                            match_number: row[1], // Column B for match numbers
                            team_number: row[2], // Column C for team numbers
                            index: index,
                            isSuperScouting: true // Mark as super scouting match
                        }))
                        .filter(match => {
                            // Exclude rows with empty name, match number, or team number
                            if (!user.username || !match.match_number || !match.team_number || match.name !== user.username) {
                                return false;
                            }
                            const key = `${user.username}-${match.match_number}-${match.team_number}`;
                            if (uniqueMatches.has(key)) {
                                return false;
                            } else {
                                uniqueMatches.add(key);
                                return true;
                            }
                        });
                    resolve(superScoutingMatches);
                },
                error: function (error) {
                    reject(error);
                },
            });
        });
    };

    useEffect(() => {
        if (user) {
            const fetchMatches = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`https://ScoutingSystem.pythonanywhere.com/matches_assignments?user_id=${user.user_id}`);
                    const data = await response.json();
                    let dbMatches = [];
                    if (data.status === 'success') {
                        dbMatches = data.matches.map(match => ({ ...match, isSuperScouting: false })); // Mark as normal match
                    }

                    let superScoutingMatches = [];
                    if (user.role === 'super_scouter') {
                        superScoutingMatches = await fetchSuperScoutingMatches();
                    }

                    const combinedMatches = [...dbMatches, ...superScoutingMatches];
                    combinedMatches.sort((a, b) => a.match_number - b.match_number); // Sort by match number

                    setMatches(combinedMatches);
                } catch (error) {
                    console.error('Fetching data failed', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchMatches();
        }
    }, [user]);

    return (
        <div className="container">
            <h1>My Matches</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="matches-container">
                    {matches.map((match, index) => (
                        <div key={index} className={`match-card ${match.isSuperScouting ? 'super-scouting' : ''}`}>
                            <h2>Match {match.match_number}</h2>
                            <p>Team: {match.team_number}</p>
                            {!match.isSuperScouting && (
                                <p className={match.alliance === 'Red' ? 'red-text' : 'blue-text'}>
                                    Alliance: {match.alliance}
                                </p>
                            )}
                            <button className={match.isSuperScouting ? 'super-scouting-button' : 'normal-scouting-button'} onClick={() => navigate(`/scout/${match.match_number}`, { state: { match, user } })}>
                                Scout Now
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={() => navigate('/scout/new', { state: { user } })}>
                New Scouting Form
            </button>
        </div>
    );
}

export default MyMatches;