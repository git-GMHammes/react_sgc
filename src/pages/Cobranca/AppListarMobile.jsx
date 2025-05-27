// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Contato\AppListarConteudo.jsx
import React from 'react';
import { useEffect, useState } from "react";
import ModalTeste from "../../components/Modal/BasicModal";
import Loading from '../../components/Loading';
import './styles.css';


const AppListarConteudo = ({
  lista,
  pagination,
  loading,
  debugMyPrint,
  fetchCobranca,
  fetchPagination,
  formatDateToPTBR,
  children,
}) => {

  // quantidade de paginas;
  const [currentPage, setCurrentPage] = useState(1);
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

  return (
    <div>
      {children}
      {/* Adiciona div com classe table-responsive para permitir rolagem horizontal em telas pequenas */}

      {lista.map((listar, index) => (
        <div>
          <div key={`${listar.id}${`index`}`} className="card mt-3">
            <div className="card-header">
              {listar.cad_sigla_pronome_tratamento}
            </div>
            <div className="card-body p-2">
              <a className="fw-bold text-warning-emphasis">Origem: </a>
              {listar.orig_id} {listar.orig_descricao}
              <br /><a className="fw-bold text-warning-emphasis">Nome: </a>{listar.cad_nome}
              <br /><a className="fw-bold text-warning-emphasis">Contato: </a>{listar.mail_email}
              <br />{listar.tel_numero}
              <br />{`${listar.end_tipo_logradouro} 
            ${listar.end_logradouro}, 
            ${listar.end_numero}, 
            ${listar.end_complemento}, 
            Bairro: ${listar.end_bairro}, 
            CEP: ${listar.end_cep}, 
            Cidade: ${listar.end_cidade} / ${listar.end_estado}`}
            </div>
            <div className='m-4'>
              <ModalTeste
                idModal={`testeModal_${listar.id}`}
                buttonName='Ação'
                strTitleModal='Aqui tem um Título'
                isOpenInitial={false}
              >
                KKKKK
              </ModalTeste>
            </div>
          </div>
        </div>
      ))}

      <div>
        {/* Componente de Paginação */}
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
        </nav>
      </div>

    </div>
  );
};

export default AppListarConteudo;