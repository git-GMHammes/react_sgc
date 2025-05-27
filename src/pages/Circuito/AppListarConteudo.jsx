// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\listar\AppListarConteudo.jsx
import React from "react";
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
    fetchCircuitos,
    fetchPagination,
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
        fetchCircuitos(newPage, pageSize);
        fetchPagination(newPage, pageSize);
    };

    // Carrega os dados iniciais
    useEffect(() => {
        fetchCircuitos(currentPage, pageSize);
        fetchPagination(currentPage, pageSize);
    }, []);

    return (
        <div className="container-fluid p-0">
            {children}
            {/* Adiciona div com classe table-responsive para permitir rolagem horizontal em telas pequenas */}
            <div className="table-responsive-sm">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">SIGLA</th>
                            <th className="p-2">NOME</th>
                            <th className="p-2">STATUS</th>
                            <th className="p-2">DATA ATIVAÇÃO</th>
                            <th className="p-2">VELOCIDADE Mbps</th>
                            <th className="p-2">SEI</th>
                            <th className="p-2">DATA CANCELAMENTO</th>
                            <th className="p-2">AÇÃO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="6" className="bg-gray-200 p-0 m-0 border text-center">
                                {/* Exibindo o Loading independentemente do conteúdo da tabela */}
                                <Loading openLoading={loading} />
                            </td>
                        </tr>
                        {lista.map((listar) => (
                            <tr key={listar.id} className="hover:bg-gray-100">
                                <td className="p-2 border">{listar.circ_sigla}</td>
                                <td className="p-2 border">{listar.circ_nome}</td>
                                <td className="p-2 border">
                                    {(listar.circ_active === 'Y')
                                        ? (
                                            <div className="d-flex justify-content-center mb-2">
                                                <span className="badge text-bg-success">{listar.circ_status}</span>
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-center mb-2">
                                                <span className="badge text-bg-danger">{listar.circ_status}</span>
                                            </div>
                                        )}
                                </td>
                                <td className="p-2 border">{listar.circ_data_ativacao}</td>
                                <td className="p-2 border">{listar.vel_velocidade}</td>
                                <td className="p-2 border">{listar.circ_SEI}</td>
                                <td className="p-2 border">{listar.circ_data_cancelamento}</td>
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
}

export default AppListarConteudo;