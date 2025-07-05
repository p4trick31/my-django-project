import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // New state for email
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const signupData = {
            username,
            email, // Include email in the signup data
            password,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/signup/', signupData);
            if (response && response.data) {
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage('Unexpected response from the server.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.error || 'An error occurred.');
            } else {
                setMessage('Server unavailable. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Sign Up</h2>
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
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
};

export default SignupForm;

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
        textAlign: 'center',
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
    message: {
        textAlign: 'center',
        color: '#333',
        marginTop: '1rem',
    },
};


