import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";
import { Button, TextField, Select, MenuItem, Typography, FormControl, InputLabel, Box, Grid } from "@mui/material";
import TeleField from "./Game/Teleop";

function ScoutingForm() {
    const location = useLocation();
    const { match, user } = location.state || {};
    const isNewForm = !match;
    const [formData, setFormData] = useState({
        Name: user ? user.username : '',
        Team: match ? match[`team${match.robot + 1}`] : '',
        Match: match ? match.match_number : '',
        Alliance: match ? match.alliance : '',
        TeleNotes: '',
        checkboxes: Array(8).fill(false),
        TelePoints: [],
        Pcounter: 0,
        counter1: 0,
        counter2: 0,
        climbed: false,
        deliveryCount: 0,
        trapCounter: 0,
        defensivePins: 0,
    });
    const [barcodeData, setBarcodeData] = useState('');
    const [mode, setMode] = useState('teleop');
    const [eraserMode, setEraserMode] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        const generateBarcode = () => {
            const telePointsCSV = formData.TelePoints.map(point => `(${point.x.toFixed(2)};${point.y.toFixed(2)};G)`).join(';');
            const missedPointsCSV = formData.TelePoints.filter(point => point.color === 2).map(point => `(${point.x.toFixed(2)};${point.y.toFixed(2)};O)`).join(';');
            const checkedCheckboxes = formData.checkboxes
                .map((checked, index) => checked ? `CA${index + 1}: ${checked}` : null)
                .filter(Boolean)
                .join(';');
            const greenPointsCount = formData.TelePoints.filter(point => point.color === 1).length;

            const barcodeString = `
                ${user.username || 'NULL'},
                ${formData.Team || 'NULL'},
                ${formData.Match || 'NULL'},
                ${formData.checkboxes.filter(checked => checked).length},
                ${formData.counter1},
                ${formData.TelePoints.filter(point => point.color === 1).length},
                ${formData.defensivePins},
                ${formData.TelePoints.filter(point => point.color === 2).length},
                ${formData.Pcounter},
                ${formData.climbed},
                ${formData.TelePoints.map(point => `(${point.x.toFixed(2)};${point.y.toFixed(2)};G)`).join(';')},
                ${formData.TelePoints.filter(point => point.color === 2).map(point => `(${point.x.toFixed(2)};${point.y.toFixed(2)};O)`).join(';')},
                ${formData.deliveryCount},
            `.replace(/\n/g, '').replace(/\s+/g, ' ').trim();

            return barcodeString.replace(/true/g, 'TRUE');
        };

        setBarcodeData(generateBarcode());
    }, [formData, mode, user]);

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

    const sendDataToSheet = (formData) => {
        let teamNumber;

        if (match && match.team_number && !isNaN(parseInt(match.team_number, 10))) {
            teamNumber = parseInt(match.team_number, 10);
        } else {
            if (!formData.Team) {
                alert('Team number must be provided.');
                return;
            }

            const cleanedTeamNumber = formData.Team.replace(/"/g, '').replace(/[()]/g, '');
            teamNumber = parseInt(cleanedTeamNumber, 10);
            if (isNaN(teamNumber) || !teamNumber) {
                alert('Team number must be a valid integer.');
                return;
            }
        }

        const valuesArray = [
            user.username.replace(/"/g, '').replace(/[()]/g, ''),
            teamNumber,
            formData.Match,
            formData.checkboxes.filter(checked => checked).length,
            formData.counter1,
            formData.TelePoints.filter(point => point.color === 1).length,
            formData.defensivePins,
            formData.TelePoints.filter(point => point.color === 2).length,
            formData.Pcounter,
            formData.climbed,
            formData.TelePoints.map(point => `(${point.x.toFixed(2)};${point.y.toFixed(2)};G)`).join(';'),
            formData.TelePoints.filter(point => point.color === 2).map(point => `(${point.x.toFixed(2)};${point.y.toFixed(2)};O)`).join(';'),
            formData.deliveryCount
        ];

        const username = user.username.replace(/"/g, '').replace(/[()]/g, '');
        const matchNumber = formData.Match;
        const alliance = formData.Alliance;
        const authNumber = Math.floor(1000000 + Math.random() * 9000000);

        alert(`Hello ${username}, we got your submission for match number ${matchNumber} about team ${teamNumber} with alliance ${alliance} successfully. Authentication submission ${authNumber}`);

        const value = removeUnwantedCharacters(JSON.stringify(valuesArray));
        fetch('https://script.google.com/macros/s/AKfycbzxJmqZyvvPHM01FOFTnlGtUFxoslmNOJTUT0QccjLQsK5uQAHHhe_HfYFO2BxyK7Y_/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'no-cors',
            body: JSON.stringify({ value: value })
        })
            .then(response => {
                console.log('Success:', response);
                setIsButtonDisabled(true); // Disable the button
            })
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

    const incrementTrapCounter = () => {
        setFormData(prev => ({ ...prev, trapCounter: prev.trapCounter < 3 ? prev.trapCounter + 1 : prev.trapCounter }));
    };

    const decrementTrapCounter = () => {
        setFormData(prev => ({ ...prev, trapCounter: Math.max(0, prev.trapCounter - 1) }));
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Scouting Form
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label=""
                        variant="outlined"
                        fullWidth
                        name="Team"
                        value={match.team_number}
                        onChange={handleInputChange}
                        disabled={!isNewForm}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Match"
                        variant="outlined"
                        fullWidth
                        name="Match"
                        value={formData.Match}
                        onChange={handleInputChange}
                        disabled={!isNewForm}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: 3 }}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Alliance</InputLabel>
                        <Select
                            label="Alliance"
                            name="Alliance"
                            value={formData.Alliance}
                            onChange={handleInputChange}
                            disabled={!isNewForm}
                        >
                            <MenuItem value="Red">Red</MenuItem>
                            <MenuItem value="Blue">Blue</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Notes"
                        variant="outlined"
                        fullWidth
                        name="TeleNotes"
                        value={formData.TeleNotes}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                    />
                </Grid>
            </Grid>

            <div className="button-container" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-evenly' }}>
                <Button
                    variant="contained"
                    onClick={handleAutoClick}
                    sx={{
                        backgroundColor: '#3f51b5',
                        '&:active': { backgroundColor: '#303f9f' },
                        '&:disabled': { backgroundColor: '#c5cae9' }
                    }}
                >
                    Autonomous
                </Button>
                <Button
                    variant="contained"
                    onClick={handleTeleopClick}
                    sx={{
                        backgroundColor: '#f44336',
                        '&:active': { backgroundColor: '#d32f2f' },
                        '&:disabled': { backgroundColor: '#ffebee' }
                    }}
                >
                    Teleop
                </Button>
            </div>

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
                incrementDeliveryCount={() => setFormData(prev => ({ ...prev, deliveryCount: prev.deliveryCount + 1 }))}
                decrementDeliveryCount={() => setFormData(prev => ({ ...prev, deliveryCount: Math.max(0, prev.deliveryCount - 1) }))}
                setClimbed={(value) => setFormData(prev => ({ ...prev, climbed: value }))}
            />

            <div className="counter-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button onClick={incrementTrapCounter}>+</Button>
                <Typography sx={{ margin: '0 20px' }}>{formData.trapCounter}</Typography>
                <Button onClick={decrementTrapCounter}>-</Button>
            </div>

            <div className="submit-container" style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isButtonDisabled}
                    sx={{
                        backgroundColor: '#4caf50',
                        '&:active': { backgroundColor: '#388e3c' },
                        '&:disabled': { backgroundColor: '#c8e6c9' }
                    }}
                >
                    Send Data
                </Button>
            </div>

            <div className="barcode-container" style={{ textAlign: 'center', marginTop: '30px' }}>
                <QRCode value={barcodeData} size={256} />
            </div>
        </Box>
    );
}

export default ScoutingForm;
