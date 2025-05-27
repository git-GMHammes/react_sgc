// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Origem\AppListar.jsx
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import AppListarConteudo from './AppListarConteudo';
import AppListarMobile from './AppListarMobile';
import OrigemService from '../../services/origem';
import JSONViewer from '../../components/JSONViewer';
import BlurInModal from '../../components/Modal/BlurInModal';
import AppForm from './AppForm';
import './styles.css';

// Hook para monitorar as dimensões da tela
const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        // Adicionar listener para redimensionamento
        window.addEventListener('resize', handleResize);

        // Remover listener ao desmontar
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
};

const AppListar = () => {
    const [loading, setLoading] = useState(true);
    const [lista, setLista] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [debugMyPrint, setDebugMyPrint] = useState(false);
    const [page, setPasetLimitge] = useState(1);
    const [limit, setLimit] = useState(10);
    const { width, height } = useWindowDimensions();
    const [token_csrf, setTokenCsrf] = useState('');

    // Configuração do React Hook Form
    const { register, control, setValue, getValues, reset } = useForm({
        defaultValues: {
            form_on: null,
            descricao: null,
            informação: null,
            created_by: null,
            created_by_name: null,
            update_by: null,
            update_by_name: null,
        }
    });

    // Monitor de valores em tempo real
    const formValues = useWatch({ control });

    // Log de valores quando mudam
    useEffect(() => {
        // console.log('Valores do formulário atualizados:', formValues);
    }, [formValues]);

    // Função para submeter formulários específicos
    const submitAllForms = (filtroForm) => {
        const currentValues = getValues();

        switch (filtroForm) {
            case 'filtro-filtro-origem':
                fetchFilter(currentValues, page, limit);
                break;

            case 'filtro-filtro-limpar':
                reset();
                fetchOrigem();
                fetchPagination();

                // Ou:
                // setValue('descricao', null);
                // setValue('informação', null);
                // setValue('created_by', 'null');
                // setValue('created_by_name', 'null');
                // setValue('update_by', null);
                // setValue('update_by_name', null);
                break;
            default:
                // console.log('submitAllForms não encontrado:', filtroForm);
                break;
        }
        // console.log('submitAllForms', filtroForm, currentValues);
    };

    // Evento de foco personalizado
    const handleInputFocus = (e) => {
        // console.log('Campo recebeu foco:', e.target.name);
    };

    // Evento de blur personalizado
    const handleInputBlur = (e) => {
        // console.log('Campo perdeu foco:', e.target.name);
    };

    const formatDateToPTBR = (dateString) => {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    };

    const fetchEndpointOrigem = async () => {
        try {
            const response = await OrigemService.getEndPoint();
            // console.log('fetchEndpointOrigem ::', response); 

            if (response !== false) {
                const { gov_br, token_csrf, getURI } = response;
                // console.log('gov_br:', gov_br);
                // console.log('token_csrf:', token_csrf);
                // console.log('getURI:', getURI);

                setTokenCsrf(token_csrf);

            } else {
                console.error('Erro: O Sistema não pode aceitar falha de Segurança!');
            }

        } catch (err) {
            console.error('Erro:', err);
        }
    };

    const fetchOrigem = async (page = 1, limit = 10) => {
        try {
            setLoading(true);

            // Obter dados usando o método getAll do OrigemService
            const response = await OrigemService.getAll(page, limit);
            // console.log('src/public/script/react_modelo_v1/frontend/src/pages/Origem/AppListar.jsx');
            // console.log('Resposta do getAll:', response);
            if (response.length > 0) {
                setLista(response);
            }
            setLoading(false);
        } catch (err) {
            console.error('Erro:', err);
            setLoading(false);
        }
    };

    const fetchPagination = async (page = 1, limit = 10) => {
        try {
            setLoading(true);

            // Obter dados usando o método getAll do OrigemService
            const response = await OrigemService.getPagination(page, limit);

            // console.log('Resposta do getPagination:', response);
            if (response.length > 0) {
                setPagination(response);
            }
            setLoading(false);
        } catch (err) {
            console.error('Erro pagination:', err);
            setLoading(false);
        }
    };

    const fetchFilter = async (data, page = 1, limit = 10) => {
        try {
            setLista([]);
            setLoading(true);

            const response = await OrigemService.postFilter(data, page, limit);
            // console.log('Resposta do postFilter:', response);

            if (response.length > 0) {
                setLista(response);
            }
            setLoading(false);
        } catch (err) {
            console.error('Erro filtro:', err);
            setLoading(false);
        }
    };

    // Log de valores quando mudam
    useEffect(() => {
        // console.log('Valores do formulário atualizados:', formValues);
    }, [formValues]);

    useEffect(() => {

        const initializeData = async () => {
            try {
                await fetchEndpointOrigem();
                await fetchOrigem(page, limit);
                await fetchPagination(page, limit);
                // setDebugMyPrint(true);

            } catch (err) {
                console.error('Erro na inicialização dos dados:', err);

            } finally {
                // console.log('useEffect finalizado');
            }
        };

        initializeData();

    }, []);

    // Renderização dos filtros
    const renderFiltro = () => {
        return (
            <div className="row g-2 justify-content-start w-100">
                <div className="col-12 col-sm-1">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-origem`);
                        }}>
                        <input
                            className="form-control form-control-sm rounded-pill"
                            type="search"
                            placeholder="Descrição"
                            aria-label="Descrição"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            {...register('descricao')}
                        />
                    </form>
                </div>

                <div className="col-12 col-sm-2">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-origem`);
                        }}>
                        <input
                            className="form-control form-control-sm rounded-pill"
                            type="search"
                            placeholder="Informação"
                            aria-label="Informação"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            {...register('informação')}
                        />
                    </form>
                </div>

                <div className="col-12 col-sm-2">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-origem`);
                        }}>
                        <input
                            className="form-control form-control-sm rounded-pill"
                            type="search"
                            placeholder="Criado por:"
                            aria-label="Criado por:"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            {...register('created_by_name')}
                        />
                    </form>
                </div>

                <div className="col-12 col-sm-2">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-origem`);
                        }}>
                        <input
                            className="form-control form-control-sm rounded-pill"
                            type="search"
                            placeholder="Atualizado por:"
                            aria-label="Atualizado por:"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            {...register('update_by_name')}
                        />
                    </form>
                </div>

                <div className="col-12 col-sm-1">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-origem`);
                        }}>
                        <button className="btn btn-sm btn-outline-success w-100 card rounded-pill" type="submit">
                            Filtrar
                        </button>
                    </form>
                </div>
            </div>

        );
    };

    const renderBtnFiltro = () => {
        return (
            <div className='d-flex justify-content-end w-100'>
                <div>
                    <BlurInModal
                        idModal="modal-origem"
                        buttonName="Cadastrar"
                        strTitleModal="Cadatrar Origem"
                        isOpenInitial={false}
                    >

                        <AppForm
                            key={`form-origem`}
                            token_csrf={token_csrf}
                            getID={null}
                        />

                    </BlurInModal>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h3> Listar Origem</h3>
            {(debugMyPrint) && (
                <span className="badge bg-secondary">
                    {width}x{height}px
                </span>
            )}

            {/* Formulário de Filtro */}
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">

                    {/* Limpeza do Filtro */}
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-limpar`);
                        }}>

                        {/* Limpeza do Filtro */}
                        <button
                            className="btn btn-sm btn-sm btn-outline-success w-100 card rounded-pill"
                            type="submit">
                            Limpar
                        </button>
                    </form>
                    <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav w-100 d-flex flex-wrap justify-content-center">

                            {/* Formulário de Filtro */}
                            {renderFiltro()}

                        </div>
                    </div>
                </div>
            </nav>

            {/* Botão Bootstrap com evento onClick */}
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav w-100 d-flex flex-wrap justify-content-start">

                            {/* Botão Bootstrap com evento onClick */}
                            {renderBtnFiltro()}

                        </div>
                    </div>
                </div>
            </nav>

            {(width < 811) && (
                <div>
                    {/* Exibindo o conteúdo sempre, não apenas quando !loading */}
                    <AppListarMobile
                        lista={lista}
                        pagination={pagination}
                        loading={loading}
                        debugMyPrint={debugMyPrint}
                        fetchOrigem={fetchOrigem}
                        fetchPagination={fetchPagination}
                        formatDateToPTBR={formatDateToPTBR}
                        width={width}
                        token_csrf={token_csrf}
                    >
                    </AppListarMobile>
                </div>
            )}

            {(width > 811) && (
                <div>
                    {/* Exibindo o conteúdo sempre, não apenas quando !loading */}
                    <AppListarConteudo
                        lista={lista}
                        pagination={pagination}
                        loading={loading}
                        debugMyPrint={debugMyPrint}
                        fetchOrigem={fetchOrigem}
                        fetchPagination={fetchPagination}
                        formatDateToPTBR={formatDateToPTBR}
                        token_csrf={token_csrf}
                    >
                    </AppListarConteudo>
                </div>
            )}

            {(debugMyPrint) && (
                <div>
                    <JSONViewer
                        data={lista}
                        title="Resposta da API Origem"
                        collapsed={true}
                    />
                    <JSONViewer
                        data={pagination}
                        title="Resposta da API Pagimnation"
                        collapsed={true}
                    />
                </div>
            )}

        </div>
    );
};

export default AppListar;