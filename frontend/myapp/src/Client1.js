import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './logo.jpg';

const Person1Page = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [approvalStatus, setApprovalStatus] = useState({});
    const [notification, setNotification] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for success modal
    const [disapprovalStatus, setDisapprovalStatus] = useState({});
    const navigate = useNavigate();

    const fetchApplicationData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8000/api/application/', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            const filteredApplications = response.data.filter(app => !app.submitted);
            setApplications(filteredApplications);

            // Fetch approval and disapproval status for applications
            const statusMap = {};
            const disapprovalMap = {};
            const statusPromises = response.data.map(async (app) => {
                try {
                    const statusResponse = await axios.get(`http://localhost:8000/api/application/${app.id}/approve/`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    statusMap[app.id] = statusResponse.data.is_approved;

                    const disapprovalResponse = await axios.get(`http://localhost:8000/api/application/${app.id}/disapprove/`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    disapprovalMap[app.id] = disapprovalResponse.data.is_disapproved;
                } catch (error) {
                    console.error(`Error fetching status for application ID ${app.id}:`, error.message);
                    statusMap[app.id] = false; // Default to not approved
                    disapprovalMap[app.id] = false; // Default to not disapproved
                }
            });
            await Promise.all(statusPromises);
            setApprovalStatus(statusMap);
            setDisapprovalStatus(disapprovalMap); // Set disapproval status
        } catch (error) {
            console.error('Error fetching application data:', error.message);
            setError('Failed to fetch applications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicationData();
    }, []);
   
    
    
    const handleViewFormClick = async (applicationId) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:8000/api/application/${applicationId}/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setSelectedApplication(response.data);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error fetching application details:', error.message);
            setError('Failed to fetch application details.');
        } finally {
            setLoading(false);
        }
    };
    

    const submitToPerson2 = async (applicationId) => {
        const applicationData = applications.find(app => app.id === applicationId);
    
        if (!applicationData) {
            setError('Application not found.');
            return;
        }
    
        console.log(`Attempting to submit application:`, applicationData); // Debug log
    
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authorization token found. Please log in again.');
            return;
        }
    
        try {
            setLoading(true);
            const response = await axios.post(
                `http://localhost:8000/api/application/submit_to_person2/${applicationId}/`,
                {
                    // You can send relevant application fields if required
                    // For example, you might send applicationData as the payload
                    name: applicationData.name, // Modify based on what your API expects
                    address: applicationData.address,
                    contact: applicationData.contact,
                    // Include other necessary fields as required by your backend
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
    
            // Inside the component, after submission success
            if (response.status === 200) {
                console.log('Application submitted to Person 2 successfully:', response.data);
                setNotification('Application successfully submitted to Person 2.');
                setShowSuccessModal(true);
                navigate('/person2');

                setApplications(prev => prev.filter(app => app.id !== applicationId));

                
    
                // Save the application ID and submitted status to local storage
                localStorage.setItem('submittedApplicationId', applicationId);
                localStorage.setItem('submittedStatus', JSON.stringify({
                    id: applicationId,
                    submitted: true
                }));
    
                // Update applications to mark the submitted application
                localStorage.setItem('submissionNotification', 'Application successfully submitted to Person 2.');

                // Update applications to mark the submitted application
                setApplications(prev =>
                    prev.map(app =>
                        app.id === applicationId ? { ...app, completed: true } : app
                    )
                );
            }
    
        } catch (error) {
            console.error('Error submitting application to Person 2:', error.response?.data || error.message);
            setError('Failed to submit application to Person 2: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };
    

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedApplication(null);
    };
    const handleViewForm = (application) => {
        navigate(`/form-view/${application.id}`);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setSelectedApplication(null); // Clear selected application if needed
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
            <h3 style={{ textAlign: 'center', fontSize: '24px', color: 'green' }}>Checking Your Application</h3>
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
                                    <p style={{color: 'orange',  margin: '5px 0px'}}><strong style={{color: 'gray'}}>Application Status:</strong> {application.status}</p>

                                    {application.submitted ? (
                                        <p style={{ color: 'green' }}>Transaction completed with Person 1.</p>
                                    ) : (
                                        <>
                                        
                                           

                                            <p style={{ color: 'gray', fontFamily: 'serif', fontSize: '18px', textAlign: 'center', margin: '15px', fontWeight: 'bold', padding: '20px 5px', border: '1px solid #333', borderRadius: '10px'}}>
    {approvalStatus[application.id]
        ? <div>
            <span style={{ color: '#007bff', fontFamily: 'arial' }}>Hi {application.name}</span>, Thank you for your patience. Your application has been approved!
          </div>
        : disapprovalStatus[application.id]
        ? 'Unfortunately, your application has been disapproved. Please contact support for further details.'
        : application.name
        ? <div>
        <span style={{ color: '#007bff', fontFamily: 'arial' }}>Hi {application.name}</span>, your request form is submitted. Wait for the approval by Richard Sales. By inspecting your submitted application data.
      </div>
        : 'Your request form is submitted. Wait for the approval of stakeholders.'}
</p>
<button
                    onClick={() => navigate('/steps')} // Navigate back to the previous page
                    style={{
                        marginTop: '20px',
                        marginLeft: '20px',
                        padding: '10px 20px',
                        backgroundColor: 'red',
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
                                                <button onClick={() => submitToPerson2(application.id)} style={submitToPerson2ButtonStyle}>
                                                    Submit to Person 2
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

            {showSuccessModal && (
                <div style={popupOverlayStyle}>
                    <div style={popupContentStyle}>
                        <h3>Success!</h3>
                        <p>Your application has been successfully submitted to Person 2.</p>
                        <button onClick={handleCloseSuccessModal} style={popupButtonStyle}>Close</button>
                    </div>
                </div>
            )}

            {notification && <div style={{ color: 'green', fontSize: '18px', marginTop: '20px' }}>{notification}</div>}
        </div>
    );
};

// Styles
const containerStyle = { padding: '80px 20px', fontFamily: 'Arial, sans-serif', background: 'white' };
const messageBoxStyle = {
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease-in-out',
};

const submitToPerson2ButtonStyle = {
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

export default Person1Page;

