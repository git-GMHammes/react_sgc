import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { useForm, useWatch } from 'react-hook-form';
import JSONViewer from '../../components/JSONViewer';
import ToastsReact from '../../components/Message/Toasts';
import CobrancaService from '../../services/cobranca';
import SecretariaService from '../../services/secretaria';
import EmpresaService from '../../services/empresa';
import CircuitoService from '../../services/circuito';
import ContatoService from '../../services/contato';
import TelefoneService from '../../services/telefone';
import EmailService from '../../services/email';
import { Alert, Spinner } from 'react-bootstrap';

const AppForm = ({
  token_csrf = {},
  getID = null
}) => {

  const [secretarias, setSecretarias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [circuitos, setCircuitos] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [telefones, setTelefones] = useState([]);
  const [emails, setEmails] = useState([]);
  const [tokenCsrf, setTokenCsrf] = useState('');
  const [lista, setLista] = useState([]);
  const [debugMyPrint, setDebugMyPrint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [defaultHeader, setDefaultHeader] = useState('primary');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [messageToast, setMessageToast] = useState('...');
  const [showUpdateData, setShowUpdateData] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [customToasts, setCustomToasts] = useState([
    {
      title: "Toast com Spinner",
      strong: "Processando",
      time: "agora",
      variant: "info",
      opacity: "25",
      // Em vez de fornecer o JSX diretamente, use uma função
      renderChildren: () => (
        <div className="d-flex align-items-center">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>{messageToast}</span>
          {/* sigla_pronome_tratamento: '', */}
        </div>
      )
    }
  ]);

  // Configuração do formulário com react-hook-form
  const { register, control, setValue, getValues, reset, formState: { errors }, handleSubmit } = useForm({
    defaultValues: {
      token_csrf: token_csrf,

      // cob (cadastro principal)
      id: '',
      cob_circuito_id: '',
      cob_cadastro_secretaria_id: '',
      cob_cadastro_empresa_id: '',
      cob_active: '',
      cob_dia_cobrado: '',
      cob_data_inicio: '',
      cob_data_fim: '',
      cob_custo_mensal: '',
      cob_SEI: '',
      cob_upload: '',
      cob_created_by: '0',
      cob_created_by_name: 'unknown',
      cob_updated_by: '0',
      cob_updated_by_name: 'unknown',

      // circ (pro_circuito)
      circ_id: '',
      circ_cadastro_empresa_id: '',
      circ_cadastro_secretaria_id: '',
      circ_velocidade_id: '',
      circ_endereco_id: '',
      circ_sigla: '',
      circ_status: '',
      circ_active: 'Y',
      circ_nome: '',
      circ_data_ativacao: '',
      circ_data_cancelamento: '',
      circ_SEI: '',
      circ_operacao: '',
      circ_created_by: '0',
      circ_created_by_name: 'unknown',
      circ_updated_by: '0',
      circ_updated_by_name: 'unknown',
      circ_created_at: '',
      circ_updated_at: '',
      circ_deleted_at: '',
      circ_novo_cadastro_empresa_id: '',

      // cad (pro_cadastro)
      cad_id: '',
      cad_pro_origem_id: '',
      cad_tipo: '',
      cad_active: 'Y',
      cad_sigla_pronome_tratamento: '',
      cad_nome: '',
      cad_cnpj_cpf: '',
      cad_remember_token: '',
      cad_created_by: '0',
      cad_created_by_name: 'unknown',
      cad_updated_by: '0',
      cad_updated_by_name: 'unknown',
      cad_created_at: '',
      cad_updated_at: '',
      cad_deleted_at: '',

      // vel (pro_velocidade)
      vel_id: '',
      vel_cadastro_empresa_id: '',
      vel_active: 'Y',
      vel_tipo_servico: '',
      vel_velocidade: '',
      vel_link: '',
      vel_estoque: '',
      vel_custo_unitario: '',
      vel_created_by: '0',
      vel_created_by_name: 'unknown',
      vel_updated_by: '0',
      vel_updated_by_name: 'unknown',
      vel_created_at: '',
      vel_updated_at: '',
      vel_deleted_at: '',

      // tel (pro_cad_telefone)
      tel_id: '',
      tel_cadastro_id: '',
      tel_favorito: 'Y',
      tel_tipo: '',
      tel_numero: '',
      tel_created_by: '0',
      tel_created_by_name: 'unknown',
      tel_updated_by: '0',
      tel_updated_by_name: 'unknown',
      tel_created_at: '',
      tel_updated_at: '',
      tel_deleted_at: '',

      // email (pro_cad_email)
      email_id: '',
      email_cadastro_id: '',
      email_favorito: 'Y',
      email_tipo: '',
      email_email: '',
      email_created_by: '0',
      email_created_by_name: 'unknown',
      email_updated_by: '0',
      email_updated_by_name: 'unknown',
      email_created_at: '',
      email_updated_at: '',
      email_deleted_at: '',

      // campos de controle comuns
      created_at: '',
      updated_at: '',
      deleted_at: null,
    }
  });

  // id
  // cadastro_secretaria_id
  // cadastro_empresa_id
  // dia_cobrado
  // data_inicio
  // data_fim
  // SEI
  // upload
  // active (Erro Toda Cobrança deve conter itns ativos)

  // circuito_id (Erro 1 para N)
  // custo_mensal (Custo de TODOS os LINKs ativos)
  // created_by
  // created_by_name
  // updated_by
  // updated_by_name
  // created_at
  // updated_at
  // deleted_at

  // Funções de submissão para diferentes propósitos
  const salvarCobranca = (data) => {
    fetchSave(data);
    console.log('Salvando cobranca:', data);
  };

  const limparFormulario = () => {
    reset();
    // console.log('Formulário limpo');
  };

  const setUpFormHeader = async (Headermessage, Headerdefault) => {
    setConfirmationMessage(`/ ${Headermessage}`);
    setDefaultHeader(Headerdefault);
    return null;
  };

  const handleCancel = () => {
    // Implementar lógica de cancelamento (voltar para página anterior, etc.)
    // console.log('Ação cancelar');
  };

  const setUpToastMessage = async (toastMessage, toastStrong, toastVariant) => {

    setMessageToast(toastMessage);

    setTimeout(() => {
      if (messageToast !== '...') {
        setCustomToasts(prev => [
          {
            ...prev[0],
            title: "Cadastro de Cobranca",
            strong: toastStrong,
            time: "agora",
            delay: 1000,
            variant: toastVariant,
            opacity: "25",
            renderChildren: () => (
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle me-2"></i>
                <span>{messageToast}</span>
              </div>
            )
          }
        ]);
      }
    }, 300);
    setShowToast(true);
     
    return null;
  };

  const fetchSecretarias = async () => {
    try {
      console.log('Buscando secretarias...');
      setLoading(true);
      const response = await SecretariaService.getAll(1, 90000);
      console.log("Secretarias encontradas:", response);
      setSecretarias(response);
    } catch (err) {
      console.error("Erro ao buscar secretarias:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpresas = async () => {
    try {
      console.log('Buscando empresas...');
      setLoading(true);
      const response = await EmpresaService.getAll(1, 90000);
      console.log("Empresas encontradas:", response);
      setEmpresas(response);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCircuitos = async () => {
    try {
      console.log('Buscando circuitos...');
      setLoading(true);
      const response = await CircuitoService.getAll(1, 90000);
      console.log("Circuitos encontradas:", response);
      setCircuitos(response);
    } catch (err) {
      console.error("Erro ao buscar circuitos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContato = async () => {
    try {
      console.log('Buscando contatos...');
      setLoading(true);
      const response = await ContatoService.getAll(1, 90000);
      console.log("Contatos encontradas:", response);
      setContatos(response);
    } catch (err) {
      console.error("Erro ao buscar contatos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTelefone = async () => {
    try {
      console.log('Buscando telefones...');
      setLoading(true);
      const response = await TelefoneService.getAll(1, 90000);
      console.log("Telefones encontradas:", response);
      setTelefones(response);
    } catch (err) {
      console.error("Erro ao buscar telefones:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmail = async () => {
    try {
      console.log('Buscando emails...');
      setLoading(true);
      const response = await EmailService.getAll(1, 90000);
      console.log("Emails encontradas:", response);
      setEmails(response);
    } catch (err) {
      console.error("Erro ao buscar contatos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGetById = async (id = getID) => {
    try {
      const response = await CobrancaService.getById(id);
      return response;

    } catch (err) {
      console.error('Erro cobrança:', err);
    }
  };

  const fetchSave = async (data) => {
    try {
      setLoading(false);

      const response = await CobrancaService.postSave(data);
      // console.log('Resposta do postFilter:', response);

      setUpFormHeader('Erro ao salvar os Dados', 'danger');

      setUpFormHeader('Dados salvos com sucesso', 'success');

      setUpToastMessage('Origem salvo com sucesso!', 'Sucesso', 'success');

      setUpToastMessage('Erro ao salvar os Dados', 'Erro', 'danger');

      if (response.length > 0) {
        setLista(response);
      }

      setLoading(false);

    } catch (err) {
      console.error('Erro filtro:', err);
      setLoading(false);
    }
  };

  const carregarToken = async () => {
      const resultado = await CobrancaService.getEndPoint();
      if (resultado && resultado.token_csrf) {
        setTokenCsrf(resultado.token_csrf);
      } else {
        alert('Erro ao obter token CSRF.');
      }
    };

  const registerform = async () => {
    
    if(getID){
      const updateData = await fetchGetById(getID);
      // console.log('updateData :: ', updateData);

      if (updateData) {
        let dadosIniciais = {
          token_csrf: token_csrf || 'erro',

          id: updateData.id || '',
          cob_circuito_id: updateData.cob_circuito_id || '',
          cob_cadastro_secretaria_id: updateData.cob_cadastro_secretaria_id || '',
          cob_cadastro_empresa_id: updateData.cob_cadastro_empresa_id || '',
          cob_active: updateData.cob_active || '',
          cob_dia_cobrado: updateData.cob_dia_cobrado || '',
          cob_data_inicio: updateData.cob_data_inicio || '',
          cob_data_fim: updateData.cob_data_fim || '',
          cob_custo_mensal: updateData.cob_custo_mensal || '',
          cob_SEI: updateData.cob_SEI || '',
          cob_upload: updateData.cob_upload || '',
          cob_created_by: updateData.cob_created_by || '0',
          cob_created_by_name: updateData.cob_created_by_name || 'unknown',
          cob_updated_by: updateData.cob_updated_by || '0',
          cob_updated_by_name: updateData.cob_updated_by_name || 'unknown',

          circ_id: updateData.circ_id || '',
          circ_cadastro_empresa_id: updateData.circ_cadastro_empresa_id || '',
          circ_cadastro_secretaria_id: updateData.circ_cadastro_secretaria_id || '',
          circ_velocidade_id: updateData.circ_velocidade_id || '',
          circ_endereco_id: updateData.circ_endereco_id || '',
          circ_sigla: updateData.circ_sigla || '',
          circ_status: updateData.circ_status || '',
          circ_active: updateData.circ_active || 'Y',
          circ_nome: updateData.circ_nome || '',
          circ_data_ativacao: updateData.circ_data_ativacao || '',
          circ_data_cancelamento: updateData.circ_data_cancelamento || '',
          circ_SEI: updateData.circ_SEI || '',
          circ_operacao: updateData.circ_operacao || '',
          circ_created_by: updateData.circ_created_by || '0',
          circ_created_by_name: updateData.circ_created_by_name || 'unknown',
          circ_updated_by: updateData.circ_updated_by || '0',
          circ_updated_by_name: updateData.circ_updated_by_name || 'unknown',
          circ_created_at: updateData.circ_created_at || '',
          circ_updated_at: updateData.circ_updated_at || '',
          circ_deleted_at: updateData.circ_deleted_at || '',
          circ_novo_cadastro_empresa_id: updateData.circ_novo_cadastro_empresa_id || '',

          cad_id: updateData.cad_id || '',
          cad_pro_origem_id: updateData.cad_pro_origem_id || '',
          cad_tipo: updateData.cad_tipo || '',
          cad_active: updateData.cad_active || 'Y',
          cad_sigla_pronome_tratamento: updateData.cad_sigla_pronome_tratamento || '',
          cad_nome: updateData.cad_nome || '',
          cad_cnpj_cpf: updateData.cad_cnpj_cpf || '',
          cad_remember_token: updateData.cad_remember_token || token_csrf,
          cad_created_by: updateData.cad_created_by || '0',
          cad_created_by_name: updateData.cad_created_by_name || 'unknown',
          cad_updated_by: updateData.cad_updated_by || '0',
          cad_updated_by_name: updateData.cad_updated_by_name || 'unknown',
          cad_created_at: updateData.cad_created_at || '',
          cad_updated_at: updateData.cad_updated_at || '',
          cad_deleted_at: updateData.cad_deleted_at || '',

          vel_id: updateData.vel_id || '',
          vel_cadastro_empresa_id: updateData.vel_cadastro_empresa_id || '',
          vel_active: updateData.vel_active || 'Y',
          vel_tipo_servico: updateData.vel_tipo_servico || '',
          vel_velocidade: updateData.vel_velocidade || '',
          vel_link: updateData.vel_link || '',
          vel_estoque: updateData.vel_estoque || '',
          vel_custo_unitario: updateData.vel_custo_unitario || '',
          vel_created_by: updateData.vel_created_by || '0',
          vel_created_by_name: updateData.vel_created_by_name || 'unknown',
          vel_updated_by: updateData.vel_updated_by || '0',
          vel_updated_by_name: updateData.vel_updated_by_name || 'unknown',
          vel_created_at: updateData.vel_created_at || '',
          vel_updated_at: updateData.vel_updated_at || '',
          vel_deleted_at: updateData.vel_deleted_at || '',

          tel_id: updateData.tel_id || '',
          tel_cadastro_id: updateData.tel_cadastro_id || '',
          tel_favorito: updateData.tel_favorito || 'Y',
          tel_tipo: updateData.tel_tipo || '',
          tel_numero: updateData.tel_numero || '',
          tel_created_by: updateData.tel_created_by || '0',
          tel_created_by_name: updateData.tel_created_by_name || 'unknown',
          tel_updated_by: updateData.tel_updated_by || '0',
          tel_updated_by_name: updateData.tel_updated_by_name || 'unknown',
          tel_created_at: updateData.tel_created_at || '',
          tel_updated_at: updateData.tel_updated_at || '',
          tel_deleted_at: updateData.tel_deleted_at || '',

          email_id: updateData.email_id || '',
          email_cadastro_id: updateData.email_cadastro_id || '',
          email_favorito: updateData.email_favorito || 'Y',
          email_tipo: updateData.email_tipo || '',
          email_email: updateData.email_email || '',
          email_created_by: updateData.email_created_by || '0',
          email_created_by_name: updateData.email_created_by_name || 'unknown',
          email_updated_by: updateData.email_updated_by || '0',
          email_updated_by_name: updateData.email_updated_by_name || 'unknown',
          email_created_at: updateData.email_created_at || '',
          email_updated_at: updateData.email_updated_at || '',
          email_deleted_at: updateData.email_deleted_at || '',

          created_at: updateData.created_at || '',
          updated_at: updateData.updated_at || '',
          deleted_at: updateData.deleted_at || null,
        };
        reset(dadosIniciais);
      }
    } else {
      reset({
        token_csrf: token_csrf,
        id: '',
        cob_circuito_id: '',
        cob_cadastro_secretaria_id: '',
        cob_cadastro_empresa_id: '',
        cob_active: '',
        cob_dia_cobrado: '',
        cob_data_inicio: '',
        cob_data_fim: '',
        cob_custo_mensal: '',
        cob_SEI: '',
        cob_upload: '',
        cob_created_by: '',
        cob_created_by_name: '',
        cob_updated_by: '',
        cob_updated_by_name: '',

        circ_id: '',
        circ_cadastro_empresa_id: '',
        circ_cadastro_secretaria_id: '',
        circ_velocidade_id: '',
        circ_endereco_id: '',
        circ_sigla: '',
        circ_status: '',
        circ_active: '',
        circ_nome: '',
        circ_data_ativacao: '',
        circ_data_cancelamento: '',
        circ_SEI: '',
        circ_operacao: '',
        circ_created_by: '',
        circ_created_by_name: '',
        circ_updated_by: '',
        circ_updated_by_name: '',
        circ_created_at: '',
        circ_updated_at: '',
        circ_deleted_at: '',
        circ_novo_cadastro_empresa_id: '',

        cad_id: '',
        cad_pro_origem_id: '',
        cad_tipo: '',
        cad_active: '',
        cad_sigla_pronome_tratamento: '',
        cad_nome: '',
        cad_cnpj_cpf: '',
        cad_remember_token: '',
        cad_created_by: '',
        cad_created_by_name: '',
        cad_updated_by: '',
        cad_updated_by_name: '',
        cad_created_at: '',
        cad_updated_at: '',
        cad_deleted_at: '',

        vel_id: '',
        vel_cadastro_empresa_id: '',
        vel_active: '',
        vel_tipo_servico: '',
        vel_velocidade: '',
        vel_link: '',
        vel_estoque: '',
        vel_custo_unitario: '',
        vel_created_by: '',
        vel_created_by_name: '',
        vel_updated_by: '',
        vel_updated_by_name: '',
        vel_created_at: '',
        vel_updated_at: '',
        vel_deleted_at: '',

        tel_id: '',
        tel_cadastro_id: '',
        tel_favorito: '',
        tel_tipo: '',
        tel_numero: '',
        tel_created_by: '',
        tel_created_by_name: '',
        tel_updated_by: '',
        tel_updated_by_name: '',
        tel_created_at: '',
        tel_updated_at: '',
        tel_deleted_at: '',

        email_id: '',
        email_cadastro_id: '',
        email_favorito: '',
        email_tipo: '',
        email_email: '',
        email_created_by: '',
        email_created_by_name: '',
        email_updated_by: '',
        email_updated_by_name: '',
        email_created_at: '',
        email_updated_at: '',
        email_deleted_at: '',

        created_at: '',
        updated_at: '',
        deleted_at: '',
      });
    }
  };

  useEffect(() => {
    try {
      const startData = async () => {
        await fetchSecretarias();
        await fetchEmpresas();
        await fetchCircuitos();
        await fetchContato();
        await fetchTelefone();
        await fetchEmail();
      };

      startData();

    } catch (error) {
      console.error('Erro no useEffect:', error);

    } finally {
      console.log('#useEffect finalizado');
    }

    carregarToken();

  }, []);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {

    const initializeData = async () => {
      try {

        registerform();

      } catch (err) {
        console.error('Erro na inicialização dos dados:', err);

      } finally {
        console.log('useEffect finalizado');
      }
    };

    initializeData();
  }, [reset]);

  const renderCampoEmpresa = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formSec" className="form-label">Empresa*</label>
          <select
            className={`form-select ${errors.cob_cadastro_empresa_id ? 'is-invalid' : ''}`}
            id="formSec"
            name='cob_cadastro_empresa_id'
            value={debugMyPrint ? getValues('cob_cadastro_empresa_id') || '' : null}
            {...register('cob_cadastro_empresa_id', { required: 'Empresa é obrigatório' })}
          >
            <option value="">Selecione o tipo</option>
            {loading ? (
              <option>Carregando...</option>
            ) : (
              empresas.map((empresa, index) => (
                <option key={`${index}`} value={empresa.id}>
                  {debugMyPrint ? `${empresa.id} - ` : ''}{empresa.cad_sigla_pronome_tratamento}
                </option>
              ))
            )}
          </select>
          {errors.cad_sigla_pronome_tratamento && (
            <div className="invalid-feedback">
              {errors.cad_sigla_pronome_tratamento.message}
            </div>
          )}
        </div>
      </>
    );
  }

  const renderCampoCircuito = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formSec" className="form-label">Circuito*</label>
          <select
            className={`form-select ${errors.cob_circuito_id ? 'is-invalid' : ''}`}
            id="formSec"
            name='cob_circuito_id'
            value={debugMyPrint ? getValues('cob_circuito_id') || '' : null}
            {...register('cob_circuito_id', { required: 'Circuito é obrigatório' })}
          >
            <option value="">Selecione o tipo</option>
            {loading ? (
              <option>Carregando...</option>
            ) : (
              circuitos.map((circ, index) => (
                <option key={`${index}`} value={circ.id}>
                  {debugMyPrint ? `${circ.id} - ` : ''}{circ.circ_nome}
                </option>
              ))
            )}
          </select>
          {errors.circ_nome && (
            <div className="invalid-feedback">
              {errors.circ_nome.message}
            </div>
          )}
        </div>
      </>
    );
  }

  const renderCampoSecretaria = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formSec" className="form-label">Secretaria*</label>
          <select
            className={`form-select ${errors.cob_cadastro_secretaria_id ? 'is-invalid' : ''}`}
            id="formSec"
            name='cob_cadastro_secretaria_id'
            value={debugMyPrint ? getValues('cob_cadastro_secretaria_id') || '' : null}
            {...register('cob_cadastro_secretaria_id', { required: 'Secretaria é obrigatório' })}
          >
            <option value="">Selecione o tipo</option>
            {loading ? (
              <option>Carregando...</option>
            ) : (
              secretarias.map((sec, index) => (
                <option key={`${index}`} value={sec.id}>
                  {debugMyPrint ? `${sec.id} - ` : ''}{sec.cad_sigla_pronome_tratamento}
                </option>
              ))
            )}
          </select>
          {errors.cad_sigla_pronome_tratamento && (
            <div className="invalid-feedback">
              {errors.cad_sigla_pronome_tratamento.message}
            </div>
          )}
        </div>
      </>
    );
  }

  const renderCampoContato = () => {
    return (
      <>
        <label htmlFor="formActive" className="form-label">Contatos *</label>
        <div className="dropdown">
          <button
            type="button"
            className="btn text-start w-100 border"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-bs-auto-close="outside"
          >
            Listar Contatos
          </button>
          <div className="dropdown-menu p-4 w-100">
            <div className="w-100" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {/* <div className="d-flex justify-content-between mb-2">
                <a className='btn btn-primary w-100' href='#' role='button'>Listar Contatos</a>
              </div> */}
              <select
                className={`form-select ${errors.tel_numero ? 'is-invalid' : ''}`}
                id="formOrigem"
                {...register('tel_numero', { required: 'Origem é obrigatório' })}
              >
                <option value="">Selecione...</option>
                {telefones.map((telefone) => (
                  <option key={`tel-${telefone.id}`} value={telefone.id}>
                    {telefone.numero}
                  </option>
                ))}
              </select>
              <select
                className={`form-select ${errors.email_email ? 'is-invalid' : ''}`}
                id="formOrigem"
                {...register('email_email', { required: 'Origem é obrigatório' })}
              >
                <option value="">Selecione...</option>
                {emails.map((email) => (
                  <option key={`mail-${email.id}`} value={email.id}>
                    {email.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </>
    );
  }

  const renderCampoAtivo = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formActive" className="form-label">Ativo *</label>
          <select
            className="form-select"
            id="formActive"
            defaultValue={getValues('cob_active') || 'Y'}
            {...register('cob_active')}
          >
            <option value="Y">Sim</option>
            <option value="N">Não</option>
          </select>
        </div>
      </>
    );
  }

  const renderCampoCustoMensal = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formCusto" className="form-label">Custo Mensal *</label>
          <input
            type="number"
            className={`form-control ${errors.cob_custo_mensal ? 'is-invalid' : ''}`}
            id="formCusto"
            name='cob_custo_mensal'
            value={debugMyPrint ? getValues('cob_custo_mensal') || '' : null}
            {...register('cob_custo_mensal', { required: 'Cobrança é obrigatório' })}
          />
          {errors.cob_custo_mensal && (
            <div className="invalid-feedback">
              {errors.cob_custo_mensal.message}
            </div>
          )}
        </div>
      </>
    );
  }

  const renderCampoSEI = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formSEI" className="form-label">SEI</label>
          <input
            type="text"
            className={`form-control ${errors.cob_SEI ? 'is-invalid' : ''}`}
            id="formSEI"
            name='cob_SEI'
            value={debugMyPrint ? getValues('cob_SEI') || '' : null}
            {...register('cob_SEI', { required: 'Processo SEI é obrigatório' })}
          />
          {errors.cob_SEI && (
            <div className="invalid-feedback">
              {errors.cob_SEI.message}
            </div>
          )}
        </div>
      </>
    );
  }

  const renderDiaCobrado = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formData1" className="form-label">Dia Cobrado*</label>
          <input
            type="date"
            className={`form-control ${errors.cob_dia_cobrado ? 'is-invalid' : ''}`}
            id="formData1"
            name='cob_dia_cobrado'
            value={debugMyPrint ? getValues('cob_dia_cobrado') || '' : null}
            {...register('cob_dia_cobrado', { required: 'Dia Cobrado é obrigatório' })}
          />
          {errors.cob_dia_cobrado && (
            <div className="invalid-feedback">
              {errors.cob_dia_cobrado.message}
            </div>
          )}
        </div>
      </>
    );
  }

  const renderCobrancaDataInicio = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formData1" className="form-label">Data Inicio *</label>
          <input
            type="date"
            className={`form-control ${errors.cob_data_inicio ? 'is-invalid' : ''}`}
            id="formData1"
            name='cob_data_inicio'
            value={debugMyPrint ? getValues('cob_data_inicio') || '' : null}
            {...register('cob_data_inicio', { required: 'Data de Cobrança é obrigatória' })}
          />
          {errors.cob_data_inicio && (
            <div className="invalid-feedback">
              {errors.cob_data_inicio.message}
            </div>
          )}
        </div>
      </>
    );
  }

  const renderCobrancaDataFim = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formData2" className="form-label">Data Fim*</label>
          <input
            type="date"
            className={`form-control ${errors.cob_data_fim ? 'is-invalid' : ''}`}
            id="formData2"
            name='cob_data_fim'
            value={debugMyPrint ? getValues('cob_data_fim') || '' : null}
            {...register('cob_data_fim', { required: 'Data de Cobrança é obrigatória' })}
          />
          {errors.cob_data_fim && (
            <div className="invalid-feedback">
              {errors.cob_data_fim.message}
            </div>
          )}
        </div>
      </>
    );
  }

  const renderAddLink = () => {
    return (
      <>
        <label htmlFor="formData2" className="form-label">Importar Circuito(s) *</label>
        <div>
          <button className='btn btn-success w-100' type='button'><i className="bi bi-download"></i></button>
        </div>
      </>
    );
  }

  const renderRevisao = () => {
    return (
      <>
        <label htmlFor="formData2" className="form-label">Revisar *</label>
        <div>
          <button className='btn btn-warning w-100' type='button'><i className="bi bi-eye"></i></button>
        </div>
      </>
    );
  }

  const renderRowLogForm = () => {
    return (
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="formCreatedBy" className="form-label">Criado por</label>
            <input
              type="text"
              className="form-control bg-secondary"
              id="formCreatedBy"
              disabled
              {...register('created_by_name')}
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="formCreatedAt" className="form-label">Data de criação</label>
            <input
              type="text"
              className="form-control bg-secondary"
              id="formCreatedAt"
              disabled
              {...register('created_at')}
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="formUpdatedBy" className="form-label">Atualizado por</label>
            <input
              type="text"
              className="form-control bg-secondary"
              id="formUpdatedBy"
              disabled
              {...register('updated_by_name')}
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="formUpdatedAt" className="form-label">Data de atualização</label>
            <input
              type="text"
              className="form-control bg-secondary"
              id="formUpdatedAt"
              disabled
              {...register('updated_at')}
            />
          </div>
        </div>

      </div>
    );
  }

  const renderButtonCommands = () => {
    return (
      <>
        <div className="d-flex justify-content-end mt-4">

          <form
            className="nav-item"
            onSubmit={handleSubmit(limparFormulario)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          >
            <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
              Cancelar
            </button>
          </form>

          <form
            className="nav-item"
            onSubmit={handleSubmit(salvarCobranca)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          >
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <div className="form-container">
      {/* TOAST */}
      <ToastsReact
        showWithoutButton={showToast}
        position="top-center"
        toasts={customToasts.map(toast => ({
          ...toast,
          children: toast.renderChildren ? toast.renderChildren() : null
        }))}
      />

      <div className="row justify-content-center">
        <div className="col-lg-12 col-md-12">
          <div className="card">
            <div className={`card-header bg-${defaultHeader} text-white`}>
              <h4 className="mb-0">Formulário / Cobrança {confirmationMessage}</h4>
            </div>
            <div className="card-body">
              <form
                className="nav-item"
                onSubmit={handleSubmit(salvarCobranca)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >

                <div className="row mb-4">
                  <div className="form-group">
                    <input
                      type="hidden"
                      id="token_csrf"
                      {...register('token_csrf')}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="hidden"
                      className="form-control bg-secondary"
                      id="formEmailFav"
                      value="Y"
                      {...register('mail_favorito')}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="hidden"
                      className="form-control bg-secondary"
                      id="formTelefoneFav"
                      value="Y"
                      {...register('tel_favorito')}
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-12 col-sm-4">
                    {/*CAMPO SELECT SECRETARIA*/}
                    {renderCampoSecretaria()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/*CAMPO SELECT SECRETARIA*/}
                    {renderCampoCircuito()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/*CAMPO SELECT SECRETARIA*/}
                    {renderCampoEmpresa()}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-12 col-sm-4">
                    {/*CAMPO SELECT CONTATO*/}
                    {renderCampoContato()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/*CAMPO TXT SEI*/}
                    {renderCampoSEI()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/*CAMPO TEXT CUSTO MENSAL*/}
                    {renderCampoCustoMensal()}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-12 col-sm-4">
                    {/*CAMPO RADIO ATIVO*/}
                    {renderDiaCobrado()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/*CAMPO DATE INICIO*/}
                    {renderCobrancaDataInicio()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/*CAMPO DATE FIM*/}
                    {renderCobrancaDataFim()}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-12 col-sm-4">
                    {/*CAMPO RADIO ATIVO*/}
                    {renderCampoAtivo()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/* ADD LINK */}
                    {renderAddLink()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/* REVISÃO */}
                    {renderRevisao()}
                  </div>
                </div>

              {/* ROW DADOS DE LOG */}
              {renderRowLogForm()}

              </form>
              <div className="d-flex justify-content-end mt-4">
                {/* COMANDOS */}
                {renderButtonCommands()}
              </div>
            </div>
            <div className="card-footer text-muted">
              <small>* Campos obrigatórios</small>
            </div>
          </div>
        </div>
      </div>


      {(debugMyPrint) && (
        
        <div className='mt-3'>
          <JSONViewer
            data={secretarias}
            title="Resposta da API Secretarias"
            collapsed={true}
          />

          <JSONViewer
            data={showUpdateData}
            title="Resposta da API fetchGetById (Atualizar Contato)"
            collapsed={true}
          />
        </div>

      )}

      {/* Exibindo o Loading independentemente do conteúdo da tabela */}
      <Loading openLoading={loading} />
      
    </div>
  );

};

export default AppForm;