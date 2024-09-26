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
        setMode('checkbox');
    };

    const handleTeleopClick = () => {
        setMode('teleop');
    };

    return (
        <div style={{ fontFamily: 'Assistant', direction: 'rtl' }}>
            <h2 style={{ fontFamily: 'Assistant' }}>סקאוטינג רגיל:</h2>
            <div style={{ margin: '10px', padding: '10px', width: 'calc(100% - 20px)', boxSizing: 'border-box', fontFamily: 'Assistant' }}>
                <p>שם: {user.username}</p>
                <p>מספר קבוצה: {match.team_number}</p>
                <p>ברית: {formData.Alliance}</p>
                <p>מקצה: {match.match_number}</p>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
                <label htmlFor="TeleNotes" style={{ fontFamily: 'Assistant' }}>הערות טליאופ:</label>
                <input
                    type="text"
                    id="TeleNotes"
                    name="TeleNotes"
                    value={formData.TeleNotes}
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

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ fontFamily: 'Assistant' }}>
                    <input
                        type="checkbox"
                        checked={formData.climbed}
                        onChange={() => setFormData(prev => ({ ...prev, climbed: !prev.climbed }))}
                    />
                    הרובוט טיפס?
                </label>
                <br />
                <label style={{ fontFamily: 'Assistant' }}>
                    קליעות לtrap:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                    <button onClick={() => setFormData(prev => ({ ...prev, Pcounter: Math.max(0, prev.Pcounter - 1) }))} style={{ fontSize: '14px', padding: '5px 10px' }}>-</button>
                    <span style={{ margin: '0 10px', fontSize: '20px' }}>{formData.Pcounter}</span>
                    <button onClick={() => setFormData(prev => ({ ...prev, Pcounter: prev.Pcounter + 1 }))} style={{ fontSize: '14px', padding: '5px 10px' }}>+</button>
                </div>
            </div>

            <br />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <QRCode value={barcodeData} />
            </div>
        </div>
    );
}

export default ScoutingForm;