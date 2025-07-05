import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom'; 
import logo from './logo.jpg';

const StickerDonePage = () => {
  const { passapplicationId } = useParams();
  const [applicationData, setApplicationData] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 


  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-application-id/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.data.length > 0) {
          setApplicationId(response.data[0].id); // Assume using the first application ID
          console.log('User applications:', response.data);
        } else {
          alert('No applications found for this user.');
        }
      } catch (error) {
        console.error('Error fetching user applications:', error.message);
      }
    };

    fetchUserApplications();
  }, []);

  useEffect(() => {
    const fetchApplicationData = async () => {
      const selectedApplicationId = passapplicationId || applicationId;
      if (!selectedApplicationId) return;
      try {
        const response = await axios.get(
          `http://localhost:8000/api/application/get_done_application/${selectedApplicationId}/`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        setApplicationData(response.data);
        
      } catch (error) {
        console.error('Error fetching application data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [applicationId, passapplicationId]);
  useEffect(() => {
    if (applicationData) {
      console.log(applicationData.sticker_number);
    }
  }, [applicationData]);

  const generatePDF = () => {
    const input = document.getElementById('pdfContent');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190; // Adjust the width as needed
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 10; // Margin from top

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      pdf.save('application-form.pdf');
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!applicationData) {
    return <div>No data found for this application.</div>;
  }

  return (
    <>
      <style>{`
        .sticker-form {
          display: flex;
          justify-content: center;
          padding: 20px;
          background: white;
      
        }

        .mainBox {
          border: 2px solid black;
          padding: 20px;
          background: Emerald;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
          width: 400px;
          border-radius: 1px;
          text-align: center;
          margin-bottom: 30px;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .mainBox:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
        }

        .logo-year {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

     

        .right-part {
          margin-top: 20px;
        }

        .right-part p {
          color: #333;
        }

        .right-part h2 {
          color: #0056b3;
          font-weight: bold;
        }

        .right-part h3 {
          color: #dc3545;
          font-weight: bold;
        }

        .form-section {
          border: 2px solid black;
          padding: 20px;
          background: #ffffff;
          border-radius: 1px;
          margin: 20px auto;
          width: 90%;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.1);
        }

        .form-section h2 {
          text-align: center;
          color: #333;
        }

        .form-section label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-section .info {
          margin-bottom: 15px;
        }

        .textfooter {
          display: flex;
          justify-content: space-around;
          text-align: center;
          margin-top: 20px;
          flex-direction: row;
        }

        .textfooter p {
          margin: 0;
          color: #6c757d;
       
          

        }
      `}</style>

      <div id="pdfContent">
        <div className="sticker-form">
          <div className="mainBox">
            <div className="logo-year" style={{display: 'flex', justifyContent: 'center'}}>
            <div className='logo'>
  <img src={logo} alt='Logo' style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'flex', marginTop: '50px' }} />
</div>
            </div>
            <div className="right-part">
              <h2 style={{color:'black',}}>2024</h2>
              <h2 style={{fontStyle:'italic',fontFamily:'serif'}} >DEBESMSCAT</h2>
              <p style={{marginTop:'-20px'}}>Dr. Emilio B. Espinosa Sr. Memorial State College of Agriculture and Technology.</p>
              <h3>TEMPORARY GATE PASS</h3>
              <h2 style={{ fontSize:'50px',border:'2px solid black'}}>{applicationData.sticker_number || 'Sticker Number Not Available'}</h2>
              <h2>STUDENT VEHICLE</h2>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 style={{fontFamily:'serif'}}>DEBESMSCAT vehicle Pass</h2>
          <p3 style={{fontFamily:'serif',fontStyle:'italic',marginLeft:'540px',}}>(To be filled up by authorized representative)</p3>
          <div className="info"><label style={{fontFamily:'serif'}} >Application No.:</label><span style={{ borderBottom: '2px solid black', minWidth: '325px', display: 'inline-block', }}>{applicationData.applicationNo}</span></div>
          <div className="info"><label style={{fontFamily:'serif'}}>Name:</label><span style={{ borderBottom: '2px solid black', minWidth: '325px', display: 'inline-block' }}>{applicationData.name}</span></div>
          <div className="info"><label style={{fontFamily:'serif'}}>Amount Paid:</label><span style={{ borderBottom: '2px solid black', minWidth: '325px', display: 'inline-block' }}>{applicationData.amountPaid}</span></div>
          <div className="info"><label style={{fontFamily:'serif'}}>O.R. No./Date:</label><span style={{ borderBottom: '2px solid black', minWidth: '325px', display: 'inline-block' }}>{applicationData.orNoDate}</span></div>
          <div className="info"><label style={{fontFamily:'serif'}}>Sticker No.:</label><span style={{ borderBottom: '2px solid black', minWidth: '325px', display: 'inline-block' }}>{applicationData.sticker_number}</span> </div>

          <div >
            <h3 style={{marginLeft:'700px',fontFamily:'serif'}}>Sticker Issued by:</h3>
            <div style={{borderBottom: '2px solid black', minWidth: '325px',marginLeft:'900px',textAlign:'center', fontSize: '18px', padding: '10px'}}>Authorized Person</div>
            <h3 style={{marginLeft:'900px',fontStyle:'italic',fontFamily:'serif',marginTop:'-2px'}}>DEBESMSCAT Authorized Representative</h3>
          </div>
          <div className="textfooter">
          <p>FM-SS-03</p>
          <p>0.1</p>
          <p>4/24/2017</p>
        </div>
      </div>
        </div>

     

      <button
        onClick={generatePDF}
        style={{ marginTop: '20px', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: 'black', border: 'none', cursor: 'pointer' }}
      >
        Download PDF
      </button>
      <button
                    onClick={() => navigate(-1)} // Navigate back to the previous page
                    style={{
                        marginTop: '20px',
                        marginLeft: '20px',
                        padding: '10px 20px',
                        backgroundColor: 'white',
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
    </>
  );
};

export default StickerDonePage;
