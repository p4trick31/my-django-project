import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './logo.jpg';

const Person2Page = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [approvalStatus, setApprovalStatus] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicationData = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await axios.get('http://localhost:8000/api/application/get_submitted', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setApplications(response.data);

                const statusMap = {};
                const statusPromises = response.data.map(async (app) => {
                    try {
                        const statusResponse = await axios.get(`http://localhost:8000/api/application/get_submitted/${app.id}/client2_approve/`, {
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                        });
                        statusMap[app.id] = statusResponse.data.is_client2_approved;
                    } catch (statusError) {
                        console.error(`Error fetching approval status for application ID ${app.id}:`, statusError.message);
                        statusMap[app.id] = app.is_client2_approved;
                    }
                });
                await Promise.all(statusPromises);
                setApprovalStatus(statusMap);
            } catch (error) {
                console.error('Error fetching application data:', error.message);
                setError('Failed to fetch applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchApplicationData();
    }, []);

    const handleViewForm = (application) => {
        navigate(`/form-view/${application.id}`);
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedApplication(null);
    };

    const handleProceedToPayment = async (applicationId) => {
        try {
            // Send the POST request to update the application status to 'Proceed to Payment'
            const response = await axios.post(`http://localhost:8000/api/application/${applicationId}/proceed-to-payment/`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            // Log response or handle success
            console.log(response.data.message);
    
            // Proceed to the payment page
            console.log(`Proceeding to payment for application ID ${applicationId}`);
            navigate(`/paymentpage/${applicationId}`);  // Redirect to payment page
        } catch (error) {
            console.error('Error updating application status:', error.response ? error.response.data : error.message);
            // Optionally display an error message
        }
    };
    

    return (
        <div style={containerStyle}>
              <div className='logo'>
  <img src={logo} alt='Logo' style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'flex', position: 'absolute', marginLeft: '390px', marginTop: '30px' }} />
</div>
            <div style={{ textAlign: 'center', marginTop: 'px',backgroundColor:'white'  }}>
                <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif', fontStyle: 'italic', marginTop: '20px' }}>
                    Republic of the Philippines
                </h4>
                <h3 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>
                    DR. EMILIO B. ESPINOSA, SR. MEMORIAL
                </h3>
                <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>
                    STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY
                </h4>
                <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>
                    (Masbate State College)
                </h4>
                <h4 style={{ margin: '0', padding: '0', color: 'green', fontFamily: 'Times New Roman, serif' }}>
                    PRODUCTION AND COMMERCIALIZATION
                </h4>
                <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>
                    Mandaon, Masbate
                </h5>
                <h5 style={{ margin: '0', padding: '0', color: 'lightblue', fontFamily: 'Times New Roman, serif' }}>
                    www.debesmscat.edu.ph
                </h5>
                <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>
                    (DEBESMSCAT Vehicle Pass)
                </h4>
            </div>
          
            <div style={{ backgroundColor: 'silver', padding: '20px 30px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '700px', margin: 'auto'}}>
            <h3 style={{ textAlign: 'center', fontSize: '24px', color: 'green' }}>Waiting for Approval</h3>
            {loading ? (
                <p>Loading application data...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <div>
                    {applications.length > 0 ? (
                        applications.map((application) => (
                            <div
                            key={application.id}
                            style={{
                                ...messageBoxStyle,
                                backgroundColor: application.submitted ? '#d3d3d3' : '#f0f8ff', // Change color if submitted
                            }}
                            >
                                 <h4 style={{color: '#333'}}>Applicant Name: {application.name}</h4>
                                    <p style={{color: 'gray', margin: '5px 0px'}}><strong>Date Submitted:</strong> {application.date}</p>
                                    <p style={{color: 'green',  margin: '5px 0px'}}><strong style={{color: 'gray'}}>Application Status:</strong> {application.status}</p>
                                {application.submitted ? (
                                    <p style={{ color: 'green' }}>Transaction completed with Person 2.</p>
                                ) : (
                                    <>
                                       
                                       <p style={{ color: 'gray', fontFamily: 'serif', fontSize: '18px', textAlign: 'center', margin: '15px', fontWeight: 'bold', padding: '20px 5px', border: '1px solid #333', borderRadius: '10px'}}>
                                            {approvalStatus[application.id]
                                                ?  <div>
                                                <span style={{ color: '#007bff', fontFamily: 'arial' }}>Hi {application.name}</span>, Thank you for your patience. Your application has been approved!
                                              </div>
                                                :  application.name 
                                                ? <div>
                                                <span style={{ color: '#007bff', fontFamily: 'arial' }}>Hi {application.name}</span>, your request form is submitted to Nonalyn Tombocon. Wait for the approval upon in several hours.
                                              </div>
                                              
                                                : 'Your request form is submitted. Wait for the approval of stakeholders.'}
                                        </p>
                                        <button
                    onClick={() => navigate('/steps')} // Navigate back to the previous page
                    style={{
                        marginTop: '20px',
                        marginLeft: '20px',
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        color: 'black',
                        border: '1px solid black',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontFamily: 'Times New Roman, serif',
                        fontSize: '18px'
                    }}
                >
                    Back
                </button>
                                        <button
                                                onClick={() => handleViewForm(application)}
                                                style={{
                                                    padding: '10px 20px',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    fontSize: '16px',
                                                    cursor: 'pointer',
                                                    margin: '25px',
                                                    transition: 'background-color 0.3s ease',
                                                }}
                                            >
                                                View Form
                                            </button>

                                        {approvalStatus[application.id] && (
                                            <button
                                                onClick={() => handleProceedToPayment(application.id)}
                                                style={proceedToPaymentButtonStyle}
                                            >
                                                Proceed to Payment
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No applications found.</p>
                    )}
                </div>
            )}
            </div>

           

            
        </div>
    );
};

// Styles
const containerStyle = { padding: '80px 20px', fontFamily: 'Arial, sans-serif', background: 'white' };
const messageBoxStyle = { padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' };
const viewFormButtonStyle = { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' };
const proceedToPaymentButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};
const popupOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const popupContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const popupButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};
export default Person2Page;
