// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Empresa\AppListarConteudo.jsx
import React from "react";
import { useEffect, useState } from "react";
import Loading from '../../components/Loading';
import ListActions from '../../components/Button/ListActions';
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
    lista,
    pagination,
    loading,
    debugMyPrint,
    fetchEmpresa,
    fetchPagination,
    formatDateToPTBR,
    width,
    token_csrf,
    children
}) => {
    // quantidade de paginas;
    const [currentPage, setCurrentPage] = useState(1);
    const [ifMobile, setIsMobile] = useState(false);
    const pageSize = 10;

    // Função para lidar com a mudança de página
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchEmpresa(newPage, pageSize);
        fetchPagination(newPage, pageSize);
    };

    // Carrega os dados iniciais
    useEffect(() => {
        fetchEmpresa(currentPage, pageSize);
        fetchPagination(currentPage, pageSize);
        // console.log('lista :: ', lista);
    }, []);

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
        <div className="w-full overflow-x-auto p-2">
            {children}
            <table className="table table-striped table-hover">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">SIGLA</th>
                        <th className="p-2">EMPRESA</th>
                        <th className="p-2">CNPJ</th>
                        <th className="p-2">ATIVO</th>
                        <th className="p-2">CONTATO</th>
                        <th className="p-2">AÇÃO</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key="loading-row" className="bg-gray-200 p-0 m-0 border text-center">
                        <td colSpan="6" className="bg-gray-200 p-0 m-0 border text-center">
                            {/* Exibindo o Loading independentemente do conteúdo da tabela */}
                            <Loading openLoading={loading} />
                        </td>
                    </tr>
                    {lista.map((listar, index) => (
                        <tr key={`item-${listar.id}-${index}`} className="hover:bg-gray-100">
                            <td className="p-2 border">{listar.cad_sigla_pronome_tratamento}</td>
                            <td className="p-2 border">{listar.cad_nome}</td>
                            <td className="p-2 border">{listar.cad_cnpj_cpf}</td>
                            <td className="p-2 border">
                                {(listar.cad_active === 'Y')
                                    ? (
                                        <div className="d-flex justify-content-center mb-2">
                                            <span className="badge text-bg-success">{`Ativo`}</span>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-center mb-2">
                                            <span className="badge text-bg-danger">{`Inativo`}</span>
                                        </div>
                                    )}
                            </td>
                            <td className="p-2 border">
                                {/* Botão transparente que chama o MODAL */}
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
                                <div className="d-flex justify-content-start mb-2">
                                    <BlurInTransparentModal
                                        idModal="modal-endereco"
                                        buttonName={`${listar.end_tipo_logradouro}, ${listar.end_logradouro}, Nº ${listar.end_numero}, Complemento ${listar.end_complemento}, Bairro ${listar.end_bairro}, CEP ${listar.end_cep},`}
                                        strTitleModal="Painel de Endereço"
                                        isOpenInitial={false}
                                    >
                                        <>
                                            <div>
                                                {/* Atualizar Endereço */}
                                                <AtualizarEndereco />
                                            </div>
                                            <div>
                                                {/* Cadastrar Endereço */}
                                                <CadastrarEndereco />
                                            </div>
                                        </>
                                    </BlurInTransparentModal>
                                </div>
                            </td>
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

            {/* Componente de Paginação *
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
            </nav>*/}
        </div>
    );
}

export default AppListarConteudo;