// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Cobranca\AppListarConteudo.jsx
import React from 'react';
import { useEffect, useState } from "react";
import Loading from '../../components/Loading';
import ListActions from '../../components/Button/ListActions';
import AppForm from './AppForm';
import './styles.css';

const AppListarConteudo = ({
  lista,
  pagination,
  loading,
  debugMyPrint,
  fetchCobranca,
  fetchPagination,
  formatDateToPTBR,
  width,
  token_csrf,
  children,
}) => {

  // quantidade de paginas;
  const [currentPage, setCurrentPage] = useState(1);
  const [ifMobile, setIsMobile] = useState(false);
  const pageSize = 10;

  // Função para lidar com a mudança de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchCobranca(newPage, pageSize);
    fetchPagination(newPage, pageSize);
  };

  // Carrega os dados iniciais
  useEffect(() => {
    fetchCobranca(currentPage, pageSize);
    fetchPagination(currentPage, pageSize);
  }, []);

  useEffect(() => {
    console.log('width :: ', width)
    if (width) {
      if (width <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
  }, [width])

  return (
    <div className="w-full overflow-x-auto p-2">
      {children}
      <table className="table table-striped table-hover">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">SECRETARIA</th>
            <th className="p-2">CONTATO</th>
            <th className="p-2">ATIVO</th>
            <th className="p-2">VELOCIDADE Mbps</th>
            <th className="p-2">CUSTO MENSAL</th>
            <th className="p-2">SEI</th>
            <th className="p-2">DATA INÍCIO</th>
            <th className="p-2">DATA FIM</th>
            <th className="p-2">AÇÃO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="8" className="bg-gray-200 p-0 m-0 border text-center">
              {/* Exibindo o Loading independentemente do conteúdo da tabela */}
              <Loading openLoading={loading} />
            </td>
          </tr>
          {lista.map((listar) => (
            <tr key={listar.id} className="hover:bg-gray-100">
              <td className="p-2 border">{listar.cad_sigla_pronome_tratamento}</td>
              <td className="p-2 border">{listar.cad_nome}<br />{listar.tel_numero}<br />{listar.email_email}</td>
              <td className="p-2 border">
                {(listar.cob_active === 'Y')
                  ? (
                    <div className="d-flex justify-content-center mb-2">
                      <span className="badge text-bg-success">Ativo</span>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center mb-2">
                      <span className="badge text-bg-danger">Inativo</span>
                    </div>
                  )}
              </td>
              <td className="p-2 border">{listar.vel_velocidade} Mbps</td>
              <td className="p-2 border">R$ {listar.cob_custo_mensal}</td>
              <td className="p-2 border">{listar.cob_SEI}</td>
              <td className="p-2 border">{formatDateToPTBR(listar.cob_data_inicio)}</td>
              <td className="p-2 border">{formatDateToPTBR(listar.cob_data_fim)}</td>
              <td className="p-2 border">
                {/* Boitões Padrões para Ações de Listas */}
                <ListActions
                  getId={listar.id}
                  isMobile={ifMobile}
                >
                  <AppForm
                    key={`form-${listar.id}`}
                    token_csrf={token_csrf}
                    getID={listar.id}
                  />
                </ListActions>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Componente de Paginação 
      <nav aria-label="Page navigation example" className="mt-4">
        <ul className="pagination pagination-sm justify-content-center">
          {pagination.map((page, index) => (
            <li
              key={index}
              className={`page-item ${page.disabled ? 'disabled' : ''} ${page.active ? 'active' : ''}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!page.disabled) {
                    // Extrair o número da página do href
                    const pageNumber = parseInt(page.href.split('=')[1]);
                    handlePageChange(pageNumber);
                  }
                }}
              >
                {page.text}
              </a>
            </li>
          ))}
        </ul>
      </nav> */}
    </div>
  );
}

export default AppListarConteudo;