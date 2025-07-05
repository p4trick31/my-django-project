import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.jpg';
import pic from './debesmac.png';

const Client2Dashboard = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleViewRequestForm = () => {
        navigate('/request2form'); // Adjusted path for Client 2
    };

    const handleBackHome = () => {
        if (onLogout) {
            onLogout(); // Call onLogout to reset authentication
            navigate('/'); // Redirect to home
        } else {
            console.log("onLogout function is not defined");
            console.log(onLogout); // This will help you see if it's defined
        }
    };

    return (
        <div 
            className='pic' 
            style={{ 
                backgroundImage: `url(${pic})`,  // Assuming 'pic' is a variable containing the image URL
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                height: '100vh',  // Full height to center vertically
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div 
                style={{ 
                    
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '20px', 
                    maxWidth: '800px', 

                   
                }}
            >
                <div className='logo'>
                    <img 
                        src={logo} 
                        alt='Logo' 
                        style={{ 
                            width: '100px', 
                            height: '100px', 
                            objectFit: 'cover', 
                            position: 'absolute', 
                            marginLeft: '50px', 
                           marginTop:'-50px',
                            border: 'none',
                            borderRadius: '50px',
                        }} 
                    />
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '30px',marginTop:'-100px',color:'white' }}>
                    <h4 style={{ margin: '0', fontFamily: 'Times New Roman, serif', fontStyle: 'italic', marginTop: '20px' }}>
                        Republic of the Philippines
                    </h4>
                    <h3 style={{ margin: '0', fontFamily: 'Times New Roman, serif',color:'white' }}>
                        DR. EMILIO B. ESPINOSA, SR. MEMORIAL
                    </h3>
                    <h4 style={{ margin: '0', fontFamily: 'Times New Roman, serif' }}>
                        STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY
                    </h4>
                    <h4 style={{ margin: '0', fontFamily: 'Times New Roman, serif' }}>
                        (Masbate State College)
                    </h4>
                    <h4 style={{ margin: '0', color:'white', fontFamily: 'Times New Roman, serif' }}>
                        PRODUCTION AND COMMERCIALIZATION
                    </h4>
                    <h5 style={{ margin: '0', fontFamily: 'Times New Roman, serif' }}>
                        Mandaon, Masbate
                    </h5>
                    <h5 style={{ margin: '0', color: 'lightblue', fontFamily: 'Times New Roman, serif' }}>
                        www.debesmscat.edu.ph
                    </h5>
                    <h4 style={{ margin: '0', fontFamily: 'Times New Roman, serif' }}>
                        (DEBESMSCAT Vehicle Pass)
                    </h4>
                </div>
                
                <>
    <style>
    {`
            .wave-text span {
                display: inline-block;
                animation: wave 10s infinite ease-in-out; /* Adjusted speed and easing */
                animation-delay: calc(var(--i) * 0.15s); /* Adjusted delay for smoother wave */
            }

            @keyframes wave {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-15px); /* Adjusted amplitude for higher wave */
                }
            }
        `}
    </style>

    <h2 
        style={{ 
            textAlign: 'center', 
            marginBottom: '20px', 
            color: 'white', 
            marginRight: '420px' 
        }}
        className="wave-text"
    >
        {Array.from('Welcome! Nonalyn D. Tombocon').map((char, index) => (
            <span key={index} style={{ '--i': index }}>{char}</span>
        ))}
    </h2>
</>

                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '900px',  border: '2px solid white', borderRadius:'10px',backgroundColor:'black',height:'370px' ,marginTop:'-20px'}}>
                    <span style={{ flex: '1', textAlign: 'justify', padding: '10px',color:'white',marginTop:'20px' }}>
                        Registering for your vehicle sticker online is a quick and convenient process designed to enhance your experience.
                        Simply visit our registration portal, fill out the required details such as vehicle information and owner identification,
                        and upload any necessary documents. Once submitted, you’ll receive a confirmation email with your application status.
                        This streamlined system not only saves you time but also ensures secure processing of your information.
                        <ul>
                        <strong>Notes</strong>
                        <li>Incomplete requirements will not be processed.</li>
                        <li>
                            Those who have already paid should comply with the above-stated
                            requirements before submitting for processing/issuance of Vehicle Pass Sticker.
                        </li>
                        <li>Only CLEAR scotch tape to cover/protect the Vehicle Pass Sticker is allowed.</li>
                        <li>
                            Tampering and/or unauthorized transfer of vehicle pass sticker is a major offense and
                            can be a basis for revocation (removal of sticker).
                        </li>
                        <li>Follow campus rules and regulations.</li>
                        </ul>
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px',marginTop:'20px',marginRight:'10px' }}>
                        <button 
                            onClick={handleViewRequestForm}
                            style={{ 
                                padding: '10px 20px ', 
                                marginBottom: '10px', 
                                backgroundColor: 'goldenrod', 
                                color: '#fff', 
                                border: '2px solid white', 
                                borderRadius: '5px', 
                                cursor: 'pointer', 
                                height: '50px',
                                marginTop:'90px',
                                boxShadow: '0 4px 6px white',
                            }}
                        >
                            View User Request Form
                        </button>
                        <button 
                            onClick={handleBackHome}
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: 'red', 
                                color: '#fff', 
                                border: '2px solid white', 
                                borderRadius: '5px', 
                                cursor: 'pointer',
                                height: '50px',
                                boxShadow: '0 4px 6px white',
                                marginTop:'10px',
                                

                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    

};

export default Client2Dashboard;
