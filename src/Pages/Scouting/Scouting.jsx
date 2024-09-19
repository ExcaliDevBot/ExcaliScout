import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";
import "./Scouting.css";
import TeleField from "./Game/Teleop";

function ScoutingForm() {
    const location = useLocation();
    const { match, user } = location.state || {};
    const [formData, setFormData] = useState({
        Name: user ? user.username : '',
        Team: match ? match[`team${match.robot + 1}`] : '',
        Alliance: match ? match.alliance : '',
        TeleNotes: '',
        checkboxes: Array(8).fill(false),
        TelePoints: []
    });
    const [barcodeData, setBarcodeData] = useState('');
    const [mode, setMode] = useState('teleop'); // State to track mode
    const [eraserMode, setEraserMode] = useState(false); // State for eraser mode

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
        setMode('checkbox'); // Switch to checkbox mode
    };

    const handleTeleopClick = () => {
        setMode('teleop'); // Switch to teleop mode
    };

    return (
        <div style={{ fontFamily: 'Assistant', direction: 'rtl' }}>
            <h2 style={{ fontFamily: 'Assistant' }}>סקאוטינג רגיל:</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
                <label htmlFor="Sname" style={{ fontFamily: 'Assistant' }}>שם:</label>
                <input
                    type="text"
                    id="Sname"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    style={{ margin: '10px', padding: '10px', width: 'calc(100% - 20px)', boxSizing: 'border-box', fontFamily: 'Assistant' }}
                />

                <label htmlFor="Team" style={{ fontFamily: 'Assistant' }}>מספר קבוצה:</label>
                <input
                    type="number"
                    id="Team"
                    name="Team"
                    value={formData.Team}
                    onChange={handleInputChange}
                    style={{ margin: '10px', padding: '10px', width: 'calc(100% - 20px)', boxSizing: 'border-box', fontFamily: 'Assistant' }}
                />

                <label htmlFor="Alliance" style={{ fontFamily: 'Assistant' }}>ברית:</label>
                <input
                    type="text"
                    id="Alliance"
                    name="Alliance"
                    value={formData.Alliance}
                    onChange={handleInputChange}
                    style={{ margin: '10px', padding: '10px', width: 'calc(100% - 20px)', boxSizing: 'border-box', fontFamily: 'Assistant' }}
                />
            </form>

            <h3 style={{ color: 'black', textAlign: 'center', fontFamily: 'Assistant' }}>סובב את הטלפון שלך לרוחב כדי שהטופס יעבוד כמו שצריך.</h3>

            <h3 style={{ fontFamily: 'Assistant' }}>מפת סקאוטינג:</h3>

            <div className="button-container" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <button type="button" className="resizable-button" style={{ flex: 1, margin: '5px', fontFamily: 'Assistant' }} onClick={handleAutoClick}>Autonomous</button>
                <button type="button" className="resizable-button" style={{ flex: 1, margin: '5px', fontFamily: 'Assistant' }} onClick={handleTeleopClick}>Teleop</button>
            </div>

            <br />

            <TeleField formData={formData} setFormData={setFormData} mode={mode} eraserMode={eraserMode} setEraserMode={setEraserMode} />

            <br />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ fontFamily: 'Assistant' }}>
                    <input type="checkbox" onChange={() => handleCheckboxChange(0)} />
                     הרובוט טיפס?
                </label>
                <label style={{ fontFamily: 'Assistant' }}>
                    <input type="checkbox" onChange={() => handleCheckboxChange(1)} />
                     הרובוט טיפס עם עוד רובוט?
                </label>
                <label style={{ fontFamily: 'Assistant' }}>
                    <input type="checkbox" onChange={() => handleCheckboxChange(2)} />
                    הרובוט קלע לTrap?
                </label>
                <br/>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="submit" style={{ padding: '10px 20px', fontFamily: 'Assistant' }}>שליחה</button>
            </div>

            <h3 style={{ fontFamily: 'Assistant' }}>If there is no Wifi:</h3>
            <QRCodeSection barcodeData={barcodeData} />
            <br />
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
