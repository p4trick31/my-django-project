import React, { useState,  useEffect  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './logo.jpg';



const ApplicationForm = () => {
    const [formData, setFormData] = useState({
        date: '',
        name: '',
        address: '',
        contact: '',
        birthday: '',
        age: '',
        vehicle_register: '',
        or_no: '',
        vehicle_type: 'motorcycle',
        plate_number: '',
        color: '',
        chassis_no: '',
        model_make: '',
        engine_no: '',
        photos: [],
        picture_id: []
    });
    const [submittedDataId, setSubmittedDataId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasPendingApplication, setHasPendingApplication] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for pending applications on component mount
        const checkPendingApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:8000/api/application/pending', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Assume response.data.pending is true if there's a pending application
                setHasPendingApplication(response.data.pending);
            } catch (error) {
                console.error('Error checking for pending applications:', error);
            }
        };

        checkPendingApplication();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: Array.from(files) // Dynamically set `photos` or `picture_id`
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Fetch the token

        if (!token) {
            setErrorMessage('You need to be logged in to submit an application.');
            return;
        }

        // Prepare form data for submission
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'photos' || key === 'picture_id') {
                value.forEach(file => formDataToSubmit.append(key, file));
            } else {
                formDataToSubmit.append(key, value);
            }
        });
        

        try {
            const response = await axios.post('http://localhost:8000/api/application/', formDataToSubmit, {
                headers: {
                    'Authorization': `Bearer ${token}` // Ensure token is present
                }
            });

            setSubmittedDataId(response.data.id);
            setShowPopup(true);
            setErrorMessage('');
            

            // Reset form fields
            setFormData({
                date: '',
                name: '',
                address: '',
                contact: '',
                birthday: '',
                age: '',
                vehicle_register: '',
                or_no: '',
                vehicle_type: 'motorcycle',
                plate_number: '',
                color: '',
                chassis_no: '',
                model_make: '',
                engine_no: '',
                photos: [],
                picture_id: []
            });

        } catch (error) {
            console.error('There was an error submitting the form:', error);
            if (error.response) {
                setErrorMessage(`Failed to submit the form: ${error.response.data.detail || 'Please check your input and try again.'}`);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        // Navigate to the specific page after closing the popup
        navigate(`/person1`);
    };

    return (
        <div style={{ margin: '20px', textAlign: 'center', backgroundColor: 'white', padding: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <img
                src={logo} // Replace with the actual URL or local path of the logo
                alt="Logo"
                style={{ height: '100px', marginRight: '20px' }} // Adjust the size and spacing as needed
            />
               <div>
            <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif', fontStyle: 'italic' }}>Republic of the Philippines</h5>
            <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>DR. EMILIO B. ESPINOSA, SR. MEMORIAL</h4>
            <h4 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY</h4>
            <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>(Masbate State College)</h5>
            <h4 style={{ margin: '0', padding: '0', color: 'green', fontFamily: 'Times New Roman, serif' }}>PRODUCTION AND COMMERCIALIZATION</h4>
            <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>Mandaon, Masbate</h5>
            <h5 style={{ margin: '0', padding: '0', color: 'whiteblue', fontFamily: 'Times New Roman, serif' }}>www.debesmscat.edu.ph</h5>
            <h3 style={{ margin: '10px 0', fontFamily: 'Times New Roman, serif' }}>APPLICATION FORM</h3>
            <h5 style={{ margin: '0', padding: '0', fontFamily: 'Times New Roman, serif' }}>(DEBESMSCAT Vehicle Pass)</h5>
        </div>
        </div>
    
        {hasPendingApplication ? (
            <div style={pendingMessageStyle}>
                You have a pending transaction form or Disapproved Application.
                 You don't need to fill out another form until it is approved.
            </div>
        ) : (
            <form
                onSubmit={handleSubmit}
                style={{
                    textAlign: 'left',
                    maxWidth: '600px',
                    margin: '0 auto',
                    border: '2px solid #000',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white', // Added white background color
                }}
            >
                {[
                    { label: 'Date:', type: 'date', name: 'date' },
                    { label: 'Name:', type: 'text', name: 'name' },
                    { label: 'Address:', type: 'text', name: 'address' },
                    { label: 'Contact Number:', type: 'text', name: 'contact' },
                    { label: 'Birthday:', type: 'date', name: 'birthday' },
                    { label: 'Age:', type: 'number', name: 'age' },
                    { label: 'Certificate of Registration No:', type: 'text', name: 'vehicle_register' },
                    { label: 'O.R No / Date:', type: 'text', name: 'or_no' },
                    { label: 'Plate Number:', type: 'text', name: 'plate_number' },
                    { label: 'Color:', type: 'text', name: 'color' },
                    { label: 'Chassis No:', type: 'text', name: 'chassis_no' },
                    { label: 'Model/Make:', type: 'text', name: 'model_make' },
                    { label: 'Engine No:', type: 'text', name: 'engine_no' },
                ].map((field, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <label style={{ flex: '1', marginRight: '10px' }}>{field.label}</label>
                        <input
                            style={{ flex: '2', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
    
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={{ flex: '1', marginRight: '10px' }}>Vehicle Type:</label>
                    <select
                        style={{ flex: '2', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="motorcycle">Motorcycle</option>
                        <option value="habal_habal">Habal Habal</option>
                        <option value="tricycle">Tricycle</option>
                        <option value="delivery_truck">Delivery Truck/Vans</option>
                        <option value="private_suv">Private SUV/AUV/Sedan</option>
                        <option value="pub_puj_puv">PUB/PUJ/PUV</option>
                    </select>
                </div>
    
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={{ flex: '1', marginRight: '10px' }}>Upload Photos:</label>
                    <input
                        style={{ flex: '2', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                        type="file"
                        name="photos"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        required
                    />
                </div>
    
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={{ flex: '1', marginRight: '10px' }}>Upload 2 by 2 ID:</label>
                    <input
                        style={{ flex: '2', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                        type="file"
                        name="picture_id"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <p style={{ fontFamily: 'Times New Roman, serif', fontSize: '18px',color:'#333',marginLeft:'5px',width:'600px',marginTop:'20px 20px' }}>
          <strong>I CERTIFY</strong> that this information has been accomplished by the undersigned is true and correct pursuation to the provision of pertinent law and regulation.
    </p>
    
                <input
                    type="submit"
                    value="Submit"
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        marginTop: '10px'
                    }}
                />
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
            </form>
        )}
    
    

    

    
    
    
    
        {showPopup && (
            <div style={popupStyle} onClick={closePopup}>
                Your data has been submitted successfully! Your Application ID is: {submittedDataId}. Click here to proceed.
            </div>
        )}

        {errorMessage && <div style={errorStyle}>{errorMessage}</div>}
    </div>
);
};


const pendingMessageStyle = {
    color: 'orange',
    marginTop: '20px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    textAlign: 'center'
};

// Popup styling
const popupStyle = {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '20px',
    borderRadius: '5px',
    zIndex: 1000,
    textAlign: 'center',
    cursor: 'pointer',
};

// Error message styling
const errorStyle = {
    color: 'red',
    marginTop: '10px',
};

export default ApplicationForm;
