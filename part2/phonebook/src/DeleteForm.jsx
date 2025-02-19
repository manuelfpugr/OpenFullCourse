import React from 'react';
import communication from './communication';

const DeleteButton = ({ id, name, onDelete }) => {
    const handleDelete = () => {
        id = parseInt(id);
        if (window.confirm(`Delete ${name}?`)) {
            communication
                .deletePerson(id)
                .then(() => {
                    onDelete(id);
                })
                .catch(error => console.error('Error deleting person:', error));
        }
    };

    return (
        <button onClick={handleDelete}>Delete</button>
    );
};

export default DeleteButton;