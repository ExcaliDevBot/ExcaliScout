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
        TelePoints: [],
        Pcounter: 0,
        counter1: 0,
        counter2: 0,
        climbed: false,
        Makatz: '' // New field for "מקצה"
    });
    const [barcodeData, setBarcodeData] = useState('');
    const [mode, setMode] = useState('teleop');
    const [eraserMode, setEraserMode] = useState(false);

    useEffect(() => {
        const generateBarcode = () => {
            const telePointsCSV = formData.TelePoints.map(point => `(${point.x.toFixed(2)};${point.y.toFixed(2)};G)`).join(';');
            const missedPointsCSV = formData.TelePoints.filter(point => point.color === 2).map(point => `(${point.x.toFixed(2)};${point.y.toFixed(2)};O)`).join(';');
            const checkboxStatuses = formData.checkboxes.map((checked, index) => `CA${index + 1}: ${checked}`).join(';');
            const checkedCheckboxCount = formData.checkboxes.filter(checked => checked).length;
            const greenPointsCount = formData.TelePoints.filter(point => point.color === 1).length;

            const barcodeString = `
                Name: ${formData.Name || 'NULL'},
                Team: ${formData.Team || 'NULL'},
                Match: ${formData.Makatz || 'NULL'},
                Alliance: ${formData.Alliance || 'NULL'},
                ${formData.Team || 'NULL'},
                ${formData.counter2},
                ${mode === 'checkbox' ? checkedCheckboxCount : 'NULL'},
                ${formData.Pcounter},
                ${greenPointsCount},
                ${missedPointsCSV ? missedPointsCSV.length : 'NULL'},
                NULL,
                ${formData.Pcounter},
                ${formData.climbed ? 'true' : 'false'},
                ${telePointsCSV || 'NULL'},
                NULL,
                ${checkboxStatuses || 'NULL'},
                ${formData.Makatz || 'NULL'}
            `.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
            return barcodeString;
        };

        setBarcodeData(generateBarcode());
    }, [formData, mode]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleButtonClick = (index) => {
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
        setMode('checkbox');
    };

    const handleTeleopClick = () => {
        setMode('teleop');
    };

    return (
        <div style={{ direction: 'rtl', padding: '10px' }}>
            <table className="info-table">
                <thead>
                    <tr>
                        <th>שם</th>
                        <th>קבוצה</th>
                        <th>מקצה</th>
                        <th>ברית</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span className="constant-color name-color">{formData.Name}</span></td>
                        <td><span className="constant-color team-color">{formData.Team}</span></td>
                        <td><span className="constant-color match-color">{formData.Makatz}</span></td>
                        <td><span className={`alliance-button ${formData.Alliance.toLowerCase()}`}>{formData.Alliance}</span></td>
                    </tr>
                </tbody>
            </table>
            <form onSubmit={handleSubmit} className="form">
                <label htmlFor="TeleNotes">הערות טליאופ:</label>
                <textarea
                    id="TeleNotes"
                    name="TeleNotes"
                    value={formData.TeleNotes}
                    onChange={handleInputChange}
                />
            </form>

            <h3 className="rotate-message">סובב את הטלפון שלך לרוחב כדי שהטופס יעבוד כמו שצריך.</h3>

            <h3>מפת סקאוטינג:</h3>

            <div className="button-container">
                <button type="button" className="resizable-button" onClick={handleAutoClick}>Autonomous</button>
                <button type="button" className="resizable-button" onClick={handleTeleopClick}>Teleop</button>
            </div>

            <br />

            <TeleField
                formData={formData}
                setFormData={setFormData}
                mode={mode}
                eraserMode={eraserMode}
                setEraserMode={setEraserMode}
                incrementCounter1={() => setFormData(prev => ({ ...prev, counter1: prev.counter1 + 1 }))}
                decrementCounter1={() => setFormData(prev => ({ ...prev, counter1: Math.max(0, prev.counter1 - 1) }))}
                incrementCounter2={() => setFormData(prev => ({ ...prev, counter2: prev.counter2 + 1 }))}
                decrementCounter2={() => setFormData(prev => ({ ...prev, counter2: Math.max(0, prev.counter2 - 1) }))}
                setClimbed={(value) => setFormData(prev => ({ ...prev, climbed: value }))}
            />

            <br />

            <div className="toggle-button-container">
                <button
                    type="button"
                    className={`toggle-button ${formData.climbed ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, climbed: !prev.climbed }))}
                >
                    הרובוט טיפס?
                </button>
            </div>

            <br />

            <div className="counter-container">
                <label>קליעות לtrap:</label>
                <div className="counter-buttons">
                    <button onClick={() => setFormData(prev => ({ ...prev, Pcounter: Math.max(0, prev.Pcounter - 1) }))} className="counter-button">-</button>
                    <span className="counter-value">{formData.Pcounter}</span>
                    <button onClick={() => setFormData(prev => ({ ...prev, Pcounter: prev.Pcounter + 1 }))} className="counter-button">+</button>
                </div>
            </div>

            <br />

            <div className="qr-code-container">
                <QRCode value={barcodeData} />
            </div>
        </div>
    );
}

export default ScoutingForm;