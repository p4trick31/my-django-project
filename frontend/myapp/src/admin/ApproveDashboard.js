import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ApproveDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // New state for date filter
  const navigate = useNavigate(); 

  // Fetch the list of applications from the backend
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/applications/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });

        // Filter applications with app_status set to 'Done'
        const doneApplications = response.data.filter(app => app.app_status === 'Done');
        setApplications(doneApplications);
        setFilteredApplications(doneApplications); // Initialize with all applications
      } catch (err) {
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Handle date filtering
  useEffect(() => {
    const filterApplicationsByDate = () => {
      const today = new Date();
      let filtered = [...applications];

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(app => new Date(app.date).toLocaleDateString() === today.toLocaleDateString());
          break;
        case 'lastWeek':
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          filtered = filtered.filter(app => new Date(app.date) >= lastWeek);
          break;
        case 'lastMonth':
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(app => new Date(app.date) >= lastMonth);
          break;
        case 'lastYear':
          const lastYear = new Date(today);
          lastYear.setFullYear(today.getFullYear() - 1);
          filtered = filtered.filter(app => new Date(app.date) >= lastYear);
          break;
        default:
          break;
      }
      setFilteredApplications(filtered);
    };

    filterApplicationsByDate(); // Trigger filtering whenever dateFilter changes
  }, [dateFilter, applications]); // Dependency array includes applications and dateFilter

  // Handle searching by application name (real-time search)
  useEffect(() => {
    const filteredApplicationsByName = applications.filter(app =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplications(filteredApplicationsByName);
  }, [searchQuery, applications]); // Trigger search when searchQuery changes

  // Handle selecting an application to view its details
  const handleViewApplication = (app) => {
    navigate(`/app-view/${app.id}`);
};

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Approved Dashboard</h2>
      {loading && <p>Loading applications...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search and Filter Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        width: '600px',
        margin: '0 auto',
      }}>
        {/* Search by Name */}
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            flex: 1,
            marginRight: '20px', // Space between search and filter
          }}
        />
        
        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            flex: 1,
            marginLeft: '10px',
          }}
        >
          <option value="">Filter by Date</option>
          <option value="today">Today</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>

      <div
        style={{
          width: '1000px',
          maxWidth: '100%',
          margin: '0 auto',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          height: '500px',
        }}
      >
        {filteredApplications.length === 0 && (
          <p
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: '#fff',
              zIndex: 1,
              padding: '10px',
              borderBottom: '1px solid #ddd',
              fontWeight: 'bold',
              color: 'red',
            }}
          >
            No approved applications found.
          </p>
        )}

        {filteredApplications.length > 0 ? (
          <div>
            <h4
              style={{
                textAlign: 'left',
                textDecoration: 'underline',
                fontSize: '25px',
                margin: '10px',
                color: '#666',
              }}
            >
              Completed Applications
            </h4>

            {/* Header Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid #ddd',
                padding: '10px',
                fontWeight: 'bold',
                position: 'sticky',
                marginBottom: '10px',
                top: 0,
                zIndex: 2,
                gap: '10px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <p style={{ margin: 0, flex: 1, color: '#666' }}>Sticker No.</p>
              <p style={{ margin: 0, flex: 1, color: '#666' }}>Name</p>
              <p style={{ margin: 0, flex: 1, color: '#666' }}>Date</p>
              <p style={{ margin: 0, flex: 1, color: '#666' }}>Status</p>
              <p style={{ margin: 0, flex: 1, color: '#666' }}>Payment Status</p>
              <p style={{ margin: 0, flex: 1, color: '#666' }}>Action</p>
            </div>

            {/* Scrollable Application List */}
            <div
              style={{
                maxHeight: '400px',
                overflowY: 'auto',
                marginTop: '10px',
              }}
            >
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'left',
                    justifyContent: 'space-between',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    margin: '5px 0',
                  }}
                >
                  <p style={{ color: 'green', fontSize: '14px', fontWeight: 'bold', marginLeft: '0px', flex: 1 }}><strong></strong> {app.sticker_number}</p>
                  <p style={{ color: '#666', fontSize: '14px', margin: 0, flex: 1 }}>{app.name}</p>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, flex: 1 }}>{new Date(app.date).toLocaleDateString()}</p>
                  <p style={{ color: '#28a745', fontSize: '14px', fontWeight: 'bold', margin: 0, flex: 1 }}>
                    {app.app_status === 'Done' ? 'Completed' : 'Pending'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, flex: 1 }}>{app.payment_status}</p>
                  <button
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                      margin: '5px 20px',
                    }}
                    onClick={() => handleViewApplication(app)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No applications found.</p>
        )}
      </div>

      {/* View Application Details */}
      {selectedApplication && (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginTop: '20px',
          }}
        >
          <h4>Application Details</h4>
          <p><strong>Name:</strong> {selectedApplication.name}</p>
          <p><strong>Address:</strong> {selectedApplication.address}</p>
          <p><strong>Contact:</strong> {selectedApplication.contact}</p>
          <p><strong>Vehicle Type:</strong> {selectedApplication.vehicle_type}</p>
          <p><strong>Plate Number:</strong> {selectedApplication.plate_number}</p>
          <p><strong>Chassis No:</strong> {selectedApplication.chassis_no}</p>
          <p><strong>Model Make:</strong> {selectedApplication.model_make}</p>
          <p><strong>Engine No:</strong> {selectedApplication.engine_no}</p>
        </div>
      )}
    </div>
  );
};

export default ApproveDashboard;
