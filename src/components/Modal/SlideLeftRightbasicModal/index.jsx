// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\components\Modal\slideModal\index.jsx
import React, { useState, useEffect } from 'react';
import './style.css';

const ModalSlide = ({ 
  idModal, 
  buttonName, 
  strTitleModal, 
  children, 
  isOpenInitial = false,
  direction = 'left' // Propriedade adicional para definir a direção do slide ('left' ou 'right')
}) => {
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

    // Determina qual classe CSS usar com base na direção
    const getModalClass = () => {
        return direction === 'right' 
            ? 'modal-custom-slide-right' 
            : 'modal-custom-slide-left';
    };

    return (
        <div>
            {buttonName !== '' && (
                <div className="d-flex gap-2 m-1 justify-content-center">
                    {/* Botão */}
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => openModal(idModal)}
                    >
                        {buttonName}
                    </button>
                </div>
            )}

            {/* Modal */}
            {activeModal === idModal && (
                <div className="modal-overlay-slide">
                    <div className={`${getModalClass()} m-4 p-3`}>
                        <div className="modal-header">
                            <h3 className="modal-title">{strTitleModal}</h3>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalSlide;