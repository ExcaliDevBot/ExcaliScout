import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";
import "./Scouting.css";
import Navbar from "../Navbar/Navbar";
import TeleField from "./Game/Teleop";
import Papa from "papaparse";

function ScoutingForm() {
    const location = useLocation();
    const { match, user } = location.state || {};
    const [formData, setFormData] = useState({
        Name: user ? user.username : '',
        Team: match ? match[`team${match.robot + 1}`] : '',
        Alliance: match ? match.alliance : '',
        TeleNotes: '',
        checkboxes: Array(9).fill(false),
        TelePoints: []
    });
    const [barcodeData, setBarcodeData] = useState('');

    useEffect(() => {
        const generateBarcode = () => {
            const telePointsCSV = formData.TelePoints.map(point => `(${point.x.toFixed(2)},${point.y.toFixed(2)},${point.color === 1 ? 'O' : 'G'})`).join(' ');
            const barcodeString = `${formData.Name},${formData.Alliance},${formData.Team},${telePointsCSV}`;
            return barcodeString;
        };

        setBarcodeData(generateBarcode());
    }, [formData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (index) => {
        const newCheckboxes = [...formData.checkboxes];
        newCheckboxes[index] = !newCheckboxes[index];
        setFormData({ ...formData, checkboxes: newCheckboxes });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendDataToSheet(JSON.stringify(formData));
    };

    const sendDataToSheet = (value) => {
        value = removeUnwantedCharacters(value);
        fetch('https://script.google.com/macros/s/AKfycbzxJmqZyvvPHM01FOFTnlGtUFxoslmNOJTUT0QccjLQsK5uQAHHhe_HfYFO2BxyK7Y_/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'no-cors',
            body: JSON.stringify({ value: value })
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));
    };

    const removeUnwantedCharacters = (value) => {
        return value.replace(/[{}\[\]]/g, '');
    };

    const handleAutoClick = () => {
    };

    const handleTeleopClick = () => {
    };

    return (
        <div>
            <Navbar />
            <br />

            <form onSubmit={handleSubmit}>
                <label htmlFor="Sname">Name:</label><br />
                <input type="text" id="Sname" name="Name" value={formData.Name} onChange={handleInputChange} /><br />
                <br />

                <label htmlFor="Team">Team Number:</label><br />
                <input type="number" id="Team" name="Team" value={formData.Team} onChange={handleInputChange} /><br />
                <br />

                <label htmlFor="Alliance">Alliance:</label><br />
                <input type="text" id="Alliance" name="Alliance" value={formData.Alliance} onChange={handleInputChange} />
                <br />
            </form>

            <br />

            <h3 style={{ color: 'black' }}>Turn your phone sideways to work comfortably with the map.</h3>

            <h3>Map for scouting:</h3>

            <div className="button-container">
                <button type="button" className="resizable-button">Endgame</button>
                <button type="button" className="resizable-button" onClick={handleTeleopClick}>Teleop</button>
                <button type="button" className="resizable-button" onClick={handleAutoClick}>Autonomus</button>
            </div>

            <br />

            <TeleField formData={formData} setFormData={setFormData} />

            <br />

            <button type="submit" onClick={handleSubmit}>Submit</button>
            <h3>If there is no Wifi:</h3>
            <QRCodeSection barcodeData={barcodeData} />
            <br/>
        </div>
    );
}

function QRCodeSection({ barcodeData }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <QRCode value={barcodeData} size={150} />
        </div>
    );
}

export default ScoutingForm;