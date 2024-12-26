import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../../firebase-config";
import { ref, push } from "firebase/database";
import "./SuperScouting.css";

const questionsList = {
    0: "תאר אוטונומי?",
    1: "תאר טלאופ + אנדגיים",
    2: "תאר שימוש בטראפ",
    3: "תאר הגנה",
    4: "תאר התמודוות מול הגנה",
    5: "פרט רוטיישנס",
    6: "ירי - מיקום + גובה + זמן",
    7: "איסוף - רצפה/פידר + זמן",
    8: "תאר כימיה עם שאר הברית",
    9: "הערות",
};

function SuperScouting() {
    const location = useLocation();
    const { match, questions } = location.state || {};
    const [formData, setFormData] = useState({});

    if (!match || !questions) {
        return <div>Error: Match or questions data is missing.</div>;
    }

    const handleChange = (event, questionId) => {
        setFormData({
            ...formData,
            [questionId]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataToSend = {
            name: match.name || "Super Scout Match",
            team_number: match.team_number,
            match_number: match.match_number,
            questions: questions.map((questionId) => ({
                question: questionsList[questionId],
                answer: formData[questionId] || "",
            })),
        };

        try {
            const superScoutingRef = ref(db, "superScoutingResults");
            await push(superScoutingRef, dataToSend);
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data.");
        }
    };

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
                    <td>
                        <span className="constant-color name-color">{match.name}</span>
                    </td>
                    <td>
                        <span className="constant-color team-color">{match.team_number}</span>
                    </td>
                    <td>
                        <span className="constant-color match-color">{match.match_number}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <form onSubmit={handleSubmit}>
                {questions.map(
                    (questionId, index) =>
                        questionsList[questionId] && (
                            <div key={index} className="question-answer">
                                <label>{questionsList[questionId]}</label>
                                <textarea
                                    name={`question_${questionId}`}
                                    onChange={(e) => handleChange(e, questionId)}
                                ></textarea>
                            </div>
                        )
                )}
                <div className="center-button">
                    <button type="submit">Submit</button>
                </div>
            </form>
            <br />
        </div>
    );
}

export default SuperScouting;
