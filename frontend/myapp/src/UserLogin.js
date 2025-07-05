import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            username,
            password,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/login/', loginData);
            if (response.data && response.data.access) {
                localStorage.setItem('token', response.data.access);
                console.log('Token after login:', localStorage.getItem('token'));

                setErrorMessage(''); // Clear any previous error messages
                onLoginSuccess();
                navigate('/dashboard');
            } else {
                setErrorMessage('Unexpected response from server');
                setShowPopup(true); // Show the popup for unexpected responses
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data?.error || 'Login failed');
                setShowPopup(true); // Show the popup on login failure
            } else if (error.request) {
                setErrorMessage('No response from server. Please try again.');
                setShowPopup(true); // Show the popup on no response
            } else {
                setErrorMessage('Network error or server is unreachable.');
                setShowPopup(true); // Show the popup for network errors
            }
        }
    };

    const closePopup = () => {
        setShowPopup(false); // Close the popup
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Login
                </button>
            </form>

            {showPopup && (
                <div style={styles.popup} onClick={closePopup}>
                    {errorMessage}
                    <button
                        onClick={() => {
                            setShowPopup(false);
                            navigate('/');
                        }}
                        style={styles.popupButton}
                    >
                        Go to Sign Up
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoginForm;

// Inline styles
const styles = {
    container: {
        maxWidth: '400px',
        margin: 'auto',
        padding: '2rem',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        fontSize: '2rem',
        marginBottom: '1rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    label: {
        color: '#555',
        fontSize: '1rem',
        marginBottom: '0.3rem',
    },
    input: {
        width: '100%',
        padding: '0.8rem',
        fontSize: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        transition: 'border-color 0.3s ease',
    },
    button: {
        width: '100%',
        padding: '0.8rem',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginLeft: '12px',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    inputFocus: {
        outline: 'none',
        borderColor: '#007bff',
        boxShadow: '0 0 4px rgba(0, 123, 255, 0.2)',
    },
    popup: {
        width: '300px',
        padding: '1.5rem',
        fontSize: '1rem',
        lineHeight: '1.5',
        backgroundColor: '#ff4d4d',
        color: '#fff',
        borderRadius: '8px',
        textAlign: 'center',
        cursor: 'pointer',
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
    },
    popupButton: {
        marginTop: '1rem',
        padding: '0.6rem 1.2rem',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    popupButtonHover: {
        backgroundColor: '#555',
    },
};

