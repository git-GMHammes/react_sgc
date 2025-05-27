// src\public\script\react_modelo_v1\frontend\src\components\Button\ListActions\index.jsx
import React, { Children, useEffect, useState } from "react";

// ListActions recebe getId como valor (não como função)
const ListActions = ({
  getId,
  isMobile = false,
  children
}) => {
  const [legenda, setLegenda] = useState('----------');
  // Estado para controlar o modal
  const [activeModal, setActiveModal] = useState(null);

  const handleMouseEnter = ($legenda) => {
    setLegenda($legenda);
  };

  const handleMouseLeave = () => {
    setLegenda('----------');
  };

  // Função para abrir o modal
  const openModal = (modalId) => {
    setActiveModal(modalId);
    document.body.classList.add('overflow-hidden');
  };

  // Função para fechar o modal
  const closeModal = () => {
    setActiveModal(null);
    document.body.classList.remove('overflow-hidden');
  };

  // Função para lidar com o clique de edição
  const handleEditClick = (id) => {
    console.log("Editando item com ID:", id);
    openModal(id); // Abre o modal com o ID
  };

  // Função para lidar com o clique de consulta
  const handleViewClick = (id) => {
    console.log("Consultando item com ID:", id);
    // Qualquer lógica adicional de consulta aqui
  };

  // Função para lidar com o clique de exclusão
  const handleDeleteClick = (id) => {
    console.log("Excluindo item com ID:", id);
    // Qualquer lógica adicional de exclusão aqui
  };

  const renderizeDrop = () => {
    return (
      <div className='me-2 d-flex align-items-center'>
        {/* Botão de editar - agora apenas abre o modal */}
        <button
          type="button"
          className="ms-2 btn btn-sm btn-primary"
          onMouseEnter={() => handleMouseEnter('Editar')}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleEditClick(getId)}
        >
          <i className="bi bi-pencil-square"></i>
        </button>
        <button
          type="button"
          className="ms-2 btn btn-sm btn-success"
          onMouseEnter={() => handleMouseEnter('Consultar')}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleViewClick(getId)}
        >
          <i className="bi bi-eye" />
        </button>
        <button
          type="button"
          className="ms-2 btn btn-sm btn-danger"
          onMouseEnter={() => handleMouseEnter('Excluir')}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleDeleteClick(getId)}
        >
          <i className="bi bi-trash3"></i>
        </button>

      </div>
    );
  }

  useEffect(() => {
    // console.log('Children do ListActions:', children);
  }, [children]);

  return (
    <div>

      {isMobile && (
        <div className='me-2 d-flex align-items-center w-100 m-2'>
          {renderizeDrop()}
        </div>
      )}

      {!isMobile && (
        <div>
          {/* Dropdown com botões */}
          <div className="btn-group dropstart">
            <button type="button" className="btn btn-secondary rounded-2" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-gear"></i>
            </button>
            <div className="dropdown-menu">
              <div className="d-flex justify-content-start" style={{ width: "300px" }}>
                {renderizeDrop()}
                <div className='me-2'>|</div>
                <div className='me-2'>
                  {legenda}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal independente - renderizado fora do dropdown */}
      {activeModal === getId && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar ID: {getId}</h5>
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

export default ListActions;