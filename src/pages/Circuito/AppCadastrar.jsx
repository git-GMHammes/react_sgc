import React, { useEffect, useState } from 'react';
import AppForm from './AppForm';
import CircuitoService from '../../services/circuito';

const AppCadastrar = () => {

    const [token_csrf, setTokenCsrf] = useState('');

    const fetchEndpointCircuito = async () => {
        try {
            const response = await CircuitoService.getEndPoint();
            // console.log('fetchEndpointCircuito ::', response); 

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
                await fetchEndpointCircuito();

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
            />
        </div>
    );
};

export default AppCadastrar;