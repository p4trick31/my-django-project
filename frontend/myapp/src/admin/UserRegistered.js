import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserRegistered = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-users/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  

  // Handle input changes for the new client form


  // Loading, error, or users display
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Separate regular users and client users
  const clientUsers = users.filter(user => user.is_staff);
  const regularUsers = users.filter(user => !user.is_staff);

  return (
    <>
      <style>{`
        /* Main Layout */
        .container {
          width: 90%;
          margin: 0 auto;
          text-align: center;
        }

        /* Form Container (Popup Modal) */
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .form-container input,
        .form-container button {
          padding: 12px;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #ddd;
        }

        .form-container input {
          width: 100%;
          margin-bottom: 10px;
        }

        .form-container button {
          background-color: #007bff;
          color: white;
          cursor: pointer;
          border: none;
        }

        .form-container button:hover {
          background-color: #0056b3;
        }

        /* Popup Overlay */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        /* Table Styling */
        .user-registered-table {
          margin-top: 30px;
          margin-bottom: 30px;
          border-collapse: collapse;
          width: 100%;
          box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
          background-color: white;
        }

        .user-registered-table th,
        .user-registered-table td {
          padding: 15px;
          text-align: left;
          font-size: 14px;
        }

        .user-registered-table th {
          background-color: #007bff;
          color: white;
          font-weight: bold;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .user-registered-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .user-registered-table tr:nth-child(odd) {
          background-color: #f1f1f1;
        }

        .user-registered-table td {
          font-size: 14px;
        }

        .table-scroll {
          max-height: 400px;
          overflow-y: auto;
        }

        /* Buttons */
        .create-client-btn {
          padding: 10px 20px;
          background-color: #28a745;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
          border-radius: 5px;
          margin: 20px 0;
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .create-client-btn:hover {
          background-color: #218838;
        }

        .header-text {
          margin-bottom: 20px;
        }
      `}</style>

      <div className="container">
        <h2 className="header-text">User Registered Dashboard</h2>

    

       

        {/* Regular Users Table */}
        <div className="table-scroll">
          <h3>Regular Users</h3>
          <table className="user-registered-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Position</th>
                <th>App Status</th>
              </tr>
            </thead>
            <tbody>
              {regularUsers.length > 0 ? (
                regularUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.position || 'N/A'}</td>
                    <td>{user.app_status || 'Pending'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Client Users Table */}
        <div className="table-scroll">
  <h3>Client Users</h3>
  <table className="user-registered-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {clientUsers.length > 0 ? (
        clientUsers.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username || 'N/A'}</td>
            <td>{user.first_name || 'N/A'}</td>
            <td>{user.last_name || 'N/A'}</td>
            <td>{user.email || 'N/A'}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5">No client users found.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>


      </div>
    </>
  );
};

export default UserRegistered;
