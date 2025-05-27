// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Contato\AppListarConteudo.jsx
import React from 'react';
import { useEffect, useState } from "react";
import Loading from '../../components/Loading';
import ListActions from '../../components/Button/ListActions';
import JSONViewer from '../../components/JSONViewer';
import BlurInTransparentModal from '../../components/Modal/BlurInTransparentModal';
import AppForm from './AppForm';
import AtualizarTelefone from '../Telefone/AppAtualizar.jsx';
import CadastrarTelefone from '../Telefone/AppCadastrar.jsx';
import AtualizarEmail from '../Email/AppAtualizar.jsx';
import CadastrarEmail from '../Email/AppCadastrar.jsx';
import AtualizarEndereco from '../Endereco/AppAtualizar.jsx';
import CadastrarEndereco from '../Endereco/AppCadastrar.jsx';
import './styles.css';

const AppListarConteudo = ({
  getURI = [],
  lista,
  pagination,
  loading,
  debugMyPrint,
  fetchContato,
  fetchPagination,
  formatDateToPTBR,
  width,
  token_csrf,
  children,
}) => {

  // quantidade de paginas;
  const [currentPage, setCurrentPage] = useState(1);
  const [ifMobile, setIsMobile] = useState(false);
  const [uri, setUri] = useState(getURI);
  const pageSize = 10;

  // Função para lidar com a mudança de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchContato(newPage, pageSize);
    fetchPagination(newPage, pageSize);
  };

  const alterarUltimoElemento = (parameter) => {
    console.log('uri :: ', uri);
    if (uri.length === 0) return;
    const novaURI = [...uri];
    novaURI[novaURI.length - 1] = parameter;
    setUri(novaURI);
    console.log('URI alterada:', novaURI);
  };

  // Carrega os dados iniciais
  useEffect(() => {
    fetchContato(currentPage, pageSize);
    fetchPagination(currentPage, pageSize);
  }, []);

  useEffect(() => {
    // console.log('getURI/useEffect :: ', getURI);
    setUri(getURI);
  }, [getURI]);

  useEffect(() => {
    // console.log('width :: ', width)
    if (width) {
      if (width <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
  }, [width])

  return (
    <div className="container-fluid p-0">
      {children}
      {/* Adiciona div com classe table-responsive para permitir rolagem horizontal em telas pequenas */}
      <div className="table-responsive-sm">
        <table className="table table-striped table-hover">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ORIGEM</th>
              <th className="p-2">SECRETARIA</th>
              <th className="p-2">CONTATO</th>
              <th className="p-2">AÇÃO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="bg-gray-200 p-0 m-0 border text-center">
                {/* Exibindo o Loading independentemente do conteúdo da tabela */}
                <Loading openLoading={loading} />
              </td>
            </tr>
            {lista.map((listar, index) => (
              <tr key={`${listar.id}${index}`} className="hover:bg-gray-100">
                <td className="p-2 border">
                  {listar.orig_descricao}
                </td>
                <td className="p-2 border">
                  {listar.id} {listar.cad_sigla_pronome_tratamento} {listar.cad_nome}
                </td>
                <td className="p-2 border">
                  {/* Botão transparente que chama o MODAL */}
                  <BlurInTransparentModal
                    idModal="modal-Email"
                    buttonName={listar.mail_email}
                    strTitleModal="Painel de E-mail"
                    isOpenInitial={false}
                  >
                    <>
                      {(listar.mail_id) ? (
                        <>
                          <div>
                            {/* Atualizar Email */}
                            <AtualizarEmail
                              token_csrf={token_csrf}
                              getID={listar.mail_id}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            {/* Cadastrar Email */}
                            <CadastrarEmail />
                          </div>
                        </>
                      )}
                    </>
                  </BlurInTransparentModal>
                  <BlurInTransparentModal
                    idModal="modal-telefone"
                    buttonName={listar.tel_numero}
                    strTitleModal="Painel de Telefone"
                    isOpenInitial={false}
                  >
                    <>
                      <div>
                        {/* Atualizar Telefone */}
                        <AtualizarTelefone />
                      </div>
                      <div>
                        {/* Cadastrar Telefone */}
                        <CadastrarTelefone />
                      </div>
                    </>
                  </BlurInTransparentModal>
                  {listar.end_tipo_logradouro} {listar.end_logradouro}, {listar.end_numero}, {listar.end_complemento}, Bairro: {listar.end_bairro}, CEP: {listar.end_cep}, Cidade: {listar.end_cidade} / {listar.end_estado}
                </td>
                <td
                  className="p-2 border"
                >
                  {/* BOTÕES PADRÕES PARA AÇÕES DE LISTAS */}
                  <div
                  onMouseEnter={() => alterarUltimoElemento('atualizar')}
                  >
                    <ListActions
                      getId={listar.id}
                      isMobile={ifMobile}
                    >
                      {/* APPFORM */}
                      <AppForm
                        getURI={uri}
                        key={`form-${listar.id}`}
                        token_csrf={token_csrf}
                        getID={listar.id}
                      />
                    </ListActions>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
};

export default AppListarConteudo;