import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import logo from './logo.jpg';
import pic from './debesmac.png';

const StepsPage = () => {
    const navigate = useNavigate(); 
    const [person1Status, setPerson1Status] = useState('none');
    const [person2Status, setPerson2Status] = useState('none');
    const [cashierStatus, setCashierStatus] = useState('none');
    const [stickerdoneStatus, setStickerDoneStatus] = useState('none');



    useEffect(() => {
        // Fetch data from the backend when the component mounts
        const fetchApplicationStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get-application-id/', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
    
                const applications = response.data;
    
                // Filter applications based on user status
                const person1Application = applications.find(app => app.status === 'Checking Application');
                const person2Application = applications.find(app => app.status === 'Waiting Approval');
                const cashierApplication = applications.find(app => app.status === 'Proceed to Payment');
                const stickerdoneApplication = applications.find(app => app.status === 'Payment Done');
    
                if (person1Application) {
                    setPerson1Status('Checking Application');
                } else {
                    setPerson1Status('done');
                }
    
                if (person2Application) {
                    setPerson2Status('Waiting Approval');
                } else {
                    setPerson2Status('done');
                }
                if (cashierApplication) {
                    setCashierStatus('Proceed to Payment');
                } else {
                    setCashierStatus('done');
                }
                if (stickerdoneApplication) {
                    setStickerDoneStatus('Payment Done');
                } else {
                    setStickerDoneStatus('done');
                }
            } catch (error) {
                console.error('Error fetching application data:', error);
            }
        };
    
        fetchApplicationStatus();
    }, []);
    
    const isStep1Clickable = person1Status === 'Checking Application';
    const isStep2Clickable = person2Status === 'Waiting Approval';
    const isStep3Clickable = cashierStatus === 'Proceed to Payment';
    const isStep4Clickable = stickerdoneStatus === 'Payment Done';

    return (
        <div 
        className='pic' 
        style={{ 
            backgroundImage: `url(${pic})`,  // Assuming 'pic' is a variable containing the image URL
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            height: '700px' 
        }}
    >
        
        <div style={styles.roadmapContainer}>
             <div className='logo'>
  <img src={logo} alt='Logo' style={{ width: '100px', height: '100px', objectFit: 'cover',border:'none',borderRadius:'50px',marginRight:'10px' }} />
</div>
            <h2 style={styles.roadmapTitle}></h2>
            
            <h5 style={{ marginTop:'-320px', fontFamily: 'Times New Roman, serif', fontStyle: 'italic',color:'white' }}>Republic of the Philippines</h5>
                    <h4 style={{marginTop:'-170px',fontFamily: 'Times New Roman, serif',color:'white' }}>DR. EMILIO B. ESPINOSA, SR. MEMORIAL</h4>
                    <h4 style={{ marginTop:'-170px', fontFamily: 'Times New Roman, serif',color:'white' }}>STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY</h4>
                    <h5 style={{ marginTop:'-170px', fontFamily: 'Times New Roman, serif',color:'white' }}>(Masbate State College)</h5>
                    <h4 style={{ marginTop:'-170px', fontFamily: 'Times New Roman, serif',color:'white' }}>PRODUCTION AND COMMERCIALIZATION</h4>
                    <h5 style={{ marginTop:'-170px', fontFamily: 'Times New Roman, serif',color:'white' }}>Mandaon, Masbate</h5>
                    <h5 style={{marginTop:'-170px', color: 'lightblue', fontFamily: 'Times New Roman, serif' }}>www.debesmscat.edu.ph</h5>
                    <h3 style={{ marginTop:'-170px', padding: '10px 0', fontFamily: 'Times New Roman, serif',color:'white' }}>APPLICATION FORM STATUS</h3>
                    <h5 style={{ marginTop:'-170px', fontFamily: 'Times New Roman, serif',color:'white' }}>(DEBESMSCAT Vehicle Pass)</h5>
                  
            <div style={styles.roadmap}>
                {/* Step 1 */}
                <button
                    onClick={() => navigate('/dashboard')} // Navigate back to the previous page
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
                
                <div style={styles.mainBoxContainer}>
                    <div
                        style={{
                            ...styles.mainBox,
                            cursor: isStep1Clickable ? 'pointer' : 'not-allowed',
                            opacity: isStep1Clickable ? 1 : 0.5,backgroundColor:'goldenrod'
                        }}
                        className="roadmap-step"
                        onClick={isStep1Clickable ? () => navigate('/person1') : undefined}
                    >
                        <div style={styles.stepIcon}>1</div>
                        <p style={styles.stepText}>Checker Person</p>
                    </div>
                    <div style={styles.connectorLine}></div>
                </div>

                {/* Step 2 */}
                <div style={styles.mainBoxContainer}>
                    <div
                        style={{
                            ...styles.mainBox,
                            cursor: isStep2Clickable ? 'pointer' : 'not-allowed',
                            opacity: isStep2Clickable ? 1 : 0.5,backgroundColor:'goldenrod'
                        }}
                        className="roadmap-step"
                        onClick={isStep2Clickable ? () => navigate('/person2') : undefined}
                    >
                        <div style={styles.stepIcon}>2</div>
                        <p style={styles.stepText}>Approval Form Person</p>
                    </div>
                    <div style={styles.connectorLine}></div>
                </div>

                {/* Step 3 */}
                <div style={styles.mainBoxContainer}>
                    <div
                        style={{
                            ...styles.mainBox,
                            cursor: isStep3Clickable ? 'pointer' : 'not-allowed',
                            opacity: isStep3Clickable ? 1 : 0.5,backgroundColor:'goldenrod'
                        }}
                        className="roadmap-step"
                        onClick={isStep3Clickable ? () => navigate('/paymentpage') : undefined}
                    >
                        <div style={styles.stepIcon}>3</div>
                        <p style={styles.stepText}>Cashier Payment</p>
                    </div>
                    <div style={styles.connectorLine}></div>
                </div>

                {/* Step 4 */}
                <div style={styles.mainBoxContainer}>
                    <div
                        style={{
                            ...styles.mainBox,
                            cursor: isStep4Clickable ? 'pointer' : 'not-allowed',
                            opacity: isStep4Clickable ? 1 : 0.5,backgroundColor:'goldenrod'
                        }}
                        className="roadmap-step"
                        onClick={isStep4Clickable ? () => navigate('/sticker-done') : undefined}
                    >
                        <div style={styles.stepIcon}>4</div>
                        <p style={styles.stepText}>Ready to Claim Sticker</p>
                    </div>
                    
                </div>
                
            </div>
            
        </div>
        </div>
    );
};

const styles = {
    roadmapContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '150px',
        border: '2px solid black',
        height:'700px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  
        backdropFilter: 'blur(5px)',  WebkitBackdropFilter: 'blur(5px)'  

       
        
    },
    roadmapTitle: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    roadmap: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px',
        position: 'relative',
        marginLeft: '-150px',
        marginRight: '200px',
    },
    mainBoxContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: '-50px',
    },
    mainBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        margin: '0 70px',
        border: '2px solid white',
        borderRadius: '10px',
        backgroundColor: 'green',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '180px',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
    },
    stepIcon: {
        backgroundColor: '#4caf50',
        color: 'white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10px',
        fontSize: '18px',
    },
    stepText: {
        fontSize: '16px',
        color: '#333',
    },
    connectorLine: {
        position: 'absolute',
        top: '50%',
        right: '-45px',
        width: '115px',
        height: '2px',
        backgroundColor: '#4caf50',
    },
};


export default StepsPage;
