// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Secretaria\AppCadastrar.jsx
import React, { useEffect, useState } from 'react';
import AppForm from './AppForm';
import SecretariaService from '../../services/secretaria';


const AppCadastrar = () => {

  const [token_csrf, setTokenCsrf] = useState('');

  const fetchEndpointSecretaria = async () => {
    try {
      const response = await SecretariaService.getEndPoint();
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
      console.error('Erro circuitos:', err);
    }
  };

  useEffect(() => {

    const initializeData = async () => {
      try {
        await fetchEndpointSecretaria();

      } catch (err) {
        console.error('Erro na inicialização dos dados:', err);

      } finally {
        console.log('useEffect finalizado');
      }
    };

    initializeData();

  }, []);

  return (
    <div className={`container`}>
      <AppForm
        token_csrf={token_csrf}
        getID={''}
      />
    </div>
  );
  
};

export default AppCadastrar;