import React from "react";
import Navbar from "C:/Users/Korengut/WebstormProjects/create-react-app1/src/Pages/Navbar/Navbar.jsx";

function SuperScouting() {
    return (
        <div>
            <Navbar/>
            <h2>Super Scouting:</h2>
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

                <label htmlFor="Sname">How did the robot deal with defense?</label><br/>
                <textarea name="paragraph_text" cols="50" rows="10"></textarea>
                <br/>

                <label htmlFor="Sname">How was the driving quality?</label><br/>
                <textarea name="paragraph_text" cols="50" rows="10"></textarea>
                <br/>
            </form>

            <div className="center-button">
                <button type="submit">Submit</button>
            </div>
            <br/>
        </div>
    );
}

export default SuperScouting;
