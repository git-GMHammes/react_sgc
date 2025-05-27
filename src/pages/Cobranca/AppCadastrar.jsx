// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Cobranca\AppCadastrar.jsx
import React, { useEffect, useState } from 'react';
import AppForm from './AppForm';
import CobrancaService from '../../services/cobranca';

const AppCadastrar = () => {

  const [token_csrf, setTokenCsrf] = useState('');


  const fetchEndpointCobranca = async () => {
    try {
      const response = await CobrancaService.getEndPoint();
      // console.log('fetchEndpointCobranca ::', response); 

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
      console.error('Erro circuitos:', err);
    }
  };

  useEffect(() => {

    const initializeData = async () => {
      try {
        await fetchEndpointCobranca();

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
      <AppForm
        token_csrf={token_csrf}
        getID={'17'}
      />
    </div>
  );

};

export default AppCadastrar;