import React, { useEffect, useState } from 'react';
import AppConsultarConteudo from './AppConsultarConteudo';
import EmpresaService from '../../services/empresa';
import JSONViewer from '../../components/JSONViewer';

const AppConsultar = () => {
  const [loading, setLoading] = useState(true);
  const [lista, setLista] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [debugMyPrint, setDebugMyPrint] = useState(false);

  const fetchEmpresa = async (page = 1, limit = 1000) => {
      try {
          setLoading(true);

          // Obter dados usando o método getAll do EmpresaService
          const response = await EmpresaService.getAll(page, limit);

          console.log('Resposta do getAll:', response);
          if (response.length > 0) {
              setLista(response);
          }
          setLoading(false);
      } catch (err) {
          console.error('Erro Empresa:', err);
          setLoading(false);
      }
  };

  const fetchPagination = async (page = 1, limit = 1000) => {
      try {
          setLoading(true);

          // Obter dados usando o método getAll do EmpresaService
          const response = await EmpresaService.getPagination(page, limit);

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

      fetchEmpresa();
      fetchPagination();
      setDebugMyPrint(true);

  }, []);

  return (
      <div>

          <h3> Consultar Empresa</h3>

          {loading && <p>Carregando dados...</p>}

          <AppConsultarConteudo
              lista={lista}
              pagination={pagination}
              loading={loading}
              debugMyPrint={debugMyPrint}
              fetchEmpresa={fetchEmpresa}
              fetchPagination={fetchPagination}
          >
          </AppConsultarConteudo>

          {(debugMyPrint) && (
              <div>
                  <JSONViewer
                      data={lista}
                      title="Resposta da API Empresa"
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