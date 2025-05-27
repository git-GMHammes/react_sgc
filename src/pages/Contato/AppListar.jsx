import React, { useState, useEffect } from 'react';
import { get, useForm, useWatch } from 'react-hook-form';
import AppListarConteudo from './AppListarConteudo';
import AppListarMobile from './AppListarMobile';
import ContatoService from '../../services/contato';
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
  const [getURI, setGetURI] = useState([]);
  const [uri, setUri] = useState(getURI);

  // Configuração do React Hook Form
  const { register, control, setValue, getValues, reset } = useForm({
    defaultValues: {
      orig_id: null,
      cad_sigla_pronome_tratamento: null,
      cad_nome: null,
      mail_email: null,
      tel_numero: null,
      end_bairro: null,
      end_logradouro: null,
    }
  });

  // Monitor de valores em tempo real
  const formValues = useWatch({ control });

  // Log de valores quando mudam
  useEffect(() => {
    // console.log('#Valores do formulário atualizados:', formValues);
  }, [formValues]);

  // Função para submeter formulários específicos
  const submitAllForms = (filtroForm) => {
    const currentValues = getValues();

    switch (filtroForm) {
      case 'filtro-filtro-contato':
        fetchFilter(currentValues, page, limit);
        break;

      case 'filtro-filtro-limpar':
        reset();
        fetchContato();
        fetchPagination();

        // Ou:
        // setValue('cad_sigla_pronome_tratamento', null);
        // setValue('cad_nome', null);
        // setValue('mail_email', 'gustavo@gmail.com');
        // setValue('tel_numero', null);
        // setValue('end_bairro', null);
        // setValue('end_logradouro', null);
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

  const fetchEndpointContato = async () => {
    try {
      const response = await ContatoService.getEndPoint('exibir');
      // console.log('fetchEndpointContato ::', response);

      if (response !== false) {
        const { gov_br, token_csrf, getURI } = response;
        // console.log('gov_br:', gov_br);
        // console.log('token_csrf:', token_csrf);
        console.log('getURI:', getURI);

        setTokenCsrf(token_csrf);
        setGetURI(getURI);

      } else {
        console.error('Erro: O Sistema não pode aceitar falha de Segurança!');
      }

    } catch (err) {
      console.error('Erro circuitos:', err);
    }
  };

  const fetchContato = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      // Obter dados usando o método getAll do ContatoService
      const response = await ContatoService.getAll(page = 1, limit = 10);

      // console.log('Resposta do getAll:', response);
      if (response.length > 0) {
        setLista(response);
      }
      setLoading(false);
    } catch (err) {
      console.error('Erro cobranças:', err);
      setLoading(false);
    }
  };

  const fetchPagination = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      // Obter dados usando o método getAll do ContatoService
      const response = await ContatoService.getPagination(page, limit);

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

  // Função que será chamada quando o botão for clicado
  const filterOrigemClick = (id = '1') => {
    const currentValues = getValues();
    setValue('orig_id', id);
    fetchFilter(currentValues, 1, 10);
  };

  const fetchFilter = async (data, page = 1, limit = 10) => {
    try {
      setLista([]);
      setLoading(true);

      const response = await ContatoService.postFilter(data, page, limit);
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

  const alterarUltimoElemento = (parameter) => {
    console.log('uri :: ', uri);
    if (uri.length === 0) return;
    const novaURI = [...uri];
    novaURI[novaURI.length - 1] = parameter;
    setUri(novaURI);
    console.log('URI alterada:', novaURI);
  };

  // Log de valores quando mudam
  useEffect(() => {
    // console.log('Valores do formulário atualizados:', formValues);
  }, [formValues]);

  useEffect(() => {

    const initializeData = async () => {
      try {
        await fetchEndpointContato();
        await fetchContato(page, limit);
        await fetchPagination(page, limit);
        setDebugMyPrint(true);
      } catch (err) {
        console.error('Erro na inicialização dos dados:', err);

      } finally {
        // console.log('useEffect finalizado');
      }
    };

    initializeData();

  }, []);

  useEffect(() => {
    // console.log('getURI/useEffect :: ', getURI);
    setUri(getURI);
  }, [getURI]);

  // Renderização dos filtros
  const renderFiltro = () => {
    return (
      <div className="row g-2 justify-content-start w-100">
        <div className="col-12 col-sm-1">
          <form
            className="nav-item"
            onSubmit={(e) => {
              e.preventDefault();
              submitAllForms(`filtro-filtro-contato`);
            }}>
            <input
              className="form-control form-control-sm rounded-pill"
              type="search"
              placeholder="Sigla"
              aria-label="Sigla"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              {...register('cad_sigla_pronome_tratamento')}
            />
          </form>
        </div>

        <div className="col-12 col-sm-2">
          <form
            className="nav-item"
            onSubmit={(e) => {
              e.preventDefault();
              submitAllForms(`filtro-filtro-contato`);
            }}>
            <input
              className="form-control form-control-sm rounded-pill"
              type="search"
              placeholder="Nome"
              aria-label="Nome"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              {...register('cad_nome')}
            />
          </form>
        </div>

        <div className="col-12 col-sm-2">
          <form
            className="nav-item"
            onSubmit={(e) => {
              e.preventDefault();
              submitAllForms(`filtro-filtro-contato`);
            }}>
            <input
              className="form-control form-control-sm rounded-pill"
              type="search"
              placeholder="E-mail"
              aria-label="E-mail"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              {...register('mail_email')}
            />
          </form>
        </div>

        <div className="col-12 col-sm-2">
          <form
            className="nav-item"
            onSubmit={(e) => {
              e.preventDefault();
              submitAllForms(`filtro-filtro-contato`);
            }}>
            <input
              className="form-control form-control-sm rounded-pill"
              type="search"
              placeholder="Telefone"
              aria-label="Telefone"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              {...register('tel_numero')}
            />
          </form>
        </div>

        <div className="col-12 col-sm-2">
          <form
            className="nav-item"
            onSubmit={(e) => {
              e.preventDefault();
              submitAllForms(`filtro-filtro-contato`);
            }}>
            <input
              className="form-control form-control-sm rounded-pill"
              type="search"
              placeholder="Bairro"
              aria-label="Bairro"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              {...register('end_bairro')}
            />
          </form>
        </div>

        <div className="col-12 col-sm-2">
          <form
            className="nav-item"
            onSubmit={(e) => {
              e.preventDefault();
              submitAllForms(`filtro-filtro-contato`);
            }}>
            <input
              className="form-control form-control-sm rounded-pill"
              type="search"
              placeholder="Endereço"
              aria-label="Endereço"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              {...register('end_logradouro')}
            />
          </form>
        </div>

        <div className="col-12 col-sm-1">
          <form
            className="nav-item"
            onSubmit={(e) => {
              e.preventDefault();
              submitAllForms(`filtro-filtro-contato`);
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
      <div
        className='d-flex justify-content-end w-100'
      >
        <div
          onMouseEnter={() => alterarUltimoElemento('cadastrar')}
        >
          <BlurInModal
            idModal="modal-contato"
            buttonName="Cadastrar"
            strTitleModal="Cadatrar Contato"
            isOpenInitial={false}
          >
            {/* APPFORM */}
            <AppForm
              getURI={uri}
              key={`form-contato`}
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
      <h3 className="mb-0">Lista de Contatos</h3>
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
            getURI={getURI}
            lista={lista}
            pagination={pagination}
            loading={loading}
            debugMyPrint={debugMyPrint}
            fetchContato={fetchContato}
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
            getURI={getURI}
            lista={lista}
            pagination={pagination}
            loading={loading}
            debugMyPrint={debugMyPrint}
            fetchContato={fetchContato}
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
            title="Resposta da API Contato"
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