// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\components\Modal\BlurInTransparentModal\index.jsx
import React, { useState, useEffect } from 'react';
import './style.css';

const BlurInTransparentModal = ({ idModal, buttonName, strTitleModal, children, isOpenInitial = false, getId = '0' }) => {
    // Estado para controlar qual modal está aberto (nenhum por padrão)
    const [activeModal, setActiveModal] = useState(null);

    // UseEffect para verificar se o modal deve ser aberto automaticamente
    useEffect(() => {
        if (isOpenInitial) {
            setActiveModal(idModal);
        }
    }, [idModal, isOpenInitial]);

    // Função para abrir um modal específico
    const openModal = (modalId) => {
        setActiveModal(modalId);
    };

    // Função para fechar qualquer modal aberto
    const closeModal = () => {
        setActiveModal(null);
    };

    return (
        <div>
            {buttonName !== '' && (
                <div className="d-flex gap-2 m-0 justify-content-start">
                    {/* Botão */}
                    <button
                        type="button"
                        className="btn btn m-0 p-0 text-start w-100"
                        onClick={() => openModal(idModal)}
                    >
                        {buttonName}
                    </button>
                </div>
            )}

            {/* Modal */}
            {activeModal === idModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{strTitleModal}</h5>
                                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {React.Children.map(children, (child, index) =>
                                    React.cloneElement(child, { key: `modal-child-${index}` })
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlurInTransparentModal;