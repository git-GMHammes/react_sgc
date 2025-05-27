// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Circuito\AppConsultarConteudo.jsx
import React from "react";
import { useEffect, useState } from "react";

const AppConsultarConteudo = ({
    getURI = [],
    lista,
    pagination,
    loading,
    debugMyPrint,
    fetchContato,
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
        fetchContato(currentPage, pageSize);
        fetchPagination(currentPage, pageSize);
        console.log('------------------');
        console.log('getURI :: ', getURI);
    }, []);

    return (
        <div className="d-flex flex-wrap justify-content-center">
            {lista.map((listar) => (
                <div className={`card border-${getCorFundo(listar.circ_operacao)} m-2`} style={{ width: '15rem' }}>
                    <div className="card-header">{listar.circ_nome}</div>
                    <div className={`card-body bg-${getCorFundo(listar.circ_operacao)} text-${listar.circ_operacao === 'Lento' ? 'black' : 'light'}`}>
                        <h6 className="card-title fs-6">{listar.circ_operacao}</h6>
                        <p className="card-text">
                            Orgão: {listar.cad_sigla_pronome_tratamento} <br />
                            Email: {listar.mail_email} <br />
                            Telefone: {listar.tel_numero} <br />
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AppConsultarConteudo;