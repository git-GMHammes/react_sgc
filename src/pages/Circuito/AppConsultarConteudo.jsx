// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Circuito\AppConsultarConteudo.jsx
import React from "react";
import { useEffect, useState } from "react";

const AppConsultarConteudo = ({
    lista,
    pagination,
    loading,
    debugMyPrint,
    fetchCircuitos,
    fetchPagination,
    children,
}) => {
    // quantidade de paginas;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10000;

    // função que devolve cor
    const getCorFundo = (operacional) => {
        if (operacional === 'Normal') {
            return 'success';
        } else if (operacional === 'Lento') {
            return 'warning';
        } else if (operacional === 'Desativado') {
            return 'danger';
        }
    };

    // Carrega os dados iniciais
    useEffect(() => {
        fetchCircuitos(currentPage, pageSize);
        fetchPagination(currentPage, pageSize);
    }, []);

    return (
            <div className="d-flex flex-wrap justify-content-center">
                {lista.map((listar) => (
                    <div className={`card border-${getCorFundo(listar.circ_operacao)} m-2`} style={{ width: '15rem' }}>
                        <div className="card-header">{listar.circ_nome}</div>
                        <div className={`card-body bg-${getCorFundo(listar.circ_operacao)} text-${listar.circ_operacao === 'Lento' ? 'black' : 'light'}`}>
                            <h6 className="card-title fs-6">{listar.circ_operacao}</h6>
                            <p className="card-text">
                                Orgão: {listar.circ_sigla} <br />
                                Tipo de Serviço: {listar.circ_tipo_servico} <br />
                                Velocidade: {listar.circ_velocidade} <br />
                                Data Ativação: {listar.circ_data_ativacao} <br />
                            </p>
                        </div>
                    </div>
                ))}
            </div>
    );
}

export default AppConsultarConteudo;