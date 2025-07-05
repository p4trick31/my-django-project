import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const AnalyticsDashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [userStatusData, setUserStatusData] = useState(null); // New state for user status
  const [vehicleTypeData, setVehicleTypeData] = useState(null); // New state for vehicle type data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalApplications, setTotalApplications] = useState(0); // Total applications state
  const [totalApproved, setTotalApproved] = useState(0); // Total approved applications state
  const [totalDisapproved, setTotalDisapproved] = useState(0); // Total disapproved applications state
  const [totalUsers, setTotalUsers] = useState(0); // Total users state
  const [totalPendingUsers, setTotalPendingUsers] = useState(0); // Total pending users state
  const [totalDoneUsers, setTotalDoneUsers] = useState(0); // Total done users state
  const [vehicleTypesCount, setVehicleTypesCount] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/applications/');
        const applications = response.data;

        // Count the approved and disapproved applications
        const approvedCount = applications.filter(app => app.is_approved).length;
        const disapprovedCount = applications.filter(app => app.is_disapproved).length;
        const totalAppCount = approvedCount + disapprovedCount;

        // Set the application status data
        const formattedAppStatusData = {
          labels: ['Approved Applications', 'Disapproved Applications'],
          datasets: [
            {
              label: 'Application Status',
              data: [approvedCount, disapprovedCount],
              backgroundColor: ['#4da6ff', '#ff4d4d'], // Blue for approved, Red for disapproved
              borderColor: ['#000000', '#000000'], // Black border for contrast
              borderWidth: 2,
              hoverBorderWidth: 4,
              hoverBackgroundColor: ['#80c1ff', '#ff8080'], // Lighter shades on hover
            },
          ],
        };

        setTotalApplications(totalAppCount);
        setTotalApproved(approvedCount);
        setTotalDisapproved(disapprovedCount);
        setChartData(formattedAppStatusData);

        // Fetch users and count based on user status
        const userResponse = await axios.get('http://localhost:8000/api/get-users/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const users = userResponse.data;

        const pendingUsersCount = users.filter(user => user.app_status === 'Pending').length;
        const doneUsersCount = users.filter(user => user.app_status === 'Done').length;
        const totalUserCount = users.length;

        // Set the user status data
        const formattedUserStatusData = {
          labels: ['Pending Users', 'Done Users'],
          datasets: [
            {
              label: 'User Status',
              data: [pendingUsersCount, doneUsersCount],
              backgroundColor: ['#ffcc00', '#28a745'], // Yellow for pending, Green for done
              borderColor: ['#000000', '#000000'],
              borderWidth: 2,
              hoverBorderWidth: 4,
              hoverBackgroundColor: ['#ffeb99', '#66c2a4'],
            },
          ],
        };

        setTotalUsers(totalUserCount);
        setTotalPendingUsers(pendingUsersCount);
        setTotalDoneUsers(doneUsersCount);
        setUserStatusData(formattedUserStatusData);

        // Fetch vehicle type data
        const vehicleResponse = await axios.get('http://localhost:8000/api/applications/');
        const vehicles = vehicleResponse.data;

        // Count vehicles by type
        const vehicleTypes = applications.reduce((acc, vehicle) => {
          acc[vehicle.vehicle_type] = (acc[vehicle.vehicle_type] || 0) + 1;
          return acc;
        }, {});
        setVehicleTypesCount(vehicleTypes);

        setVehicleTypeData({
          labels: Object.keys(vehicleTypes),
          datasets: [
            {
              label: 'Vehicle Type Distribution',
              data: Object.values(vehicleTypes),
              backgroundColor: ['#ff8c00', '#7c4dff', '#00bcd4', '#ff1744'],
              borderColor: ['#000000', '#000000', '#000000', '#000000'],
              borderWidth: 2,
              hoverBorderWidth: 4,
              hoverBackgroundColor: ['#ffb84d', '#b39ddb', '#4dd0e1', '#ff5c8d'],
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Could not fetch applications or users.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div
      style={{
        marginTop: '-200px',
        textAlign: 'center',
        padding: '30px',
        backgroundColor: '#f4f4f4',
        borderRadius: '10px',
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Application, User, and Vehicle Type Status</h2>
  
      {/* Container for Pie Charts */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row', // Change to row for horizontal layout
          justifyContent: 'space-around', // Distribute space between charts
          alignItems: 'center',
          gap: '20px', // Space between the pie charts
          width: '100%',
          maxWidth: '1200px', // To maintain reasonable size on large screens
          margin: '0 auto', // Center the container
        }}
      >
        {/* Application Status Pie Chart */}
        <div
          style={{
            width: '300px', // Same width for all pie charts
            height: '300px', // Same height for all pie charts
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '10px',
            position: 'relative',
          }}
        >
          
          {loading ? (
            <p style={{ color: '#000', fontSize: '18px' }}>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      font: {
                        size: 14,
                      },
                      color: '#000',
                    },
                  },
                  tooltip: {
                    backgroundColor: '#f4f4f4',
                    titleColor: '#000',
                    bodyColor: '#000',
                    borderColor: '#000',
                    borderWidth: 1,
                    callbacks: {
                      label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                  datalabels: {
                    display: true,
                    formatter: (value, context) => {
                      const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${percentage}%`;
                    },
                    color: '#000',
                    font: {
                      weight: 'bold',
                      size: 14,
                    },
                  },
                },
              }}
             
            />
            
          )}
          <h4 style={{ color: 'brown', marginBottom: '20px' }}>Application Submitted Status</h4>
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px' }}>
  <h4 style={{ color: 'green', textAlign: 'left' }}>Application Statistics:</h4>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    {[...Array(2)].map((_, index) => (
      <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
        {[
          { label: 'Submitted:', value: totalApplications },
          { label: 'Approved:', value: totalApproved },
          { label: 'Disapproved:', value: totalDisapproved }
        ]
          .slice(index * Math.ceil(3 / 2), (index + 1) * Math.ceil(3 / 2))
          .map((stat) => (
            <div key={stat.label} style={{ padding: '10px', backgroundColor: 'gray', borderRadius: '5px', width: '170px', height: '40px' }}>
              <div style={{ fontWeight: 'bold', color: 'maroon' }}>{stat.label}</div>
              <div style={{ color: 'white', fontSize: '18px' }}>{stat.value}</div>
            </div>
          ))}
      </div>
    ))}
  </div>
</div>

          
        </div>
  
        {/* User Status Pie Chart */}
        <div
          style={{
            width: '300px', // Same width for all pie charts
            height: '300px', // Same height for all pie charts
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '10px',
            position: 'relative',
          }}
        >
          
          {loading ? (
            <p style={{ color: '#000', fontSize: '18px' }}>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <Pie
              data={userStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      font: {
                        size: 14,
                      },
                      color: '#000',
                    },
                  },
                  tooltip: {
                    backgroundColor: '#f4f4f4',
                    titleColor: '#000',
                    bodyColor: '#000',
                    borderColor: '#000',
                    borderWidth: 1,
                    callbacks: {
                      label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                  datalabels: {
                    display: true,
                    formatter: (value, context) => {
                      const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${percentage}%`;
                    },
                    color: '#000',
                    font: {
                      weight: 'bold',
                      size: 14,
                    },
                  },
                },
              }}
             
            />
          )}
          <h4 style={{ color: 'brown', marginBottom: '20px' }}>User Status</h4>
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px' }}>
  <h4 style={{ color: 'green', textAlign: 'left' }}>User Statistics:</h4>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    {[...Array(2)].map((_, index) => (
      <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
        {[
          { label: 'Total Users:', value: totalUsers },
          { label: 'Pending Users:', value: totalPendingUsers },
          { label: 'Done Users:', value: totalDoneUsers }
        ]
          .slice(index * Math.ceil(3 / 2), (index + 1) * Math.ceil(3 / 2))
          .map((stat) => (
            <div key={stat.label} style={{ padding: '10px', backgroundColor: 'gray', borderRadius: '5px', width: '170px', height: '40px' }}>
              <div style={{ fontWeight: 'bold', color: 'maroon' }}>{stat.label}</div>
              <div style={{ color: 'white', fontSize: '18px' }}>{stat.value}</div>
            </div>
          ))}
      </div>
    ))}
  </div>
</div>


        </div>
  
        {/* Vehicle Type Distribution Pie Chart */}
        <div
          style={{
            width: '300px', // Same width for all pie charts
            height: '300px', // Same height for all pie charts
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '10px',
            position: 'relative',
          }}
        >
          
          {loading ? (
            <p style={{ color: '#000', fontSize: '18px' }}>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <Pie
              data={vehicleTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      font: {
                        size: 14,
                      },
                      color: '#000',
                    },
                  },
                  tooltip: {
                    backgroundColor: '#f4f4f4',
                    titleColor: '#000',
                    bodyColor: '#000',
                    borderColor: '#000',
                    borderWidth: 1,
                    callbacks: {
                      label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                  datalabels: {
                    display: true,
                    formatter: (value, context) => {
                      const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${percentage}%`;
                    },
                    color: '#000',
                    font: {
                      weight: 'bold',
                      size: 14,
                    },
                  },
                },
              }}
              
            />
            
          )}
          <h4 style={{ color: 'brown', marginBottom: '20px' }}>Vehicle Type Distribution</h4>
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px', width: '300px'}}>
  <h4 style={{ color: 'green', textAlign: 'left' }}>Total Number of Each Vehicle Type:</h4>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    {[...Array(2)].map((_, index) => (
      <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
        {Object.keys(vehicleTypesCount)
          .slice(index * Math.ceil(Object.keys(vehicleTypesCount).length / 2), (index + 1) * Math.ceil(Object.keys(vehicleTypesCount).length / 2))
          .map((type) => (
            <div key={type} style={{ padding: '10px', backgroundColor: 'gray', borderRadius: '5px' }}>
              <div style={{ fontWeight: 'bold', color: 'maroon' }}>{type}:</div>
              <div style={{ color: 'white', fontSize: '18px'  }}>{vehicleTypesCount[type]}</div>
            </div>
          ))}
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
  
      {/* Additional Section for Total Number of Occupied Vehicles */}
    
    </div>
  );
  
};

export default AnalyticsDashboard;
