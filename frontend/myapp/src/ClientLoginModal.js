import React from 'react';
import ClientLogin from './ClientLogin';

const ClientModal = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times; {/* You can use an 'X' symbol or any other text */}
        </button>
        {/* Pass onLoginSuccess to ClientLogin */}
        <ClientLogin onLoginSuccess={onLoginSuccess} onClose={onClose} />
      </div>
    </div>
  );
};

export default ClientModal;
