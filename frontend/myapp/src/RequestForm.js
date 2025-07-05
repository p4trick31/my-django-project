import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import logo from './logo.jpg';
import pic from './debesmac.png';

const styles = {
    container: {
        textAlign: 'center',
        padding: '20px'
    },
    button: {
        padding: '10px 20px',
        margin: '10px',
        cursor: 'pointer',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none'
    },
    popupMessage: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '10px',
        borderRadius: '4px'
    },
    listItem: {
        margin: '10px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    modalOverlay: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000'
    },
    modalContent: {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
        position: 'relative'
    },
    closeButton: {
        marginTop: '20px',
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    disapproveButton: {
        padding: '10px 20px',
        margin: '10px',
        cursor: 'pointer',
        borderRadius: '4px',
        backgroundColor: '#dc3545', // Red color for disapprove
        color: '#fff',
        border: 'none'
    },
    
};

const DisplayPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('');
    const [showPendingList, setShowPendingList] = useState(false);
    const [showApprovedList, setShowApprovedList] = useState(false);
    const [showDisapprovedList, setShowDisapprovedList] = useState(false);
    const [approvalSuccess, setApprovalSuccess] = useState(false);
    const [disapprovalSuccess, setDisapprovalSuccess] = useState(false);
    const [approvedApplicationIds, setApprovedApplicationIds] = useState(
        JSON.parse(localStorage.getItem('approvedApplications')) || []
    );
    const [disapprovedApplicationIds, setDisapprovedApplicationIds] = useState(
        JSON.parse(localStorage.getItem('disapprovedApplications')) || []
    );
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/applications/');
                const allApplications = response.data;
    
                // Filter applications based on their status
             
                
                setApplications(allApplications);
               
              // Assuming you create a new state for disapproved
                console.log("Fetched Applications:", response.data);
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError('Could not fetch applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);
    

    const getClientName = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/get-users/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (response.data && response.data.length > 0) {
                const { first_name, last_name } = response.data[0];
                
                // Simply return the client's full name
                return `${first_name} ${last_name}`;
            } else {
                throw new Error('User data not found.');
            }
        } catch (error) {
            console.error('Error fetching user details:', error.message);
            throw error;  // Propagate the error for handling in the calling function
        }
    };
    
    

    const approveApplication = async (id) => {
        try {
            const clientName = await getClientName();
            // Ensure 'checked_by' is sent in the request body
            await axios.post(
                `http://localhost:8000/api/application/${id}/approve/`,
                { checked_by: 'Person1' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
    
            // Update the application in the frontend state
            const updatedApplications = applications.map(app =>
                app.id === id ? { ...app, is_approved: true, checked_by: clientName } : app
            );
            
            setApplications(updatedApplications);
    
            // Update the list of approved applications
            const newApprovedApplicationIds = [...approvedApplicationIds, id];
            setApprovedApplicationIds(newApprovedApplicationIds);
            localStorage.setItem('approvedApplications', JSON.stringify(newApprovedApplicationIds));
    
            // Show success feedback
            setApprovalSuccess(true);
            setTimeout(() => setApprovalSuccess(false), 2000);
        } catch (err) {
            console.error('Error approving application:', err);
            setError('Could not approve application.');
        }
    };
    
    

    const disapproveApplication = async (id) => {
        try {
            // Retrieve the token from localStorage or a global state
            const token = localStorage.getItem('token'); // or wherever your token is stored
    
            if (!token) {
                throw new Error('User is not authenticated');
            }
            const clientname = await getClientName();
    
            // Send the request with the Authorization header
            await axios.post(
                `http://localhost:8000/api/application/${id}/disapprove/`,
                { disapproved_by: clientname }, // body content
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include the token in the header
                    }
                }
            );
    
            // Update application status
            const updatedApplications = applications.map(app =>
                app.id === id ? { ...app, is_disapproved: true, disapproved_by: clientname } : app
            );
            setApplications(updatedApplications);
    
            const newDisapprovedApplicationIds = [...disapprovedApplicationIds, id];
            setDisapprovedApplicationIds(newDisapprovedApplicationIds);
            localStorage.setItem('disapprovedApplications', JSON.stringify(newDisapprovedApplicationIds));
            setDisapprovalSuccess(true);
            setTimeout(() => setApprovalSuccess(false), 2000);
        } catch (err) {
            console.error('Error disapproving application:', err);
            setError('Could not disapprove application.');
        }
    };
    

    const handleViewChange = (viewType) => {
        setView(viewType);
    
        // Toggle state based on the view type
        if (viewType === 'pending') {
            setShowPendingList(!showPendingList);
            setShowApprovedList(false);
            setShowDisapprovedList(false);
        } else if (viewType === 'approved') {
            setShowApprovedList(!showApprovedList);
            setShowPendingList(false);
            setShowDisapprovedList(false);
        } else if (viewType === 'disapproved') {
            setShowDisapprovedList(!showDisapprovedList);
            setShowPendingList(false);
            setShowApprovedList(false);
            
        }
    };

    const handleViewForm = (application) => {
        navigate(`/form-view/${application.id}`);
    };
 


    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const filteredApplications = applications.filter(application => {
        if (view === 'pending') {
            return (
                !approvedApplicationIds.includes(application.id) &&
                !disapprovedApplicationIds.includes(application.id) &&
                application.app_status === 'Pending'
            );
        } else if (view === 'approved') {
            return approvedApplicationIds.includes(application.id) && application.is_approved === true;
        } else if (view === 'disapproved') {
            return disapprovedApplicationIds.includes(application.id) && application.app_status === 'Disapproved';
        }
        return false; // Default case to ensure no filtering if view type is unhandled
    });
    
    

    return (
        <div 
        className='pic' 
        style={{ 
            backgroundImage: `url(${pic})`,  // Assuming 'pic' is a variable containing the image URL
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            height: '945px' 
            
        }}
    >
        <div style={{ textAlign: 'center',  backdropFilter: 'blur(px)',  WebkitBackdropFilter: 'blur(5px)', height: '940px',backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
         <div className='logo'>
  <img src={logo} alt='Logo' style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'flex', position: 'absolute', marginLeft: '430px', marginTop: '50px',border:'none',borderRadius:'50px' }} />
</div>
        <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif', fontStyle: 'italic',color:'white' }}>Republic of the Philippines</h5>
                    <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif',color:'white' }}>DR. EMILIO B. ESPINOSA, SR. MEMORIAL</h4>
                    <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif',color:'white' }}>STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY</h4>
                    <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif',color:'white' }}>(Masbate State College)</h5>
                    <h4 style={{ margin: '0', padding: '0',color:'white', fontFamily: 'Times New Roman, serif' }}>PRODUCTION AND COMMERCIALIZATION</h4>
                    <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif',color:'white' }}>Mandaon, Masbate</h5>
                    <h5 style={{ margin: '0', padding: '0', color: 'lightblue', fontFamily: 'Times New Roman, serif'}}>www.debesmscat.edu.ph</h5>
                    <h3 style={{ margin: '0', padding: '10px 0', fontFamily: 'Times New Roman, serif',color:'white' }}>APPLICATION FORM</h3>
                    <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif',color:'white' }}>(DEBESMSCAT Vehicle Pass)</h5>
                    <button
                    onClick={() => navigate(-1)} // Navigate back to the previous page
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        marginRight: '20px',
                        backgroundColor: 'red',
                        color: 'white',
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
            onClick={() => handleViewChange('pending')} 
            style={{ padding: '10px 20px', margin: '5px', cursor: 'pointer',marginLeft:'25px',marginTop:'50px',backgroundColor:'goldenrod',border:'2px solid white',borderRadius:'5px' }}
        >
            Application Form Approval
        </button>
        <button 
            onClick={() => handleViewChange('approved')} 
            style={{ padding: '10px 20px', margin: '5px', cursor: 'pointer',backgroundColor:'goldenrod',border:'2px solid white',borderRadius:'5px' }}
        >
            Application Form Approved
        </button>
        <button 
    onClick={() => handleViewChange('disapproved')} 
    style={{ padding: '10px 20px', margin: '5px', cursor: 'pointer', backgroundColor: 'goldenrod', border: '2px solid white', borderRadius: '5px' }}
>
    Application Form Disapproved
</button>
    
        {approvalSuccess && (
            <div style={{ padding: '10px', backgroundColor: '#d4edda', margin: '20px 0', borderRadius: '5px' }}>
                <p>Application Approved Successfully!</p>
                <button 
                    onClick={() => setApprovalSuccess(false)} 
                    style={{ cursor: 'pointer', padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '3px' }}
                >
                    Close
                </button>
            </div>
        )}
        {disapprovalSuccess && (
    <div style={{ padding: '10px', backgroundColor: '#f8d7da', margin: '20px 0', borderRadius: '5px' }}>
        <p>Application Disapproved Successfully!</p>
        <button 
            onClick={() => setDisapprovalSuccess(false)} 
            style={{ cursor: 'pointer', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px' }}
        >
            Close
        </button>
    </div>
)}
        
    
        {showPendingList && view === 'pending' && (
            filteredApplications.length > 0 ? (
                <div style={{ width: '950px', overflow: 'auto', maxHeight: '400px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{backgroundColor:'green',color:'white'}}>
                        <tr>
                            <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Name</th>
                            <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Date</th>
                            <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.map((application) => (
                            <tr key={application.id} style={{ borderBottom: '2px solid #ccc',border:'2px solid white',color:'white' }}>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{application.name}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{new Date(application.date).toLocaleDateString()}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>
                                    <button
                                        onClick={() => approveApplication(application.id)}
                                        style={{ padding: '5px 10px', margin: '5px', cursor: 'pointer', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '3px' }}
                                        disabled={approvedApplicationIds.includes(application.id)}
                                    >
                                        {approvedApplicationIds.includes(application.id) ? 'Approved' : 'Approve'}
                                    </button>
                                    <button
                                        onClick={() => disapproveApplication(application.id)}
                                        style={{ padding: '5px 10px', margin: '5px', cursor: 'pointer', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '3px' }}
                                        disabled={disapprovedApplicationIds.includes(application.id)}
                                    >
                                        {disapprovedApplicationIds.includes(application.id) ? 'Disapproved' : 'Disapprove'}
                                    </button>
                                    <button
                                        onClick={() => handleViewForm(application)}
                                        style={{ padding: '5px 10px', margin: '5px', cursor: 'pointer', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '3px' }}
                                    >
                                        View Form
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 </div>
            ) : (
                <p>No applications are pending for approval.</p>
            )
        )}
    
        {view === 'approved' && (
             <div style={{ width: '950px', overflow: 'auto', maxHeight: '400px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{backgroundColor:'green',color:'white'}}>
                    <tr>
                        <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Name</th>
                        <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Date</th>
                        <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApplications.length > 0 ? (
                        filteredApplications.map((application) => (
                            <tr key={application.id} style={{ borderBottom: '1px solid #ccc', border:'2px solid white',color:'white'}}>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{application.name}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{new Date(application.date).toLocaleDateString()}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>
                                    <button
                                        onClick={() => handleViewForm(application)}
                                        style={{ padding: '5px 10px', margin: '5px', cursor: 'pointer', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '3px' }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ padding: '10px', textAlign: 'left' }}>No approved applications yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
           
        )}
        

{view === 'disapproved' && (
    <div style={{ width: '950px', overflow: 'auto', maxHeight: '400px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{backgroundColor:'green',color:'white'}}>
            <tr>
                <th style={{ borderBottom: '2px solid  white', padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ borderBottom: '2px solid  white', padding: '10px', textAlign: 'left' }}>Date</th>
                <th style={{ borderBottom: '2px solid  white', padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
        </thead>
        <tbody>
            {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                    <tr key={application.id} style={{ borderBottom: '1px solid #ccc', border: '2px solid  white',color:'white' }}>
                        <td style={{ padding: '10px', textAlign: 'left' }}>{application.name}</td>
                        <td style={{ padding: '10px', textAlign: 'left' }}>{new Date(application.date).toLocaleDateString()}</td>
                        <td style={{ padding: '10px', textAlign: 'left' }}>
                            <button
                                onClick={() => handleViewForm(application)}
                                style={{ padding: '5px 10px', margin: '5px', cursor: 'pointer', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '3px' }}
                            >
                                View
                            </button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="3" style={{ padding: '10px', textAlign: 'left' }}>No disapproved applications yet.</td>
                </tr>
            )}
        </tbody>
    </table>
 </div>
)}

    </div>
    </div>   
    );
};

export default DisplayPage;
