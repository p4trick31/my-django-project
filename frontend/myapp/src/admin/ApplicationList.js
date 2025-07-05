import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/applications/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        setApplications(response.data);
        setFilteredApplications(response.data);
      } catch (err) {
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredList = applications.filter(app =>
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      (app.address && app.address.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredApplications(filteredList);
  };

  const handleDateFilter = (filter) => {
    setDateFilter(filter);
    let filtered = [...applications];
    const today = new Date();

    switch (filter) {
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

  const handleViewApplication = (app) => {
    navigate(`/app-view/${app.id}`);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Application List Dashboard</h2>
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
        <input
          type="text"
          placeholder="Search by Name or Address"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            flex: 1,
            marginRight: '20px',
          }}
          
        />
        
        <select
          value={dateFilter}
          onChange={(e) => handleDateFilter(e.target.value)}
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
          
        {filteredApplications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <>
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid #ddd',
                padding: '10px',
                fontWeight: 'bold',
                backgroundColor: '#f9f9f9',
              }}
            >
              <p style={{ margin: 0, flex: 1, color: '#666'}}>Name</p>
              <p style={{ margin: 0, flex: 1, color: '#666'}}>Address</p>
              <p style={{ margin: 0, flex: 1, color: '#666'}}>Status</p>
              <p style={{ margin: 0, flex: 1, color: '#666'}}>Release Status</p>
              <p style={{ margin: 0, flex: 1, color: '#666'}}>Action</p>
            </div>
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
                    margin: '5px 0',
                  }}
                >
                  <p style={{ color: 'green', fontSize: '14px', fontWeight: 'bold', margin: 0, flex: 1 }}>{app.name}</p>
                  <p style={{ color: '#666', fontSize: '14px', margin: 0, flex: 1 }}>{app.address}</p>
                  <p
  style={{
    color: app.app_status === 'Done' ? '#28a745' :  app.app_status === 'Disapproved' ? 'red' : '#fd7e14', // Green for 'Done', Orange for 'Pending'
    fontSize: '14px',
    fontWeight: 'bold',
    margin: 0,
    flex: 1,
  }}
>
  {app.app_status === 'Done' ? 'Completed' : app.app_status === 'Disapproved' ? 'Disapproved': 'Pending'}
</p>

                  <p style={{ color: '#666', fontSize: '14px', margin: 0, flex: 1 }}>{app.release_status || 'N/A'}</p>
                  <button
                    onClick={() => handleViewApplication(app)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#3498db',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '40px',
                      width: '70px'
                    }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedApplication && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <h4>Application Details</h4>
          <p><strong>Username:</strong> {selectedApplication.username}</p>
          <p><strong>Name:</strong> {selectedApplication.name}</p>
          <p><strong>Status:</strong> {selectedApplication.app_status}</p>
          <p><strong>Release Status:</strong> {selectedApplication.release_status || 'N/A'}</p>
          <button
            onClick={() => setSelectedApplication(null)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '10px',
            }}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
