// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Circuito\AppListar.jsx
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import AppListarConteudo from './AppListarConteudo';
import CircuitoService from '../../services/circuito';
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
    const [loading, setLoading] = useState(false);
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
            id: null,
            circ_sigla: null,
            circ_nome: null,
            circ_active: null,
            circ_data_ativacao: null,
            vel_velocidade: null,
            circ_SEI: null,
            circ_data_cancelamento: null,
        }
    });

    // Monitor de valores em tempo real
    const formValues = useWatch({ control });

    // Log de valores quando mudam
    useEffect(() => {
        console.log('Valores do formulário atualizados:', formValues);
    }, [formValues]);

    // Função para submeter formulários específicos
    const submitAllForms = (filtroForm) => {
        const currentValues = getValues();

        switch (filtroForm) {
            case 'filtro-filtro-circuitos':
                fetchFilter(currentValues, page, limit);
                break;

            case 'filtro-filtro-limpar':
                reset();
                fetchCircuitos();
                fetchPagination();

                // Ou:
                // setValue('cad_sigla_pronome_tratamento', null);
                // setValue('circ_nome', null);
                // setValue('circ_active', 'gustavo@gmail.com');
                // setValue('circ_data_ativacao', null);
                // setValue('vel_velocidade', null);
                // setValue('circ_SEI', null);
                break;
            default:
                console.log('submitAllForms não encontrado:', filtroForm);
                break;
        }
        console.log('submitAllForms', filtroForm, currentValues);
    };

    // Evento de foco personalizado
    const handleInputFocus = (e) => {
        console.log('Campo recebeu foco:', e.target.name);
    };

    // Evento de blur personalizado
    const handleInputBlur = (e) => {
        console.log('Campo perdeu foco:', e.target.name);
    };

    const formatDateToPTBR = (dateString) => {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    };

    const fetchEndpointCircuitos = async () => {
        try {
            const response = await CircuitoService.getEndPoint();
            // console.log('fetchEndpointCircuito ::', response); 

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
            console.error('Erro circuitos:', err);
        }
    };

    const fetchCircuitos = async (page = 1, limit = 10) => {
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
            console.error('Erro circuitos:', err);
            setLoading(false);
        }
    };

    const fetchPagination = async (page = 1, limit = 10) => {
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

    // Função que será chamada quando o botão for clicado
    const filterOrigemClick = (id = '1') => {
        const currentValues = getValues();
        setValue('id', id);
        fetchFilter(currentValues, 1, 10);
    };

    const fetchFilter = async (data, page = 1, limit = 10) => {
        try {
            setLista([]);
            setLoading(true);

            const response = await CircuitoService.postFilter(data, page, limit);
            console.log('Resposta do postFilter:', response);

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
        console.log('Valores do formulário atualizados:', formValues);
    }, [formValues]);

    useEffect(() => {

        const initializeData = async () => {
            try {
                await fetchEndpointCircuitos();
                await fetchCircuitos(page, limit);
                await fetchPagination(page, limit);
                setDebugMyPrint(true);

            } catch (err) {
                console.error('Erro na inicialização dos dados:', err);

            } finally {
                console.log('useEffect finalizado');
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
                            submitAllForms(`filtro-filtro-circuitos`);
                        }}>
                        <input
                            className="form-control form-control-sm rounded-pill"
                            type="search"
                            placeholder="Sigla"
                            aria-label="Sigla"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            {...register('circ_sigla')}
                        />
                    </form>
                </div>

                <div className="col-12 col-sm-2">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-circuitos`);
                        }}>
                        <input
                            className="form-control form-control-sm rounded-pill"
                            type="search"
                            placeholder="Nome"
                            aria-label="Nome"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            {...register('circ_nome')}
                        />
                    </form>
                </div>

                <div className="col-12 col-sm-2">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-circuitos`);
                        }}>
                        <input
                            className="form-control form-control-sm rounded-pill"
                            type="search"
                            placeholder="Data Ativação"
                            aria-label="Data Ativação"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            {...register('circ_data_ativacao')}
                        />
                    </form>
                </div>

                <div className="col-12 col-sm-2">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-circuitos`);
                        }}>
                        <input
                            className="form-control form-control-sm rounded-pill"
                            type="search"
                            placeholder="Velocidade"
                            aria-label="Velocidade"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            {...register('vel_velocidade')}
                        />
                    </form>
                </div>

                <div className="col-12 col-sm-2">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-circuitos`);
                        }}>
                        <input
                            className="form-control form-control-sm rounded-pill"
                            type="search"
                            placeholder="SEI"
                            aria-label="SEI"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            {...register('circ_SEI')}
                        />
                    </form>
                </div>

                <div className="col-12 col-sm-2">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-circuitos`);
                        }}>
                        <input
                            className="form-control form-control-sm rounded-pill"
                            type="search"
                            placeholder="Data de Cancelamento"
                            aria-label="Data de Cancelamento"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            {...register('circ_data_cancelamento')}
                        />
                    </form>
                </div>

                <div className="col-12 col-sm-1">
                    <form
                        className="nav-item"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAllForms(`filtro-filtro-circuitos`);
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
                        idModal="modal-circuito"
                        buttonName="Cadastrar"
                        strTitleModal="Cadatrar Circuito"
                        isOpenInitial={false}
                    >

                        <AppForm
                            key={`form-circuito`}
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
            <h3 className="mb-0">Listar Circuitos</h3>
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

            {(width > 811) && (
                <div>
                    {/* Exibindo o conteúdo sempre, não apenas quando !loading */}
                    <AppListarConteudo
                        lista={lista}
                        pagination={pagination}
                        loading={loading}
                        debugMyPrint={debugMyPrint}
                        fetchCircuitos={fetchCircuitos}
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
                        title="Resposta da API Circuitos"
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