// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Teste\PaginaModal.jsx
import React from 'react';
import Calculator from '../../components/Tool/Calculator';

const PaginaTools = () => {
  return (
    <div className="container mt-4">
      <Calculator
        idModal="modalBasic1"
        buttonName="Básico"
        strTitleModal="Modal Basic"
      />
    </div>
  );
};

export default PaginaTools;