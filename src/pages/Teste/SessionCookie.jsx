// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\TesteSession\index.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const SessionCookie = () => {
  const [sessionData, setSessionData] = useState(null);
  const [cookieData, setCookieData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const removeCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log(`Cookie ${name} removido`);
  };

  const fetchSessionData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Utilizando o proxy configurado no vite.config.js
      const response = await axios.get('/api/index.php/sgcpro/autenticar/api/react', {
        withCredentials: true // Importante para receber e enviar cookies
      });

      setSessionData(response.data);
      console.log('Dados da sessão carregados:', response.data);

    } catch (err) {
      console.error('Erro ao carregar dados da sessão:', err);
      setError('Falha ao carregar dados da sessão: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getCookieData = () => {
    try {
      // Função para ler cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          const cookieValue = parts.pop().split(';').shift();
          try {
            // Tentar fazer decode do cookie
            return decodeURIComponent(cookieValue);
          } catch (e) {
            // Se falhar o decode, retornar o valor bruto
            console.error("Erro ao decodificar cookie:", e);
            return cookieValue;
          }
        }
        return null;
      };

      const govBrData = getCookie('gov_br_data');

      if (govBrData) {
        try {
          // Tentar fazer parse do JSON
          const parsedData = JSON.parse(govBrData);
          setCookieData(parsedData);
          console.log('Dados do cookie carregados:', parsedData);
        } catch (e) {
          console.error('Erro ao fazer parse do cookie:', e);
          setCookieData({ rawData: govBrData });
        }
      } else {
        console.log('Cookie gov_br_data não encontrado');
        setCookieData(null);
      }
    } catch (err) {
      console.error('Erro ao processar cookie:', err);
      setError('Falha ao processar cookie: ' + err.message);
    }
  };

  useEffect(() => {
    // Ao carregar o componente, buscar dados da sessão e verificar cookies
    fetchSessionData();
    getCookieData();
  }, []);

  return (
    <div className="mt-2">
      <h1 className="mb-4 m-2">Teste de Sessão e Cookies</h1>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Controle de Sessão</a>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsNavExpanded(!isNavExpanded)}
            aria-controls="navbarSessionControls" 
            aria-expanded={isNavExpanded} 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isNavExpanded ? 'show' : ''}`} id="navbarSessionControls">
            <div className="ms-auto d-flex mt-3">
              <button
                className="btn btn-primary me-2"
                onClick={fetchSessionData}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                {loading ? 'Carregando...' : 'Atualizar Dados da Sessão'}
              </button>
              <button
                className="btn btn-secondary me-2"
                onClick={getCookieData}
              >
                <i className="bi bi-file-earmark-binary me-1"></i>
                Verificar Cookies
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  removeCookie('gov_br_data');
                  setCookieData(null);
                  alert('Cookie removido! Recarregue a página para que o filtro crie um novo cookie.');
                }}
              >
                <i className="bi bi-trash me-1"></i>
                Limpar Cookie
              </button>
            </div>
          </div>
        </div>
      </nav>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="row m-0">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h2 className="h5 mb-0">Dados da Sessão</h2>
            </div>
            <div className="card-body">
              {sessionData ? (
                <pre className="mb-0">{JSON.stringify(sessionData, null, 2)}</pre>
              ) : (
                <p className="mb-0">Nenhum dado de sessão disponível</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h2 className="h5 mb-0">Dados do Cookie</h2>
            </div>
            <div className="card-body">
              {cookieData ? (
                <pre className="mb-0">{JSON.stringify(cookieData, null, 2)}</pre>
              ) : (
                <p className="mb-0">Nenhum cookie encontrado</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 mt-5" role="alert"> </div>
    </div>
  );
};

export default SessionCookie;