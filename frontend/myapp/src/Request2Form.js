
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import logo from './logo.jpg';
import pic from './debesmac.png';


const DisplayPage2 = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('');
    const [showPendingList, setShowPendingList] = useState(false);
    const [approvalSuccess, setApprovalSuccess] = useState(false);
    const [approvedApplicationIds, setApprovedApplicationIds] = useState(
        JSON.parse(localStorage.getItem('approvedApplications')) || []
    );
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/api/application/submitted/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Filter applications into approved and pending based on is_client2_approved status
                const approvedApplications = response.data.filter(application => application.is_approved === true && application.is_client2_approved === true);
                const pendingApplications = response.data.filter(application => application.is_approved === true && application.is_client2_approved === false);

                setApplications({ approved: approvedApplications, pending: pendingApplications });
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
            await axios.post(
                `http://localhost:8000/api/application/get_submitted/${id}/client2_approve/`,
                {}, // Payload
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
    
            // Mark application as approved only after the function call
            const updatedApplications = applications.pending.map(app =>
                app.id === id ? { ...app, is_client2_approved: true, approved_by: clientName } : app
            );
            setApplications({
                ...applications,
                approved: [...applications.approved, updatedApplications.find(app => app.id === id)],
                pending: applications.pending.filter(app => app.id !== id)
            });
    
            // Update local state and storage
            const newApprovedApplicationIds = [...approvedApplicationIds, id];
            setApprovedApplicationIds(newApprovedApplicationIds);
            localStorage.setItem('approvedApplications', JSON.stringify(newApprovedApplicationIds));
    
            setApprovalSuccess(true);
            setTimeout(() => setApprovalSuccess(false), 2000);
        } catch (err) {
            console.error('Error approving application:', err);
            setError('Could not approve application.');
        }
    };
    

    const handleViewChange = (viewType) => {
        setView(viewType);
        if (viewType === 'pending') {
            setShowPendingList(!showPendingList);
        }
    };


    const handleViewForm = (application) => {
        navigate(`/form-view/${application.id}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const filteredApplications = view === 'approved'
    ? applications.approved || []
    : applications.pending || [];
      

    return (
        <div 
        className='pic' 
        style={{ 
            backgroundImage: `url(${pic})`,  // Assuming 'pic' is a variable containing the image URL
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            height: '730px' 
            
        }}
    >
        <div style={{ textAlign: 'center', backdropFilter: 'blur(5px)',  WebkitBackdropFilter: 'blur(5px)', height: '730px',backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className='logo'>
            <img 
                src={logo} 
                alt='Logo' 
                style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'cover', 
                    display: 'flex', 
                    position: 'absolute', 
                    marginLeft: '430px', 
                    marginTop: '50px',
                    border: 'none',
                    borderRadius: '50px' 
                }} 
            />
        </div>
        <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif', fontStyle: 'italic',color:'white' }}>Republic of the Philippines</h5>
        <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif',color:'white' }}>DR. EMILIO B. ESPINOSA, SR. MEMORIAL</h4>
        <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif',color:'white' }}>STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY</h4>
        <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif',color:'white' }}>(Masbate State College)</h5>
        <h4 style={{ margin: '0', padding: '0', color:'white', fontFamily: 'Times New Roman, serif' }}>PRODUCTION AND COMMERCIALIZATION</h4>
        <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif',color:'white' }}>Mandaon, Masbate</h5>
        <h5 style={{ margin: '0', padding: '0', color: 'lightblue', fontFamily: 'Times New Roman, serif' }}>www.debesmscat.edu.ph</h5>
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
    style={{
        padding: '10px 20px', 
        margin: '5px', 
        cursor: 'pointer', 
        backgroundColor: 'goldenrod', 
        border: '2px solid white', 
        borderRadius: '5px', 
        transition: 'background-color 0.3s ease', // Smooth transition for hover effect
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = 'darkgoldenrod'} // Hover effect
    onMouseLeave={(e) => e.target.style.backgroundColor = 'goldenrod'} // Reset to original color
>
    Application Form Approval
</button>

<button 
    onClick={() => handleViewChange('approved')} 
    style={{
        padding: '10px 20px', 
        margin: '5px', 
        cursor: 'pointer', 
        backgroundColor: 'goldenrod', 
        border: '2px solid white', 
        borderRadius: '5px', 
        transition: 'background-color 0.3s ease', // Smooth transition for hover effect
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = 'darkgoldenrod'} // Hover effect
    onMouseLeave={(e) => e.target.style.backgroundColor = 'goldenrod'} // Reset to original color
>
    Application Form Approved
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
    
        {showPendingList && view === 'pending' && (
            filteredApplications.length > 0 ? (
                <div style={{ width: '900px', overflow: 'auto', maxHeight: '400px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: '0', backgroundColor: 'green', zIndex: '10',color:'white' }}>
                            <tr>
                                <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Name</th>
                                <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Date</th>
                                <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.map((application) => (
                                <tr key={application.id} style={{ borderBottom: '2px solid white', border: '2px solid white',color:'white' }}>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{application.name}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{new Date(application.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>
                                        <button
                                            onClick={() => approveApplication(application.id)}
                                            style={{ padding: '5px 10px', margin: '5px', cursor: 'pointer', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '3px' }}
                                            disabled={application.is_client2_approved}
                                        >
                                            {application.is_client2_approved ? 'Approved' : 'Approve'}
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
            <div style={{ width: '900px', overflow: 'auto', maxHeight: '400px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ position: 'sticky', top: '0', backgroundColor: 'green', zIndex: '10',color:'white' }}>
                        <tr>
                            <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Name</th>
                            <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Date</th>
                            <th style={{ borderBottom: '2px solid white', padding: '10px', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((application) => (
                                <tr key={application.id} style={{ borderBottom: '2px solid white', border: '2px solid white',color:'white' }}>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{application.name}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{new Date(application.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>
                                        <button
                                            onClick={() => handleViewForm(application)}
                                            style={{ padding: '5px 10px', margin: '5px', cursor: 'pointer', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '3px' }}
                                        >
                                            View Form
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
    </div>
    </div>
    

    );
};

export default DisplayPage2;




