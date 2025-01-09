import { useState } from 'react';
import Modal from 'react-modal';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure Font Awesome is included

const ExpandableCard = ({ children, title, description, buttonLabel, onButtonClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={toggleModal} className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer">
        <div className="font-bold text-lg">{title}</div>
        <p className="text-gray-600 mt-2">{description}</p>
        <button onClick={onButtonClick} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          {buttonLabel}
        </button>
      </div>
      <Modal isOpen={isOpen}
       onRequestClose={toggleModal} 
       className="modal w-full max-w-4xl" 
       overlayClassName="overlay"
       >
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto relative">
          <button onClick={toggleModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
            <i className="fas fa-times text-2xl"></i>
          </button>
          <h2 className="font-bold text-xl mb-4">{title}</h2>
          {children}
        </div>
      </Modal>
    </div>
  );
};

export default ExpandableCard;
