import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientLogin = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            username,
            password,
        };
        console.log('Login Data:', loginData);

        try {
            const response = await axios.post('http://localhost:8000/api/loginClient/', loginData);
            
            if (response.data && response.data.access) {
                // Save the tokens in local storage
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
                

                

                setMessage(response.data.message);
                onLoginSuccess();

                // Navigate to the appropriate client dashboard
                if (username === 'richardsales') { // Replace with actual username check
                    navigate('/clientdashboard'); // Redirect to Client 1's dashboard
                } else if (username === 'nonalyn') { // Replace with actual username check
                    navigate('/client2/dashboard'); // Redirect to Client 2's dashboard
                } else {
                    setMessage('User type not recognized');
                }
            } else {
                setMessage('Unexpected response from server');
            }
        } catch (error) {
            console.log('Error during login:', error);
            if (error.response) {
                console.log('Server response:', error.response.data);
                setMessage(error.response.data?.error || 'Login failed');
            } else if (error.request) {
                setMessage('No response from server. Please try again.');
            } else {
                setMessage('Network error or server is unreachable.');
            }
        }
    };

    return (
        <div style={styles.container}>
        <h2 style={styles.heading}>Client Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
                <label htmlFor="username" style={styles.label}>Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
            </div>
            <button type="submit" style={styles.button}>Login</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
    </div>
);
};

// Inline styles for the components
const styles = {
container: {
    width: '90%',
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
},
heading: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    marginBottom: '20px',
},
form: {
    display: 'flex',
    flexDirection: 'column',
},
formGroup: {
    marginBottom: '15px',
},
label: {
    display: 'block',
    fontSize: '16px',
    marginBottom: '5px',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
},
input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
},
button: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '15px',
    transition: 'background-color 0.3s ease',
    color: '#fff',
        backgroundColor: '#007bff',
},
buttonHover: {
    backgroundColor: 'blue',
},
message: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#4CAF50',
    fontSize: '18px',
},
};



export default ClientLogin;

