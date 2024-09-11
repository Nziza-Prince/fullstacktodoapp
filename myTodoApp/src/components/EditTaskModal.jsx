import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './modal.css';

Modal.setAppElement('#root'); 

const EditTaskModal = ({ isOpen, onRequestClose, task, onSave }) => {
    const [editedTask, setEditedTask] = useState(task);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        setEditedTask(task);
    }, [task]);

    const handleChange = (e) => {
        setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(editedTask);
        handleClose();
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onRequestClose();
        }, 300); 
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className={`modal ${isClosing ? 'exiting' : ''}`}
            overlayClassName={`overlay ${isClosing ? 'exiting' : ''}`}
            contentLabel="Edit Task"
        >
            <h2 className="modal-title">Edit Task</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <label className="modal-label">
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={editedTask?.title || ""}
                        onChange={handleChange}
                        className="modal-input"
                    />
                </label>
                <div className="modal-buttons">
                    <button type="submit" className="modal-button">Save</button>
                    <button type="button" onClick={handleClose} className="modal-button cancel-button">Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default EditTaskModal;
