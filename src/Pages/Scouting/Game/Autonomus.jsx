import React, { useState, useEffect, useRef } from "react";

function AutoField({ handleCheckboxChange }) {
    const [checkboxes] = useState([
        { x: 49.95, y: 70.5 },
        { x: 49.95, y: 87.7 },
        { x: 49.95, y: 53.2 },
        { x: 49.95, y: 36.1 },
        { x: 49.95, y: 18.8 },
        { x: 73.8, y: 53.2 },
        { x: 73.8, y: 38.3 },
        { x: 73.8, y: 23.4 },
    ]);

    const imageRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [checkboxPositions, setCheckboxPositions] = useState([]);

    useEffect(() => {
        const updateImageDimensions = () => {
            const imageElement = imageRef.current;
            if (imageElement) {
                const { naturalWidth, naturalHeight } = imageElement;
                setImageDimensions({ width: naturalWidth, height: naturalHeight });

                const positions = checkboxes.map((checkbox) => ({
                    x: (checkbox.x / 100) * naturalWidth,
                    y: (checkbox.y / 100) * naturalHeight,
                }));
                setCheckboxPositions(positions);
            }
        };

        updateImageDimensions();

        window.addEventListener('resize', updateImageDimensions);

        return () => {
            window.removeEventListener('resize', updateImageDimensions);
        };
    }, [checkboxes]);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <img
                ref={imageRef}
                src="https://www.chiefdelphi.com/uploads/default/original/3X/a/a/aa745548020a507cf4a07051dcd0faa446607840.png"
                alt="Field Image"
                style={{ width: '100%', height: 'auto', display: 'block' }}
            />

            {checkboxPositions.map((position, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        left: `${(position.x / imageDimensions.width) * 100}%`,
                        top: `${(position.y / imageDimensions.height) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <input
                        type="checkbox"
                        onChange={(e) => handleCheckboxChange(e, checkboxes[index])}
                    />
                </div>
            ))}
        </div>
    );
}

export default AutoField;Teleop.jsx
