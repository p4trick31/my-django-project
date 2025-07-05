import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MessageDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch all applications data
        const response = await axios.get('http://localhost:8000/api/applications/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Filter messages to include only those with payment status "paid"
        const filteredMessages = response.data.filter(
          (message) => message.payment_status === 'unpaid'
        );

        // Sort the messages by payment_date in descending order
        const sortedMessages = filteredMessages.sort(
          (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
        );

        // Set the sorted messages in state
        setMessages(sortedMessages);
      } catch (error) {
        console.error('Error fetching payment messages:', error);
        alert('There was an error fetching payment details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      // Send accept/reject decision to server
      const response = await axios.post(
        `http://localhost:8000/api/applications/${id}/${decision}/`, // Ensure trailing slash here
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      

      // Remove the message from the list upon successful response
      if (response.status === 200) {
        alert(`Payment ${decision === 'accept' ? 'accepted' : 'rejected'} successfully.`);
        setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
      }
    } catch (error) {
      console.error(`Error processing ${decision} decision:`, error);
      alert(`Failed to ${decision} the payment. Please try again.`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
        height: '630px',
        width: '900px',
        borderRadius: '10px',
      }}
    >
      <h2 style={{ color: '#f7f7f7', fontFamily: 'Arial, sans-serif' }}>Payment Messages</h2>
      {messages.length === 0 ? (
        <p style={{ color: '#fff', fontSize: '18px' }}>No payment messages to display.</p>
      ) : (
        <div
          style={{
            width: '850px',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            maxHeight: '500px',
            background: 'silver',
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                margin: '10px 0',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: '#f7f7f7',
                boxShadow: '0 5px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'left',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                cursor: 'pointer',
                border: '1px solid #333',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.backgroundColor = '#e0f7fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 5px 4px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.backgroundColor = '#f7f7f7';
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '10px',
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                <strong>From: {message.name}</strong>
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: '#555',
                  marginBottom: '10px',
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                <strong>Reference Number:</strong> {message.reference_number}
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: '#555',
                  marginBottom: '10px',
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                <strong>Payment Method:</strong> {message.payment_type}
              </p>
              <p style={{
  fontSize: '12px',
  color: '#333',
  fontStyle: 'italic',
  textAlign: 'right',
  fontFamily: 'Arial, sans-serif'
}}>
  <strong>Payment Date:</strong> {new Date(message.payment_date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',  // Full month name (e.g., "December")
    day: '2-digit', // Day with leading zero if necessary (e.g., "02")
   
  })}
</p>
<p style={{
  fontSize: '12px',
  color: '#333',
  fontStyle: 'italic',
  textAlign: 'right',
  fontFamily: 'Arial, sans-serif'
}}>
  <strong>Payment Time:</strong> {new Date(message.payment_date).toLocaleString('en-US', {
    hour: 'numeric', // Hour (e.g., "4")
    minute: '2-digit', // Minute with leading zero (e.g., "50")
    hour12: true // AM/PM format
  })}
</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleDecision(message.id, 'accept')}
                >
                  Accept
                </button>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleDecision(message.id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageDashboard;
