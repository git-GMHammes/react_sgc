// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\components\Modal\slideUpDownModal\index.jsx
import React, { useState, useEffect } from 'react';
import './style.css';

const SlideUpDownModal = ({
    idModal,
    buttonName,
    strTitleModal,
    children,
    isOpenInitial = false,
    direction = 'down' // Propriedade para definir a direção do slide ('up' ou 'down')
}) => {
    // Estado para controlar qual modal está aberto (nenhum por padrão)
    const [activeModal, setActiveModal] = useState(null);

    // Função para renderizar o conteúdo do botão
    const renderButtonContent = () => {
        // Verifica se buttonName começa com "bi bi-"
        if (buttonName.startsWith('bi bi-')) {
            // Renderiza apenas o ícone Bootstrap
            return <i className={buttonName}></i>;
        } else {
            // Renderiza o texto do botão normalmente
            return buttonName;
        }
    };

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
        return direction === 'up'
            ? 'modal-custom-slide-up'
            : 'modal-custom-slide-down';
    };

    return (
        <div>
            {buttonName !== '' && (
                <div className="d-flex gap-2 m-1 justify-content-center">
                    {/* Botão */}
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        onClick={() => openModal(idModal)}
                    >
                        {renderButtonContent()}
                    </button>
                </div>
            )}

            {/* Modal */}
            {activeModal === idModal && (
                <div className="modal-overlay-slide-updown">
                    <div className={`${getModalClass()} m-4 p-3`}>
                        {strTitleModal !== '' && (
                            <div className="modal-header">
                                <h3 className="modal-title">{strTitleModal}</h3>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                    aria-label="Close"
                                ></button>
                            </div>
                        )}
                        <div className="modal-body">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlideUpDownModal;