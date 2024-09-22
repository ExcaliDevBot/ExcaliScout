import React, { useEffect, useState, useRef } from "react";

function TeleField({ formData, setFormData, mode, eraserMode, setEraserMode }) {
    const [dotColor, setDotColor] = useState(1);
    const [pointPositions, setPointPositions] = useState([]);
    const [counter, setCounter] = useState(formData.counter1 || 0); // Initialize from formData
    const [counter2, setCounter2] = useState(formData.counter2 || 0); // Initialize from formData
    const imageRef = useRef(null);
    const pointRadius = 2; // Radius for eraser

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
        setCounter(formData.counter1 || 0); // Sync with formData
        setCounter2(formData.counter2 || 0); // Sync with formData
    }, [formData]);

    const handleImageClick = (event) => {
        const imageElement = imageRef.current;
        if (!imageElement) return;

        const rect = imageElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        if (eraserMode) {
            const newPointPositions = pointPositions.filter(point => {
                const distanceX = Math.abs(point.x - x);
                const distanceY = Math.abs(point.y - y);
                const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
                return distance > pointRadius; // Keep points outside the radius
            });

            setPointPositions(newPointPositions);
            setFormData(prevState => ({
                ...prevState,
                TelePoints: newPointPositions
            }));
        } else if (mode === 'teleop') {
            const newPoint = { x, y, color: dotColor };
            setPointPositions([...pointPositions, newPoint]);

            setFormData(prevState => ({
                ...prevState,
                TelePoints: [...prevState.TelePoints, newPoint]
            }));
        }
        // No action for autonomous mode
    };

    const toggleDotColor = () => {
        setDotColor(dotColor === 1 ? 2 : 1);
        setEraserMode(false); // Switch to normal mode when changing colors
    };

    const incrementCounter = () => {
        setCounter(prevCounter => {
            const newCounter = prevCounter + 1;
            setFormData(prevData => ({ ...prevData, counter1: newCounter })); // Update formData
            return newCounter;
        });
    };

    const decrementCounter = () => {
        setCounter(prevCounter => {
            const newCounter = Math.max(0, prevCounter - 1); // Prevent going below 0
            setFormData(prevData => ({ ...prevData, counter1: newCounter })); // Update formData
            return newCounter;
        });
    };

    const incrementCounter2 = () => {
        setCounter2(prevCounter => {
            const newCounter = prevCounter + 1;
            setFormData(prevData => ({ ...prevData, counter2: newCounter })); // Update formData
            return newCounter;
        });
    };

    const decrementCounter2 = () => {
        setCounter2(prevCounter => {
            const newCounter = Math.max(0, prevCounter - 1); // Prevent going below 0
            setFormData(prevData => ({ ...prevData, counter2: newCounter })); // Update formData
            return newCounter;
        });
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
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
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: point.color === 1 ? 'green' : 'orange',
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </div>
            ))}

            {mode === 'teleop' && (
                <>
                    <button onClick={toggleDotColor} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: '10' }}>
                        שנה מצב
                    </button>

                    <button onClick={() => setEraserMode(!eraserMode)} style={{ position: 'absolute', top: '50px', left: '10px', zIndex: '10', marginTop: '10px' }}>
                        {eraserMode ? 'השבת מחק' : 'מצב מחק'}
                    </button>

                    {/* Counter Display for Teleop */}
                    <div style={{ position: 'absolute', top: '0px', left: '500px', zIndex: '10', fontSize: '24px' }}>
                        <button onClick={decrementCounter} style={{ fontSize: '14px', padding: '5px 10px' }}>-</button>
                        <span style={{ margin: '0 10px', fontSize: '20px' }}>{counter}</span>
                        <button onClick={incrementCounter} style={{ fontSize: '14px', padding: '5px 10px' }}>+</button>
                    </div>
                </>
            )}

            {mode === 'checkbox' && (
                <>
                    {/* Counter Display for Autonomous */}
                    <div style={{ position: 'absolute', top: '0px', left: '500px', zIndex: '10', fontSize: '24px' }}>
                        <button onClick={decrementCounter2} style={{ fontSize: '14px', padding: '5px 10px' }}>-</button>
                        <span style={{ margin: '0 10px', fontSize: '20px' }}>{counter2}</span>
                        <button onClick={incrementCounter2} style={{ fontSize: '14px', padding: '5px 10px' }}>+</button>
                    </div>
                </>
            )}

            {mode === 'checkbox' && (
                <div>
                    {formData.checkboxes.map((checked, index) => (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                left: checkboxPositions[index]?.left,
                                top: checkboxPositions[index]?.top,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                    const newCheckboxes = [...formData.checkboxes];
                                    newCheckboxes[index] = !newCheckboxes[index];
                                    setFormData({ ...formData, checkboxes: newCheckboxes });
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TeleField;
