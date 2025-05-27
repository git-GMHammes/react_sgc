import React, { useEffect, useState } from 'react';
import AppForm from './AppForm';
import EmpresaService from '../../services/empresa';

const AppAtualizar = () => {

  const [token_csrf, setTokenCsrf] = useState('');

  const fetchEndpointEmpresa = async () => {
    try {
      const response = await EmpresaService.getEndPoint();
      // console.log('fetchEndpointEmpresa ::', response); 

      if (response !== false) {
        const { gov_br, token_csrf, getURI } = response;
        // console.log('gov_br:', gov_br);
        // console.log('token_csrf:', token_csrf);
        // console.log('getURI:', getURI);

        setTokenCsrf(token_csrf);

      } else {
        console.error('Erro: O Sistema não pode aceitar falha de Segurança!');
      }

    } catch (err) {
      console.error('Erro:', err);
    }
  };

  useEffect(() => {

    const initializeData = async () => {
      try {
        await fetchEndpointEmpresa();

      } catch (err) {
        console.error('Erro na inicialização dos dados:', err);

      } finally {
        console.log('useEffect finalizado');
      }
    };

    initializeData();

  }, []);

  return (
    <div>
      {token_csrf}
      <AppForm
        token_csrf={token_csrf}
        getID={'0'}
      />
    </div>
  );

};

export default AppAtualizar;