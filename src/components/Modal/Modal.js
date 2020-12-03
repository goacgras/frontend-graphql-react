import React from 'react';

import './Modal.css';

const Modal = ({
    title,
    canCancel,
    canConfirm,
    children,
    onCancel,
    onConfirm
}) => {
    return (
        <div className="modal">
            <header className="modal__header">{title}</header>
            <section className="modal__content">
                <h1>{children}</h1>
            </section>
            <section className="modal__actions">
                {canCancel && (
                    <button className="btn" onClick={onCancel}>
                        Cancel
                    </button>
                )}
                {canConfirm && (
                    <button className="btn" onClick={onConfirm}>
                        Confirm
                    </button>
                )}
            </section>
        </div>
    );
};

export default Modal;
