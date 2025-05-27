import React from 'react';
import AppForm from './AppForm'
import Loading from '../../components/Loading';

const AppAtualizar = () => {
  return (
    <div className={`container`}>
      {/* Exibindo o Loading independentemente do conteúdo da tabela */}
      <AppForm
        token_csrf={token_csrf}
        getID={'17'}
      />
    </div>
  );
};

export default AppAtualizar;