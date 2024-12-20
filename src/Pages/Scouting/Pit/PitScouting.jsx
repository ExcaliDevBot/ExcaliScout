import React, { useState } from "react";

function Button() {
    const [isTrue, setIsTrue] = useState(false);

    const toggleButtonState = () => {
        setIsTrue(prevState => !prevState);
    };

    return (
        <button type="button" onClick={toggleButtonState}>
            {isTrue ? "True" : "False"}
        </button>
    );
}

function PitScouting() {
    return (
        <div>
            <h2>Pit Scouting:</h2>
            <form>
                <label htmlFor="Sname">Name:</label><br/>
                <input type="text" id="Sname" name="Name"/><br/>
                <br/>

                <label htmlFor="Team">Team Number:</label><br/>
                <input type="number" id="Team" name="Team"/><br/>
                <br/>

                <label htmlFor="Alliance">Alliance:</label><br/>
                <input type="text" id="Alliance" name="Alliance"/>
                <br/>
            </form>
            <br/>
            <form>
                <label htmlFor="Sname">What did the robot do autonomous?</label><br/>
                <textarea name="paragraph_text" cols="50" rows="10"></textarea>
                <br/>

                <label htmlFor="Sname">What is the structure of the robot?</label><br/>
                <textarea name="paragraph_text" cols="50" rows="10"></textarea>
                <br/>

                <label htmlFor="Sname">What can the robot do?</label><br/>
                <textarea name="paragraph_text" cols="50" rows="10"></textarea>
                <br/>
            </form>

            <div className="question-container">
                <div className="question">
                    <label>Does the robot have a lift?</label>
                    <Button/>
                </div>
                <div className="question">
                    <label>Can the robot climb?</label>
                    <Button/>
                </div>
                <div className="question">
                    <label>Can the robot face?</label>
                    <Button/>
                </div>
            </div>
            <br/>

            <label htmlFor="Sname">Summary:</label><br/>
            <textarea name="paragraph_text" cols="50" rows="10"></textarea>
            <br/>

            <label>Push:</label>
            <div className="submit-container">
                <button type="submit">Submit</button>
            </div>
            <br/>
        </div>
    );
}

export default PitScouting;
