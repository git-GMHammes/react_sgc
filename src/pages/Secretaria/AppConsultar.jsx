import React, { useEffect, useState } from 'react';
import AppConsultarConteudo from './AppConsultarConteudo';
import SecretariaService from '../../services/secretaria';
import JSONViewer from '../../components/JSONViewer';

const AppConsultar = () => {
  const [loading, setLoading] = useState(true);
  const [lista, setLista] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [debugMyPrint, setDebugMyPrint] = useState(false);

  const fetchSecretaria = async (page = 1, limit = 1000) => {
      try {
          setLoading(true);

          // Obter dados usando o método getAll do SecretariaService
          const response = await SecretariaService.getAll(page, limit);

          console.log('Resposta do getAll:', response);
          if (response.length > 0) {
              setLista(response);
          }
          setLoading(false);
      } catch (err) {
          console.error('Erro Secretaria:', err);
          setLoading(false);
      }
  };

  const fetchPagination = async (page = 1, limit = 1000) => {
      try {
          setLoading(true);

          // Obter dados usando o método getAll do SecretariaService
          const response = await SecretariaService.getPagination(page, limit);

          console.log('Resposta do getPagination:', response);
          if (response.length > 0) {
              setPagination(response);
          }
          setLoading(false);
      } catch (err) {
          console.error('Erro pagination:', err);
          setLoading(false);
      }
  };

  useEffect(() => {

      fetchSecretaria();
      fetchPagination();
      setDebugMyPrint(true);

  }, []);

  return (
      <div>

          <h3> Consultar Secretaria</h3>

          {loading && <p>Carregando dados...</p>}

          <AppConsultarConteudo
              lista={lista}
              pagination={pagination}
              loading={loading}
              debugMyPrint={debugMyPrint}
              fetchSecretaria={fetchSecretaria}
              fetchPagination={fetchPagination}
          >
          </AppConsultarConteudo>

          {(debugMyPrint) && (
              <div>
                  <JSONViewer
                      data={lista}
                      title="Resposta da API Secretaria"
                      collapsed = {true}
                  />
                  <JSONViewer
                      data={pagination}
                      title="Resposta da API Pagimnation"
                      collapsed = {true}
                  />
              </div>
          )}

      </div>
  );
};

export default AppConsultar;