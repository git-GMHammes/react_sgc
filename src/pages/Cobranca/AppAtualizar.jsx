import React from 'react';
import Loading from '../../components/Loading';

const AppAtualizar = () => {
  return (
    <div className={`container`}>
      {/* Exibindo o Loading independentemente do conteúdo da tabela */}
      <Loading openLoading={true} />
    </div>
  );
};

export default AppAtualizar;