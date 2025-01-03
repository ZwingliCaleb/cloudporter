import { useState } from 'react';
import Modal from 'react-modal';

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
      <Modal isOpen={isOpen} onRequestClose={toggleModal} className="modal" overlayClassName="overlay">
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="font-bold text-xl mb-4">{title}</h2>
          <button onClick={toggleModal} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Close</button>
          {children}
        </div>
      </Modal>
    </div>
  );
};

export default ExpandableCard;
