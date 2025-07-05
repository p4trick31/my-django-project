import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import './App.css'; // You can style as needed
import LoginForm  from './UserLogin'
import SignupForm from './SignupForm';
import Modal from './LoginModal'
import ClientModal from './ClientLoginModal';
import UserInterface from './UserInterface'; 
import ClientInterface from './ClientInterface'; 
import FormInput from './FormInput';
import RequestForm from './RequestForm';
import Request2Form from './Request2Form';
import RoadMap from './RoadMap';
import Client1 from './Client1';
import Client2 from './Client2';
import ClientLogin from './ClientLogin'; 
import AdminDashboard from './AdminDashboard';
import AdminLoginModal from './AdminLogin';
import Client2Dashboard from './Client2Interface';
import PaymentPage from './PaymentPage';
import StickerDone from './StickerDone';
import AnalyticsDashboard from './admin/AnalyticsDashboard';
import ViewFormPage from './ViewForm';
import ViewApplicaton from './admin/ViewApplication';
import ApproveDashboard from './admin/ApproveDashboard';
// In your routing setup







const App = () => {
  const [popup, setPopup] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isClientModalOpen, setClientModalOpen] = useState(false); 
  const [isLogin, setIsLogin] = useState(true); // To toggle between Login and Signup
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClientHovered, setIsClientHovered] = useState(false);
  


  const openAdminModal = () => {
    setAdminModalOpen(true);
};

const closeAdminModal = () => {
    setAdminModalOpen(false);
};
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const openClientModal = () => {
    setClientModalOpen(true);
  }; // Open client modal
  const closeClientModal = () => {
    setClientModalOpen(false);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
 
  const openPopup = (popupId) => {
    setPopup(popupId);
  };

  const closePopup = () => {
    setPopup('');
  };
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);  // Set authentication state
    closeModal();  // Close the login modal
    closeClientModal();
    closeAdminModal();
    
 };
 const handleLogout = () => {
  // Clear any authentication tokens or session data if needed
  localStorage.removeItem('token'); // Example
  setIsAuthenticated(false); // Reset authentication state
};


  return (
   
    <Router>
    <div>
      
      {/* Conditionally render mainBox based on isAuthenticated */}
      {!isAuthenticated && (
      <div id="mainBox">
      <div className="head">
        <h3>Registration Sticker System</h3>
        <nav>
          <a href="#mainBox">Home</a>
          <a href="#About" onClick={() => openPopup('aboutPopup')}>About</a>
          <a href="#Inquiry" onClick={() => openPopup('InquiryPopup')}>Inquiry</a>
          <a href="#FAQs" onClick={() => openPopup('faqsPopup')}>FAQ's</a>
          <a href="#Contacts" onClick={() => openPopup('contactPopup')}>Contact</a>
          <button onClick={openAdminModal} style={{borderRadius:'50%',backgroundColor:'goldenrod',border:'2px solid white',  color: 'whitesmoke', fontSize: '15px'}}>Admin</button>
         
        </nav>
      </div>

      <div className="section">
        <div className="group-section">
          <div className="left-section">
            <div>
              <div className="logo-debesmscat">
              </div>
              <div className="text-debesmscat">
                <p style={{ fontWeight: 'bold' }}>Republic of the Philippines</p>
                <p>Dr. EIMILIO B. ESPINOSA SR. MEMORIAL</p>
                <p>STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY</p>
                <p>WWW.debesmscat.edu.ph | Cabitan Mandaon Masbate</p>
              </div>
            </div>
            <h1>Application Approval</h1>
            <h1>for</h1>
            <h1>Vehicle Sticker System</h1>
            <span>
              Registering for your vehicle sticker online is a quick and convenient process designed to enhance your experience.
              Simply visit our registration portal, fill out the required details such as vehicle information and owner identification,
              and upload any necessary documents. Once submitted, you’ll receive a confirmation email with your application status.
              This streamlined system not only saves you time but also ensures secure processing of your information.
            </span>
          </div>
          <div className="right-section">
           <div className="text-right">
          <h3>Want to register? Read the instructions below to register.</h3>
          <h3 style={{paddingBottom: '10px', borderBottom: '2px solid black'}}>Want to Register my Account?</h3>
          
          <div className="btn_field">
            {/* Register button to open the modal */}
            <button
      onClick={openModal}
      style={{
        border: '2px solid white',
        borderRadius: '10px',
        marginRight: '10px',
        paddingTop: '5px',
        paddingBottom: '5px',
        height: '50px',
        width: '50%',
        backgroundColor: isHovered ? 'darkgoldenrod' : 'goldenrod',
        color: 'whitesmoke',
        fontSize: '18px',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered ? '0 0 10px rgba(255, 215, 0, 0.6)' : 'none',
        transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
        cursor: isHovered ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Register
    </button>
            <button
      onClick={openClientModal}
      style={{
        border: '2px solid white',
        borderRadius: '10px',
        marginRight: '10px',
        paddingTop: '5px',
        paddingBottom: '5px',
        height: '50px',
        width: '50%',
        backgroundColor: isClientHovered ? 'darkgoldenrod' : 'goldenrod',
        color: 'whitesmoke',
        fontSize: '18px',
        transform: isClientHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isClientHovered ? '0 0 10px rgba(255, 215, 0, 0.6)' : 'none',
        transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
        cursor: isClientHovered ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setIsClientHovered(true)}
      onMouseLeave={() => setIsClientHovered(false)}
    >
      Client
    </button>
            
            
          </div>
          <div className="border">
            <h3 style={{ marginLeft: '5px' }}>Note:</h3>
            <ul style={{ marginLeft: '5px' }}>
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
              <li>Follow campus rule and regulation.</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
      </div>



      <div id="About">
        <div className="main-about">
          <div className="left-about">
            <div className="con story">
              <div className="txt story-text">
                <h3 style={{ color: 'rgb(1, 80, 90)' }}>Our Story</h3>
              </div>
              <p style={{ color: 'rgb(4, 4, 4)' }}>Welcome to the Vehicle Sticker Application Portal. Here you can apply for, track, and manage your vehicle stickers with ease.</p>
            </div>
            <div className="con team">
              <div className="txt team-text">
                <h3 style={{ color: 'rgb(1, 80, 90)' }}>Application Form</h3>
              </div>
              <p style={{ color: 'rgb(4, 4, 4)' }}>[Apply for Vehicle Sticker] - Fill out the online form with your vehicle details, owner information, and required documents.</p>
            </div>
            <div className="con goals">
              <div className="txt goals-text">
                <h3 style={{ color: 'rgb(1, 80, 90)' }}>Requirements</h3>
              </div>
              <p style={{ color: 'rgb(8, 8, 8)' }}>To apply for a vehicle sticker, you must provide:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Proof of vehicle ownership (registration document)</li>
                <li>Valid identification (driver's license or ID card)</li>
                <li>Proof of insurance</li>
              </ul>
            </div>
            <div className="con goals">
              <div className="txt goals-text">
                <h3 style={{ color: 'rgb(1, 80, 90)' }}>Approval Process</h3>
              </div>
              <p style={{ color: 'rgb(4, 4, 4)' }}>The approval process typically includes:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Submission of the application.</li>
                <li>Verification of documents.</li>
                <li>Approval notification via email or SMS.</li>
                <li>Paid online fees for sticker.</li>
              </ul>
            </div>
          </div>

          <div className="right-about">
            <div className="con quality">
              <h2 style={{ color: 'rgb(1, 80, 90)' }}>FAQs</h2>
              <h4>How long does it take to receive my sticker?</h4>
              <p style={{ color: 'rgb(4, 4, 4)' }}>Processing usually takes 5-7 business days.</p>
              <h4>How much is the required fees?</h4>
              <ul>
                <li>Motorcycle/Tricycle (Service Delivery) - P 100.00</li>
                <li>Private ALV/SUV/Pick-up/Sedan/Hatch - 250.00</li>
                <li>Delivery Vehicles Truck/Vans - 500.00</li>
                <li>PUV/PUJ/PUB - 1,000.00</li>
              </ul>
            </div>
            <div className="con satisfaction">
              <h3 style={{ color: 'rgb(1, 80, 90)' }}>Terms and Conditions</h3>
              <p style={{ color: 'rgb(4, 4, 4)' }}>By applying for a vehicle sticker, you agree to comply with all relevant laws and regulations regarding vehicle ownership and use. Please read our full terms</p>
              <ul>
                <li>Incomplete requirements will not be processed.</li>
                <li>Those who have already paid should comply with the above-stated requirements before submitting for processing/issuance of Vehicle Pass Sticker.</li>
                <li>Only CLEAR scotch tape to cover/protect the Vehicle Pass Sticker is allowed.</li>
                <li>Tampering and/or unauthorized transfer of vehicle pass sticker is a major offense and can be a basis for revocation (removal of sticker).</li>
                <li>Follow campus rule and regulation.</li>
              </ul>
            </div>
          </div>
        </div>
        
      </div>
      <div className="Footer">
      <div className="footers">
        <div className="left-footers">
          <div className="logo-footers" style={{ paddingBottom: '15%' }}>
            <div className="fb logo" style={{ paddingBottom: '5%' }}></div>
            <div className="ig logo"></div>
            <div className="twit logo"></div>
          </div>
          <div className="logo-footer" style={{ paddingBottom: '15%' }}>
            <div className="hours logo" style={{ paddingBottom: '5%' }}></div>
            <div className="phone logo"></div>
            <div className="location logo"></div>
          </div>
          <div className="textfooters" style={{marginLeft: '30px'}}>
            <p style={{ paddingBottom: '5px', color: 'black' }}>
              DEBESMSCAT Guidance and Admission Service
            </p>
            <p style={{ paddingBottom: '15px', paddingTop: '5px', color: '#171717' }}>
              DEBESMSCAT_Masbate
            </p>
            <p style={{ color: 'black' }}>Admission_debesmscat.edu.ph</p>
          </div>
          <div className="textfooters"style={{marginLeft: '700px'}}>
            <p style={{ paddingBottom: '5px', color: 'black' }}>
              AM-8:30-11:30 PM-1:00-5:00.
            </p>
            <p style={{ paddingBottom: '15px', paddingTop: '5px', color: '#171717' }}>
              00993296513
            </p>
            <p style={{ color: 'black' }}>Cabitan, Mandaon, Masbate</p>
          </div>
        </div>
      </div>
    </div>
    </div>
      
      )}
     {isModalOpen && (
    <Modal title={isLogin ? '' : ''} onClose={closeModal}>
        {isLogin ? (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
            <SignupForm />
        )}
        {/* Toggle between Login and Signup */}
        <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>
                {isLogin ? 'Don’t have an account?' : 'Already have an account?'}
            </span>
            <button className="toggle-button" onClick={toggleForm}>
                {isLogin ? 'Sign Up' : 'Login'}
            </button>
        </div>
    </Modal>
)}

<style>
    {`
    
    .toggle-button {
        padding: 0.5rem 1.2rem;
        font-size: 1rem;
        color: #007bff;
        background-color: transparent;
        border: 2px solid #007bff;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .toggle-button:hover {
        background-color: #007bff;
        color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adds a slight shadow on hover */
        transform: translateY(-2px); /* Creates a slight lift effect */
    }

    .toggle-button:focus {
        outline: none;
    }
    `}
</style>

        <ClientModal 
  isOpen={isClientModalOpen} 
  onClose={closeClientModal} 
  onLoginSuccess={handleLoginSuccess} // Pass it here
         />
             <AdminLoginModal
                    isOpen={isAdminModalOpen}
                    onClose={closeAdminModal}
                    onLoginSuccess={handleLoginSuccess} // Pass the login success handler
                />

    




      {/* Popups */}
      {popup === 'contactPopup' && (
        <Popup title="Contact Information" onClose={closePopup}>
          <p>Email: support@vehiclestickers.com</p>
          <p>Phone: (555) 123-4567</p>
        </Popup>
      )}
      {popup === 'faqsPopup' && (
        <Popup title="FAQs" onClose={closePopup}>
          <h4>How long does it take to receive my sticker?</h4>
          <p>Processing usually takes 5-7 business days.</p>
          <h4>How much is the required fees?</h4>
          <ul>
            <li>Motorcycle/Tricycle (Service Delivery) - P 100.00</li>
            <li>Private ALV/SUV/Pick-up/Sedan/Hatch - 250.00</li>
            <li>Delivery Vehicles Truck/Vans - 500.00</li>
            <li>PUV/PUJ/PUB - 1,000.00</li>
          </ul>
        </Popup>
      )}
      {popup === 'InquiryPopup' && (
        <Popup title="Inquiry" onClose={closePopup}>
          <p>[Apply for Vehicle Sticker] - Fill out the online form with your vehicle details, owner information, and required documents.</p>
        </Popup>
      )}
      {popup === 'aboutPopup' && (
        <Popup title="About" onClose={closePopup}>
          <h3 style={{ color: 'rgb(1, 80, 90)' }}>Our Story</h3>
          <p style={{ color: 'rgb(4, 4, 4)' }}>Welcome to the Vehicle Sticker Application Portal. Here you can apply for, track, and manage your vehicle stickers with ease.</p>
        </Popup>
      )}


        <Routes>
        

          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
           {/* Private Routes */}

          <Route path="/dashboard" element={<UserInterface onLogout={handleLogout} /> } 
          
            />
          
          <Route path="/dashboard" element={<ClientLogin />} />
          <Route path="/paymentpage" element={<PaymentPage />} />
          <Route path="/paymentpage/:applicationId" element={<PaymentPage />} />

          

            <Route path="/admin" element={<AdminDashboard onLogout={handleLogout}/>} />
            <Route path="/form-view" element={<ViewFormPage />} />
            <Route path="/form-view/:id" element={<ViewFormPage />} />
            <Route path="/app-view" element={<ViewApplicaton />} />
            <Route path="/app-view/:id" element={<ViewApplicaton />} />

            <Route path="/request2form" element={<Request2Form />} />
          <Route 
                path="/admindashboard" 
                element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
                path="/client/request-form" 
                element={isAuthenticated ? <RequestForm /> : <Navigate to="/client" />} 
            />
            <Route path="/sticker-done/:applicationId" element={<StickerDone />} />
            <Route path="/sticker-done" element={<StickerDone />} />
           
            <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
            

              {/* Other Routes */}
              <Route path="/client2/dashboard" element={<Client2Dashboard onLogout={handleLogout} />} />
              <Route path="/input" element={<FormInput />} />
                 <Route path="/steps" element={<RoadMap />} />
                 <Route path="/steps/:id" element={<RoadMap />} /> {/* Route for StepsPage */}
                   <Route path="/person1" element={<Client1 />} />
                  <Route path="/person2" element={<Client2 />} />
                   <Route path="/input" element={<FormInput />} />
                   
                 {/* Ensure this route is included */}
                 <Route 
    path="/clientdashboard" 
    element={<ClientInterface onLogout={handleLogout} />} 
/>
                  

        
            

          </Routes>
         
          

    </div>
    </Router>
  
  );
};

// Popup component
const Popup = ({ title, children, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <div className="popup-header">
          <h2>{title}</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="popup-body">{children}</div>
      </div>
    </div>
    
  );
};

  

export default App;
