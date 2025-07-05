import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Analytics from './admin/AnalyticsDashboard';
import UserRegistered from './admin/UserRegistered';
import PendingDashboard from './admin/PendingDashboard';
import ApproveDashboard from './admin/ApproveDashboard';
import ApplicationList from './admin/ApplicationList';
import MessageDashboard from './admin/MessageDashboard';

const AdminDashboard = ({onLogout}) => {
  const [activePage, setActivePage] = useState('default');
  const [selectedButton, setSelectedButton] = useState('');
  const [hoveredButton, setHoveredButton] = useState(null);
  const [applicationCounts, setApplicationCounts] = useState({});
  const navigate = useNavigate();

  const handleBackHome = () => {
    if (onLogout) {
        onLogout(); // Call onLogout to reset authentication
        navigate('/'); // Redirect to home
    } else {
        console.log("onLogout function is not defined");
        console.log(onLogout); // This will help you see if it's defined
    }
};
  useEffect(() => {
    const fetchApplicationCounts = async () => {
      try {
        // Fetch user data for pending users count
        const userResponse = await axios.get('http://localhost:8000/api/get-users/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const users = userResponse.data;

        // Fetch application data for further processing
        const applicationResponse = await axios.get('http://localhost:8000/api/applications/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const applications = applicationResponse.data;

        // Calculate the approveApplicationCount: count of 'Payment Done' status
        const approveApplicationCount = applications.filter(application => application.status === 'Payment Done').length;
        const unpaidApplicationCount = applications.filter(application => application.payment_status === 'unpaid').length;
        const pendingApplicationCount = applications.filter(application => application.app_status === 'Pending').length;
        const allApplicationCount = applications.filter(application => application).length;

        // Calculate the pendingUsersCount: assuming users with 'pending' status
        const pendingUsersCount = users.filter(user => user.is_staff !== true).length;

        // You can adjust this logic to fetch other counts based on your application data.
        console.log('Pending users count:', pendingUsersCount);

        // Combine the counts into a single object
        const counts = {
          user: pendingUsersCount, // The pending users count we just calculated
          pending: pendingApplicationCount , // This could be different, adjust based on your logic
          approved: approveApplicationCount,
          list: allApplicationCount, // Adjust this to your needs
          inbox: unpaidApplicationCount, // Adjust this to your needs
        };

        setApplicationCounts(counts); // Set the application counts state
      } catch (error) {
        console.error("Error fetching application counts", error);
      }
    };

    fetchApplicationCounts();
  }, []);
  const handleButtonClick = (page) => {
    setActivePage(page);
    setSelectedButton(page);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'analytics':
        return <Analytics />;
      case 'user':
        return <UserRegistered />;
      case 'pending':
        return <PendingDashboard />;
      case 'approved':
        return <ApproveDashboard />;
      case 'list':
        return <ApplicationList />;
      case 'inbox':
        return <MessageDashboard />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar for buttons */}
      <div style={{
        width: '250px',
        backgroundColor: '#343a40',
        padding: '20px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
      }}>
        
        <h2 style={{
          marginBottom: '20px',
          fontSize: '1.5rem',
          borderBottom: '2px solid #007bff',
          paddingBottom: '10px',
          color: 'wheat'
        }}>Admin Dashboard</h2>
        
        <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
          {menuItems.map(({ label, page }) => (
            <li key={page}>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: selectedButton === page ? '#0056b3' : (hoveredButton === page ? '#0069d9' : '#007bff'),
                  color: hoveredButton === page ? 'lightgray' : 'white',
                  borderBottom: selectedButton === page ? '2px solid #0056b3' : '2px solid whitesmoke',
                  boxShadow: selectedButton === page ? '0 5px 15px rgba(0, 86, 179, 0.3)' : '0 2px 5px rgba(0, 123, 255, 0.3)',
                  transform: selectedButton === page ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredButton(page)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleButtonClick(page)}
              >
                {label}
                {/* Count Circle */}
                {applicationCounts[page] !== undefined && (
                  <span style={{
                    backgroundColor: '#343a40',
                    color: '#343a40',
                    borderRadius: '50%',
                    padding: '5px 5px',
                    marginLeft: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    minWidth: '16px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    float: 'right',
                    color: 'whitesmoke'
                  }} 
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {applicationCounts[page]}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={handleBackHome}
          style={{
            padding: '12px 30px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            margin: '10px',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '200px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          Logout
        </button>
      </div>
      

      {/* Center display area */}
      <div style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: '20px'
      }}>
        {renderContent()}
      </div>
      
    </div>
  );
};

const menuItems = [
  { label: 'Analytics', page: 'analytics' },
  { label: 'User Registered', page: 'user' },
  { label: 'Pending Application', page: 'pending' },
  { label: 'Done Application', page: 'approved' },
  { label: 'List of Application', page: 'list' },
  { label: 'Request Payment', page: 'inbox' }
];

// Button styles
const buttonStyle = {
  width: '90%',
  padding: '10px 15px',
  margin: '20px 5px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.3s ease',
  fontSize: '1rem',
  display: 'block',
  outline: 'none',
  borderBottom: '2px solid whitesmoke'
};


export default AdminDashboard;
