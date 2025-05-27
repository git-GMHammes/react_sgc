import React from 'react';

const BtnProvisorio = ({ onClick, children, type = 'button', disabled = false }) => {

    return (
        <div>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </button>
        </div>
    );
};

export default BtnProvisorio;