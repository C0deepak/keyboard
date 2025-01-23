'use client'

import React, { useEffect, useState } from 'react';

const Floating = () => {
    const [currentField, setCurrentField] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [isShiftActive, setIsShiftActive] = useState(false);
    const [isCapsLockActive, setIsCapsLockActive] = useState(false);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Handle input field focus
    const handleFocus = (field) => {
        setCurrentField(field);
    };

    // Adjust the page height when the keyboard appears
    useEffect(() => {
        const handleResize = () => {
            const viewportHeight = window.innerHeight;
            const documentHeight = document.documentElement.clientHeight;

            // Calculate keyboard height
            if (viewportHeight < documentHeight) {
                const newKeyboardHeight = documentHeight - viewportHeight;
                setKeyboardHeight(newKeyboardHeight);
            } else {
                setKeyboardHeight(0); // Reset keyboard height
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Close keyboard when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.floating-keyboard') && !e.target.closest('input')) {
                setCurrentField(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleKeyPress = (key) => {
        if (currentField) {
            setFormData((prev) => ({
                ...prev,
                [currentField]: prev[currentField] + key,
            }));
        }
        if (isShiftActive) setIsShiftActive(false);
    };

    const handleBackspace = () => {
        if (currentField) {
            setFormData((prev) => ({
                ...prev,
                [currentField]: prev[currentField].slice(0, -1),
            }));
        }
    };

    const handleTab = () => {
        if (currentField) {
            setFormData((prev) => ({
                ...prev,
                [currentField]: prev[currentField] + '        ',
            }));
        }
    };

    const handleEnter = () => {
        setCurrentField(null);
    };

    const handleSpace = () => {
        handleKeyPress(' ');
    };

    const toggleShift = () => {
        setIsShiftActive((prev) => !prev);
    };

    const toggleCapsLock = () => {
        setIsCapsLockActive((prev) => !prev);
    };

    const handleSubmit = () => {
        console.log(formData);
    };

    const rows = [
        [
            { char: "`", shiftChar: "~" },
            { char: "1", shiftChar: "!" },
            { char: "2", shiftChar: "@" },
            { char: "3", shiftChar: "#" },
            { char: "4", shiftChar: "$" },
            { char: "5", shiftChar: "%" },
            { char: "6", shiftChar: "^" },
            { char: "7", shiftChar: "&" },
            { char: "8", shiftChar: "*" },
            { char: "9", shiftChar: "(" },
            { char: "0", shiftChar: ")" },
            { char: "-", shiftChar: "_" },
            { char: "=", shiftChar: "+" },
            { char: "Backspace" },
        ],
        [
            { char: "Tab" },
            { char: "q" },
            { char: "w" },
            { char: "e" },
            { char: "r" },
            { char: "t" },
            { char: "y" },
            { char: "u" },
            { char: "i" },
            { char: "o" },
            { char: "p" },
            { char: "[", shiftChar: "{" },
            { char: "]", shiftChar: "}" },
            { char: "\\", shiftChar: "|" },
        ],
        [
            { char: "Caps Lock" },
            { char: "a" },
            { char: "s" },
            { char: "d" },
            { char: "f" },
            { char: "g" },
            { char: "h" },
            { char: "j" },
            { char: "k" },
            { char: "l" },
            { char: ";", shiftChar: ":" },
            { char: "'", shiftChar: '"' },
            { char: "Enter" },
        ],
        [
            { char: "Shift" },
            { char: "z" },
            { char: "x" },
            { char: "c" },
            { char: "v" },
            { char: "b" },
            { char: "n" },
            { char: "m" },
            { char: ",", shiftChar: "<" },
            { char: ".", shiftChar: ">" },
            { char: "/", shiftChar: "?" },
            { char: "Shift" },
        ],
        [
            { char: "Space" },
        ],
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative"
            style={{ paddingBottom: `${keyboardHeight}px` }}>
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h1 className="text-2xl font-bold text-center mb-4">Onscreen Keyboard</h1>
                <div className="space-y-4">
                    <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        value={formData.name}
                        onFocus={() => setCurrentField('name')}
                        className="w-full px-4 py-2 border rounded focus:outline-none"
                        readOnly
                    />
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        onFocus={() => setCurrentField('email')}
                        className="w-full px-4 py-2 border rounded focus:outline-none"
                        readOnly
                    />
                    <input
                        type="tel"
                        id="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onFocus={() => setCurrentField('phone')}
                        className="w-full px-4 py-2 border rounded focus:outline-none"
                        readOnly
                    />
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Floating Keyboard */}
            {currentField && (
                <div
                    className="fixed bottom-0 left-0 w-fit bg-white shadow-lg p-4 z-50 overflow-auto"
                    style={{ maxHeight: '40vh' }}
                >
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center space-x-1 mb-2">
                            {row.map((keyObj, keyIndex) => {
                                const displayKey =
                                    isShiftActive && keyObj.shiftChar
                                        ? keyObj.shiftChar
                                        : isCapsLockActive && /^[a-z]$/.test(keyObj.char)
                                            ? keyObj.char.toUpperCase()
                                            : keyObj.char;

                                if (keyObj.char === 'Space') {
                                    return (
                                        <button
                                            key={keyIndex}
                                            onClick={handleSpace}
                                            className="w-64 px-4 py-2 bg-gray-200 text-black rounded"
                                        >
                                            {keyObj.char}
                                        </button>
                                    );
                                }

                                if (keyObj.char === "Backspace") {
                                    return (
                                        <button
                                            key={keyIndex}
                                            onClick={handleBackspace}
                                            className="px-4 py-2 bg-white text-neutral-900 shadow-md rounded hover:bg-neutral-100"
                                        >
                                            {keyObj.char}
                                        </button>
                                    );
                                }

                                if (keyObj.char === "Shift") {
                                    return (
                                        <button
                                            key={keyIndex}
                                            onClick={toggleShift}
                                            className={`px-4 py-2 bg-white text-neutral-900 shadow-md rounded hover:bg-neutral-100 ${isShiftActive && "bg-neutral-200"}`}
                                        >
                                            {keyObj.char}
                                        </button>
                                    );
                                }

                                if (keyObj.char === "Caps Lock") {
                                    return (
                                        <button
                                            key={keyIndex}
                                            onClick={toggleCapsLock}
                                            className={`px-4 py-2 bg-white text-neutral-900 shadow-md rounded hover:bg-nutral-100 ${isCapsLockActive && "bg-neutral-200"}`}
                                        >
                                            {keyObj.char}
                                        </button>
                                    );
                                }

                                if (keyObj.char === "Tab") {
                                    return (
                                        <button
                                            key={keyIndex}
                                            onClick={handleTab}
                                            className="px-10 py-2 bg-white text-neutral-900 shadow-md rounded hover:bg-neutral-100"
                                        >
                                            {keyObj.char}
                                        </button>
                                    );
                                }

                                if (keyObj.char === "Enter") {
                                    return (
                                        <button
                                            key={keyIndex}
                                            onClick={handleEnter}
                                            className="px-4 py-2 bg-white text-neutral-900 shadow-md rounded hover:bg-neutral-100"
                                        >
                                            {keyObj.char}
                                        </button>
                                    );
                                }

                                return (
                                    <button
                                        key={keyIndex}
                                        onClick={() => handleKeyPress(displayKey)}
                                        className="relative px-4 py-2 bg-white text-neutral-900 shadow-md rounded hover:bg-neutral-100"
                                    >
                                        {keyObj.char}
                                        {keyObj.shiftChar && (
                                            <sup className="absolute top-1 left-1 text-xs text-neutral-900">
                                                {keyObj.shiftChar}
                                            </sup>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Floating;
