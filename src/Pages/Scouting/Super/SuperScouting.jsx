import React from "react";
import { useLocation } from "react-router-dom";
import "./SuperScouting.css";

const questionsList = {
    1: "What did the robot do autonomous?",
    2: "How did the robot deal with defense?",
    3: "How was the driving quality?",
    4: "How was the robot's performance in teleop?",
    5: "How was the robot's endgame performance?",
    6: "Any additional comments?"
};

function SuperScouting() {
    const location = useLocation();
    const { match, questions } = location.state || {}; // Add a default empty object

    // Ensure match and questions are defined
    if (!match || !questions) {
        return <div>Error: Match or questions data is missing.</div>;
    }

    return (
        <div className="container">
            <h2>Super Scouting:</h2>
            <table className="info-table">
                <thead>
                    <tr>
                        <th>שם</th>
                        <th>קבוצה</th>
                        <th>מקצה</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span className="constant-color name-color">{match.name}</span></td>
                        <td><span className="constant-color team-color">{match.team_number}</span></td>
                        <td><span className="constant-color match-color">{match.match_number}</span></td>
                    </tr>
                </tbody>
            </table>
            <form>
                {questions.map((questionId, index) => (
                    questionsList[questionId] && (
                        <div key={index} className="question-answer">
                            <label>{questionsList[questionId]}</label>
                            <textarea name={`question_${questionId}`}></textarea>
                        </div>
                    )
                ))}
            </form>

            <div className="center-button">
                <button type="submit">Submit</button>
            </div>
            <br />
        </div>
    );
}

export default SuperScouting;