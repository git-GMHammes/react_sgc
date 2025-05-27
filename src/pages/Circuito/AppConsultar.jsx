// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Circuito\AppListar.jsx
import React, { useEffect, useState } from 'react';
import AppConsultarConteudo from './AppConsultarConteudo';
import CircuitoService from '../../services/circuito';
import JSONViewer from '../../components/JSONViewer';

const AppConsultar = () => {
    const [loading, setLoading] = useState(true);
    const [lista, setLista] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [debugMyPrint, setDebugMyPrint] = useState(false);

    const fetchCircuitos = async (page = 1, limit = 1000) => {
        try {
            setLoading(true);

            // Obter dados usando o método getAll do CircuitoService
            const response = await CircuitoService.getAll(page, limit);

            console.log('Resposta do getAll:', response);
            if (response.length > 0) {
                setLista(response);
            }
            setLoading(false);
        } catch (err) {
            console.error('Erro Circuito:', err);
            setLoading(false);
        }
    };

    const fetchPagination = async (page = 1, limit = 1000) => {
        try {
            setLoading(true);

            // Obter dados usando o método getAll do CircuitoService
            const response = await CircuitoService.getPagination(page, limit);

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

        fetchCircuitos();
        fetchPagination();
        setDebugMyPrint(true);

    }, []);

    return (
        <div>

            <h3> Consultar Circtuitos</h3>

            {loading && <p>Carregando dados...</p>}

            <AppConsultarConteudo
                lista={lista}
                pagination={pagination}
                loading={loading}
                debugMyPrint={debugMyPrint}
                fetchCircuitos={fetchCircuitos}
                fetchPagination={fetchPagination}
            >
            </AppConsultarConteudo>

            {(debugMyPrint) && (
                <div>
                    <JSONViewer
                        data={lista}
                        title="Resposta da API Circuitos"
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