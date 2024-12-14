import React, { useEffect, useState, useRef } from "react";

function TeleField({ formData, setFormData, mode }) {
    const [dotColor, setDotColor] = useState(1);
    const [pointPositions, setPointPositions] = useState([]);
    const [history, setHistory] = useState([]);
    const [counter, setCounter] = useState(formData.counter1 || 0);
    const [counter2, setCounter2] = useState(formData.counter2 || 0);
    const [defensivePins, setDefensivePins] = useState(0);
    const [deliveryCount, setDeliveryCount] = useState(formData.deliveryCount || 0);
    const imageRef = useRef(null);
    const pointRadius = 5;

    const checkboxPositions = [
        { left: '73.8%', top: '23.5%' },
        { left: '73.8%', top: '38.5%' },
        { left: '73.8%', top: '53.5%' },
        { left: '50%', top: '19%' },
        { left: '50%', top: '36%' },
        { left: '50%', top: '53%' },
        { left: '50%', top: '70%' },
        { left: '50%', top: '87.5%' },
    ];

    useEffect(() => {
        setPointPositions(formData.TelePoints);
        setCounter(formData.counter1 || 0);
        setCounter2(formData.counter2 || 0);
        setDeliveryCount(formData.deliveryCount || 0);
    }, [formData]);

    const handleImageClick = (event) => {
        const imageElement = imageRef.current;
        if (!imageElement) return;

        const rect = imageElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        if (mode === 'teleop') {
            const newPoint = { x, y, color: dotColor };
            const newPointPositions = [...pointPositions, newPoint];
            setHistory([...history, pointPositions]);
            setPointPositions(newPointPositions);

            setFormData(prevState => ({
                ...prevState,
                TelePoints: newPointPositions
            }));
        }
    };

    const handleUndo = () => {
        if (history.length > 0) {
            const previousPoints = history[history.length - 1];
            setHistory(history.slice(0, -1));
            setPointPositions(previousPoints);
            setFormData(prevState => ({
                ...prevState,
                TelePoints: previousPoints
            }));
        }
    };

    const toggleDotColor = () => {
        setDotColor(dotColor === 1 ? 2 : 1);
    };

    const incrementCounter = () => {
        setCounter(prevCounter => {
            const newCounter = prevCounter + 1;
            setFormData(prevData => ({ ...prevData, counter1: newCounter }));
            return newCounter;
        });
    };

    const decrementCounter = () => {
        setCounter(prevCounter => {
            const newCounter = Math.max(0, prevCounter - 1);
            setFormData(prevData => ({ ...prevData, counter1: newCounter }));
            return newCounter;
        });
    };

    const incrementDefensivePins = () => {
        setDefensivePins(prev => {
            const newPins = prev + 1;
            setFormData(prevData => ({ ...prevData, defensivePins: newPins }));
            return newPins;
        });
    };

    const decrementDefensivePins = () => {
        setDefensivePins(prev => {
            const newPins = Math.max(0, prev - 1);
            setFormData(prevData => ({ ...prevData, defensivePins: newPins }));
            return newPins;
        });
    };

    const incrementDeliveryCount = () => {
        setDeliveryCount(prevCount => {
            const newCount = prevCount + 1;
            setFormData(prevData => ({ ...prevData, deliveryCount: newCount }));
            return newCount;
        });
    };

    const decrementDeliveryCount = () => {
        setDeliveryCount(prevCount => {
            const newCount = Math.max(0, prevCount - 1);
            setFormData(prevData => ({ ...prevData, deliveryCount: newCount }));
            return newCount;
        });
    };

    const [trapCounter, setTrapCounter] = useState(formData.trapCounter || 0);

    const incrementTrapCounter = () => {
        setTrapCounter(prevCounter => {
            const newCounter = prevCounter + 1;
            setFormData(prevData => ({ ...prevData, trapCounter: newCounter }));
            return newCounter;
        });
    };

    const decrementTrapCounter = () => {
        setTrapCounter(prevCounter => {
            const newCounter = Math.max(0, prevCounter - 1);
            setFormData(prevData => ({ ...prevData, trapCounter: newCounter }));
            return newCounter;
        });
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', overflow: 'auto' }}>
            <img
                ref={imageRef}
                src="https://www.chiefdelphi.com/uploads/default/original/3X/a/a/aa745548020a507cf4a07051dcd0faa446607840.png"
                alt="Field Image"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onClick={handleImageClick}
            />

            {pointPositions.map((point, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <div
                        style={{
                            width: `${pointRadius * 2}px`,
                            height: `${pointRadius * 2}px`,
                            borderRadius: '50%',
                            backgroundColor: point.color === 1 ? 'green' : 'gold',
                        }}
                    />
                </div>
            ))}

            {mode === 'teleop' && (
                <>
                    <button
                        onClick={toggleDotColor}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            zIndex: '10',
                            padding: '10px',
                            fontSize: '16px',
                            backgroundColor: dotColor === 1 ? 'green' : 'gold',
                            color: 'white',
                            borderRadius: '8px',
                            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        Change Mode
                    </button>

                    <button onClick={handleUndo} style={{ position: 'absolute', top: '50px', left: '10px', zIndex: '10', padding: '10px', fontSize: '16px', borderRadius: '8px', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)' }}>
                        Undo
                    </button>

                    <div style={{ position: 'absolute', top: '0px', left: '450px', zIndex: '10', fontSize: '12px', padding: '6px', backgroundColor: "#d4af37", borderRadius: '8px' }}>
                        <button onClick={decrementCounter} style={{ fontSize: '10px', padding: '10px 20px', backgroundColor:"#012265", borderRadius: '8px' }}>-</button>
                        <span style={{ margin: '0 10px', fontSize: '20px', fontWeight:"bold"}}>{counter}</span>
                        <button onClick={incrementCounter} style={{ fontSize: '10px', padding: '10px 20px', backgroundColor:"#012265", borderRadius: '8px' }}>+</button>
                    </div>

                    <div style={{ position: 'absolute', top: '110px', left: '10px', zIndex: '10', fontSize: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'red' }}>
                        <span>Pins</span>
                        <button onClick={incrementDefensivePins} style={{ fontSize: '18px', padding: '10px 20px', marginBottom: '5px', backgroundColor: 'red', borderRadius: '8px' }}>+</button>
                        <span style={{ margin: '0 10px', fontSize: '20px', fontWeight:"bold"}}>{defensivePins}</span>
                        <button onClick={decrementDefensivePins} style={{ fontSize: '18px', padding: '10px 20px', marginTop: '5px', backgroundColor: 'red', borderRadius: '8px' }}>-</button>
                    </div>

                    <div style={{ position: 'absolute', top: '50%', right: '10px', zIndex: '10', fontSize: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue' }}>
                        <span>Delivery</span>
                        <button onClick={incrementDeliveryCount} style={{ fontSize: '18px', padding: '10px 20px', marginBottom: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '8px' }}>+</button>
                        <span style={{ margin: '0 2px', fontSize: '20px', fontWeight:"bold" }}>{deliveryCount}</span>
                        <button onClick={decrementDeliveryCount} style={{ fontSize: '18px', padding: '10px 20px', marginTop: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '8px' }}>-</button>
                    </div>
                </>
            )}

            {mode === 'checkbox' && (
                <div>
                    {formData.checkboxes.map((checked, index) => {
                        const position = checkboxPositions[index];
                        if (!position) return null; // Skip if position is undefined
                        return (
                            <div
                                key={index}
                                className="checkbox-container"
                                style={{
                                    position: 'absolute',
                                    left: position.left,
                                    top: position.top,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                        const newCheckboxes = [...formData.checkboxes];
                                        newCheckboxes[index] = !newCheckboxes[index];
                                        setFormData(prevData => ({ ...prevData, checkboxes: newCheckboxes }));
                                    }}
                                    style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default TeleField;
