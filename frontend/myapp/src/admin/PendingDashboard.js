import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicationStatusForm = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');  // Default filter to "all"

  // Fetch the list of applications
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/applications/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });

        // Filter applications based on the selected filter status and search query
        const filteredApps = response.data.filter(app => {
          const isFilteredStatus =
            (filterStatus === 'all' || app.status === filterStatus) &&
            app.status !== 'Payment Done' && app.status !== 'Disapproved'; // Exclude "Payment Done" status

          const matchesSearchQuery = app.name.toLowerCase().includes(searchQuery.toLowerCase());

          return isFilteredStatus && matchesSearchQuery;
        });

        setApplications(filteredApps);
      } catch (err) {
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [searchQuery, filterStatus]);

  // Handle selecting an application to view its details
  const handleViewApplication = (appId) => {
    const app = applications.find(application => application.id === appId);
    setSelectedApplication(app);
    setError(null);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Pending Application Status</h2>
      {loading && <p>Loading applications...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search Bar and Filter Status Container */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        width: '600px',
      }}>
        {/* Search Bar */}
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

        {/* Filter Status */}
        <div style={{ height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '5px 10px',
              fontSize: '14px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              height: '30px',
            }}
          >
            <option value="all">All</option>
            <option value="Checking Application">Checking Application</option>
            <option value="Waiting Approval">Waiting Approval</option>
            <option value="Proceed to Payment">Payment Pending</option>
          </select>
        </div>
        <h4 style={{ margin: '5px', color: '#666' }}>App Status</h4>
      </div>

      {/* Main box container */}
      <div style={{
        width: '1000px',
        maxWidth: '100%',
        overflowY: 'auto', // Add scroll bar if content exceeds height
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxHeight: '800px',
        height: '500px', // Make the container scrollable
      }}>
        {/* "No results found" message sticky */}
        {applications.length === 0 && (
          <p style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#fff',
            zIndex: 1,
            padding: '10px',
            borderBottom: '1px solid #ddd',
            fontWeight: 'bold',
            color: 'red',
          }}>
            No results found.
          </p>
        )}

        {applications.length > 0 ?
         (
          
          <div style={{ width: '100%' }}>
             <h4
              style={{
                textAlign: 'left',
                textDecoration: 'underline',
                fontSize: '25px',
                margin: '10px',
                color: '#666',
              }}
            >
              Processing Applications
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr',  // For five columns
              gap: '10px',
              fontWeight: 'bold',
              borderBottom: '1px solid #ddd',
              paddingBottom: '10px',
              marginBottom: '10px',
              color: '#666',
              backgroundColor: '#f9f9f9',
              padding: '10px',
            }}>
              <span>ID</span>
              <span>Name</span>
              <span>Date</span>
              <span>App Status</span>
            </div>

            {applications.map((app) => (
              <div key={app.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr', // Ensure it aligns with the header
                gap: '10px',
                borderBottom: '1px solid #ddd',
                padding: '10px',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                margin: '5px 0',
              }}>
                <span>{app.id}</span>
                <span>{app.name}</span>
                <span>{new Date(app.date).toLocaleDateString()}</span>
                <span
                  style={{
                    color:
                      app.status === 'Checking Application'
                        ? '#f39c12'
                        : app.status === 'Waiting Approval'
                          ? '#3498db'
                          : '#2ecc71',
                  }}
                >
                  {app.status}
                </span>
               
              </div>
            ))}
          </div>
        ) : (
          <p>No applications found.</p>
        )}
      </div>

      {selectedApplication && (
        <div style={{ marginTop: '20px', border: '1px solid #000', padding: '20px', backgroundColor: '#f7f7f7' }}>
          <h3>Selected Application Details</h3>
          <p><strong>ID:</strong> {selectedApplication.id}</p>
          <p><strong>Name:</strong> {selectedApplication.name}</p>
          <p><strong>Status:</strong> {selectedApplication.status}</p>
          <p><strong>Date:</strong> {new Date(selectedApplication.date).toLocaleDateString()}</p>
          {/* Add other relevant fields as needed */}
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusForm;
