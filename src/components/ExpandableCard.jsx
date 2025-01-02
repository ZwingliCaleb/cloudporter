import React, { useState } from 'react';
import Modal from 'react-modal';

const ExpandableCard = ({ children, title }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer" onClick={toggleModal}>
        <div className="font-bold text-lg">{title}</div>
        <Modal isOpen={isOpen} onRequestClose={toggleModal} className="modal" overlayClassName="overlay">
            <div className="p-4 bg-white rounded-lg shadow-md">
                <h2 className="font-bold text-xl mb-4">{title}</h2>
                <button onClick={toggleModal} className="bg-blue-500 text-white px-4 py-2 rounded">Close</button>
                {children}
            </div>
        </Modal>
    </div>
  );
};

export default ExpandableCard