import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/admin/login/', {
                username: adminUsername,
                password: adminPassword,
            });
            localStorage.setItem('token', response.data.token); // Save token to localStorage

            onClose();
            onLoginSuccess();
            setError('');
            navigate('/admin'); // Redirect to the admin dashboard
        } catch (error) {
            setError('Invalid admin credentials. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.modalBackground}>
            <div style={styles.modalContent}>
                <h2 style={styles.heading}>Admin Login</h2>
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="adminUsername" style={styles.label}>Username</label>
                        <input
                            type="text"
                            id="adminUsername"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="adminPassword" style={styles.label}>Password</label>
                        <input
                            type="password"
                            id="adminPassword"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>Login</button>
                    {error && <p style={styles.error}>{error}</p>}
                </form>
                <button onClick={onClose} style={styles.closeButton}>Close</button>
            </div>
        </div>
    );
};

const styles = {
    modalBackground: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.25)',
        textAlign: 'center',
    },
    heading: {
        marginBottom: '20px',
        fontSize: '28px',
        fontWeight: '600',
        fontFamily: "'Roboto', sans-serif",
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formGroup: {
        width: '100%',
        marginBottom: '15px',
    },
    label: {
        fontSize: '16px',
        marginBottom: '5px',
        color: '#333',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        fontSize: '16px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        backgroundColor: '#f9f9f9',
        transition: 'border-color 0.3s ease',
    },
    inputFocus: {
        borderColor: '#007bff',
    },
    button: {
        padding: '12px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        border: 'none',
        borderRadius: '8px',
        color: '#fff',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        marginTop: '10px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#45a049',
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginTop: '10px',
    },
    closeButton: {
        marginTop: '15px',
        backgroundColor: '#e0e0e0',
        color: '#555',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 15px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default AdminLoginModal;
