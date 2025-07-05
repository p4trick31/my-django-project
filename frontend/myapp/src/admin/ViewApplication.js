
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../logo.jpg';

const ViewFormPage = () => {
    const { id } = useParams();  // Use useParams to get the 'id' param
    const [selectedForm, setSelectedForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/applications/${id}`);
                setSelectedForm(response.data);
            } catch (err) {
                console.error('Error fetching application details:', err);
                setError('Could not fetch application details.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetails();
    }, [id]);  // Re-fetch if the id changes

    const generatePDF = () => {
        const input = document.getElementById('pdfContent');
        html2canvas(input, {
          scale: 1.5, // Lower the scale to reduce the image resolution
          useCORS: true // Ensures cross-origin images are rendered properly
        }).then((canvas) => {
          const imgData = canvas.toDataURL('image/jpeg', 0.3); // Use JPEG with a lower quality factor (0.3) for compression
          const pdf = new jsPDF('p', 'mm', [216, 356]); // Use a smaller custom size if needed for file size control
      
          const pageWidth = 216; // Custom width for standard or reduced size
          const imgWidth = pageWidth - 20; // Use full page width minus margins for better control
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
          let position = 10; // Margin from the top of the page
      
          // Add image with 'FAST' for further compression
          pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight, undefined, 'FAST');
          
          // Compress by using 'compressed' method
          pdf.setProperties({
            title: 'Compressed Application Form'
          });
      
          pdf.save('application-form.pdf');
        });
      };
      
      
      
      
      



    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
        <div id="pdfContent">
        <div style={{ padding: '20px', marginLeft: '280px' }}>
        
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', padding: '20px', width: '900px', background: 'white'}}>
            <div className='logo'>
  <img src={logo} alt='Logo' style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'flex', position: 'absolute', marginLeft: '-350px', marginTop: '50px' }} />
</div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>

                    <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif', fontStyle: 'italic' }}>Republic of the Philippines</h5>
                    <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>DR. EMILIO B. ESPINOSA, SR. MEMORIAL</h4>
                    <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY</h4>
                    <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>(Masbate State College)</h5>
                    <h4 style={{ margin: '0', padding: '0', color: 'green', fontFamily: 'Times New Roman, serif' }}>PRODUCTION AND COMMERCIALIZATION</h4>
                    <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>Mandaon, Masbate</h5>
                    <h5 style={{ margin: '0', padding: '0', color: 'lightblue', fontFamily: 'Times New Roman, serif' }}>www.debesmscat.edu.ph</h5>
                    <h3 style={{ margin: '0', padding: '10px 0', fontFamily: 'Times New Roman, serif' }}>APPLICATION FORM</h3>
                    <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>(DEBESMSCAT Vehicle Pass)</h5>
                </div>

                {/* Uploaded Photos Section */}
               

                <div style={{ display: 'grid', gap: '10px' }}>
                    {/* Application No. and Date */}
                    <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                        <div>
                            <strong>Application No.:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '300px', display: 'inline-block', marginLeft: '10px'}}>2024</span>
                        </div>
                        <div>
                            <strong>Date:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '290px', display: 'inline-block' }}>
                                {new Date(selectedForm.date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Name and Contact No. */}
                    <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                        <div>
                            <strong>Name:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '300px', display: 'inline-block' }}>{selectedForm.name}</span>
                        </div>
                        <div>
                            <strong>Contact No.:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '327px', display: 'inline-block' }}>{selectedForm.contact}</span>
                        </div>
                    </div>

                    {/* Address, Birthday, and Age */}
                    <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                        <div>
                            <strong>Address:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '150px', display: 'inline-block' }}>{selectedForm.address}</span>
                        </div>
                        <div>
                            <strong>Birthday:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '150px', display: 'inline-block' }}>
                                {selectedForm.birthday ? new Date(selectedForm.birthday).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div>
                            <strong>Age:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '283px', display: 'inline-block' }}>
                                {selectedForm.age !== null ? selectedForm.age : 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Vehicle Certificate of Registration No. and O.R. No./Date */}
                    <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                        <div>
                            <strong>Vehicle Certificate of Registration No.:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '150px', display: 'inline-block' }}>{selectedForm.vehicle_register}</span>
                        </div>
                        <div>
                            <strong>O.R. No./Date:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '225px', display: 'inline-block' }}>{selectedForm.or_no}</span>
                        </div>
                    </div>

                    {/* Vehicle Type and Plate No. */}
                    <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                        <div>
                            <strong>Vehicle Type:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '300px', display: 'inline-block' }}>{selectedForm.vehicle_type}</span>
                        </div>
                        <div>
                            <strong>Plate No:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '303px', display: 'inline-block' }}>{selectedForm.plate_number}</span>
                        </div>
                    </div>

                    {/* Color and Make/Model */}
                    <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                        <div>
                            <strong>Color:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '300px', display: 'inline-block' }}>{selectedForm.color}</span>
                        </div>
                        <div>
                            <strong>Make/Model:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '325px', display: 'inline-block' }}>{selectedForm.model_make}</span>
                        </div>
                    </div>

                    {/* Chassis No. and Engine No. */}
                    <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                        <div>
                            <strong>Chassis No.:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '300px', display: 'inline-block' }}>{selectedForm.chassis_no}</span>
                        </div>
                        <div>
                            <strong>Engine No.:</strong>
                            <span style={{ borderBottom: '2px solid black', minWidth: '300px', display: 'inline-block' }}>{selectedForm.engine_no}</span>
                        </div>
                    </div>
                </div>

                {/* Note Section */}
                <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '20px', color: 'black', marginRight: '780px' }}>
                    <strong>Note:</strong>
                </p>
                <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px', color: 'black', marginRight: '130px', width: '700px' }}>
                    1. Please print legibly
                </p>
                <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px', color: 'black', marginRight: '130px', width: '700px' }}>
                    2. Attach photocopy of Vehicle's Certificate of Registration and Driver's License.
                </p>
                <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px', color: 'black', marginRight: '130px', width: '700px', marginTop: '-20px' }}>
                    (Bring the original copy of Vehicle's Certificate of Registration, Driver's License, and this filled-up form for verification)
                </p>
                <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px', color: 'black', marginRight: '130px', width: '700px', marginTop: '-20px' }}>
                    3. If student, please attach a photocopy of student ID/Assessment Form from the Registrar’s Office.
                </p>
                <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginRight:'130px',width:'700px',marginTop:'-20px' }}>
        4. Incomplete document will not be processed.
    </p>
    <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginRight:'130px',width:'700px',marginTop:'-20px' }}>
        5. Pay the corresponding fee to the cashier. Ask for Official Reciept.
    </p>
    <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginRight:'130px',width:'700px',marginTop:'-20px' }}>
        6. Sticker will be placed to a noticeable area of the vehicle by authorized DEBESMSCAT personel only.
    </p>
    <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginRight:'130px',width:'700px',marginTop:'-20px' }}>
        7. Falsification and unauthorized use of DEBESMSCAT Vehicle Pass Sticker or this application form will be dealt with accordingly.
    </p><br></br>
    <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginLeft:'5px',width:'700px',marginTop:'-20px' }}>
          <strong>I CERTIFY</strong> that this information has been accomplished by the undersigned is true and correct pursuation to the provision of pertinent law and regulation.
    </p>
    <div>
                
                <span style={{ borderBottom: '2px solid black', minWidth: '300px', display: 'inline-block',marginLeft:'500px', textAlign: 'center', padding: '5px' }}>{selectedForm.name}</span>
                <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginLeft:'514px',marginTop:'-3px'}}>
                    Applicant's Signature over Printed Name
       
    </p>
    <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginLeft:'470px',marginTop:'10px' }}>
          Checked and Inpected by:
    </p>
    <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginLeft:'500px',marginTop:'10px', padding: '3px',borderBottom: '2px solid black', textAlign: 'center' }}>
          <strong>RICHARD J. SALES</strong>
    </p>
    <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginLeft:'590px',marginTop:'-20px' }}>
        Chief, Security Service
    </p><br></br>
    <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginLeft:'468px',marginTop:'-20px' }}>
      Approved by:
    </p>
    <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginLeft:'500px',marginTop:'-20px' ,  padding: '3px',borderBottom: '2px solid black', textAlign: 'center', width: '300px'}}>
      <strong>NONALYN D. TOMBOCON</strong>
    </p>
    <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '17px',color:'black',marginLeft:'510px',marginTop:'-20px' }}>
        Director, Production & Commercialization
    </p><br></br>
            </div>

                {/* Back Button */}
              
                </div>
                </div>
                </div>
                
                <button
                    onClick={() => navigate(-1)} // Navigate back to the previous page
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontFamily: 'Times New Roman, serif',
                        fontSize: '16px'
                    }}
                >
                    Back to Previous Page
                </button>

<button
  onClick={generatePDF}
  style={{ marginTop: '20px', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: 'black', border: 'none', cursor: 'pointer' }}
>
  Download PDF
</button>
</>

       
    );
};

export default ViewFormPage;
