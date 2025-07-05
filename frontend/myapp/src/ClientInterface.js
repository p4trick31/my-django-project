import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.jpg';
import pic from './debesmac.png';

const ClientDashboard = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleViewRequestForm = () => {
        navigate('/client/request-form');
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
            height: '745px' 
        }}
    >
        <div style={{ 
            textAlign: 'center', 
            height: '700px', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            backdropFilter: 'blur(5px)', 
            WebkitBackdropFilter: 'blur(5px)',
            padding: '20px',
        }}>
            <div className='logo'>
                <img 
                    src={logo} 
                    alt='Logo' 
                    style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover', 
                        marginTop:'10px' ,
                       marginLeft:'380px',
                        display: 'flex', 
                        position: 'absolute',
                        border: 'none', 
                        borderRadius: '50px' 
                    }} 
                />
            </div>
            <div style={{ textAlign: 'center', marginBottom: '70px', color: 'white',marginTop:'-30px' }}>
                <h4 style={{ margin: '0', fontFamily: 'Times New Roman, serif', fontStyle: 'italic', marginTop: '20px' }}>
                    Republic of the Philippines
                </h4>
                <h3 style={{ margin: '0', fontFamily: 'Times New Roman, serif', color: 'white' }}>
                    DR. EMILIO B. ESPINOSA, SR. MEMORIAL
                </h3>
                <h4 style={{ margin: '0', fontFamily: 'Times New Roman, serif' }}>
                    STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY
                </h4>
                <h4 style={{ margin: '0', fontFamily: 'Times New Roman, serif' }}>
                    (Masbate State College)
                </h4>
                <h4 style={{ margin: '0', color: 'white', fontFamily: 'Times New Roman, serif' }}>
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

    <h2 style={{ color: 'white', marginTop: '-50px', marginRight: '800px' }} className="wave-text">
        {Array.from('Welcome! Richard Sales').map((char, index) => (
            <span key={index} style={{ '--i': index }}>{char}</span>
        ))}
    </h2>
</>

    
            <div style={{ 
                 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                border: '2px solid black', 
                borderRadius: '20px', 
                marginLeft: '150px', 
                marginRight: '150px', 
                borderColor: 'white', 
                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                backdropFilter: 'blur(5px)', 
                WebkitBackdropFilter: 'blur(5px)' 
            }}>
                <span style={{ 
                    margin: '10px 20px', 
                    maxWidth: '200%', 
                    textAlign: 'justify', 
                    padding: '50px', 
                    fontFamily: 'Times New Roman, serif', 
                    fontSize: '20px', 
                    color: 'white' 
                }}>
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
    
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    padding: '20px',
                }}>
                    <button 
                        onClick={handleViewRequestForm}
                        style={{ 
                            padding: '12px 30px', 
                            backgroundColor: 'goldenrod', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            fontSize: '16px', 
                            margin: '10px',
                            boxShadow: '0 4px 6px white',
                            width: '200px'
                        }}
                    >
                        View User Request Form
                    </button>
    
                    <button 
                        onClick={handleBackHome}
                        style={{ 
                            padding: '12px 30px', 
                            backgroundColor: 'red', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            fontSize: '16px', 
                            margin: '10px',
                            boxShadow: '0 4px 6px white',
                            width: '200px'
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

export default ClientDashboard;


