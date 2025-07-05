import React from 'react';

function ToggleButton({ showLogin, toggleForm, isClient }) {
    return (
        <div className="form-toggle">
            {isClient ? (
                <>
                    <button onClick={() => toggleForm(true)} disabled={showLogin}>
                        Client Login
                    </button>
                </>
            ) : (
                <>
                    <button onClick={() => toggleForm(true)} disabled={showLogin}>
                        User Login
                    </button>
                    <button onClick={() => toggleForm(false)} disabled={!showLogin}>
                        User Signup
                    </button>
                </>
            )}
            <style>
                {`
                /* Main box styling with increased width */
                .form-toggle {
                    width: 90%; /* Increased width for a larger main box */
                    max-width: 1000px; /* Set a larger maximum width */
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin: 40px auto; /* Center the box horizontally */
                    padding: 30px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    font-family: Arial, sans-serif;
                }

                /* Button styling */
                .form-toggle button {
                    padding: 12px 24px;
                    font-size: 16px;
                    color: white;
                    background-color: #007bff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    flex: 1; /* Make buttons evenly stretch */
                }

                .form-toggle button:disabled {
                    background-color: #c0c0c0;
                    cursor: not-allowed;
                }

                .form-toggle button:hover:not(:disabled) {
                    background-color: #0056b3;
                }
                `}
            </style>
        </div>
    );
}

export default ToggleButton;




