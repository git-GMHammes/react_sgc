import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { set, useForm, useWatch } from 'react-hook-form';
import ContatoService from '../../services/contato';
import TelefoneService from '../../services/telefone';
import EmailService from '../../services/email';
import SecretariaService from '../../services/secretaria';
import ToastsReact from '../../components/Message/Toasts';
import JSONViewer from '../../components/JSONViewer';
import { Alert, Spinner } from 'react-bootstrap';
// Descobrir pq está duplicado aqui e no main.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import { start } from '@popperjs/core';

const AppForm = ({
  getURI = [],
  token_csrf = {},
  getID = null
}) => {
  const [debugMyPrint, setDebugMyPrint] = useState(true);
  const [secretarias, setSecretarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultHeader, setDefaultHeader] = useState('primary');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [toastMessages, setToastMessages] = useState([]);
  const [showUpdateData, setShowUpdateData] = useState([]);

  // Configuração do formulário com react-hook-form
  const { register, control, setValue, getValues, reset, formState: { errors }, handleSubmit } = useForm({
    defaultValues: {
      token_csrf: token_csrf,
      id: '',
      pro_origem_id: '6',
      tipo: 'Contato',
      sigla_pronome_tratamento: '',
      cnpj_cpf: '',
      tipo_email: '',
      email: '',
      tipo_numero: '',
      numero: '',
      created_at: '',
      updated_at: '',
      created_by: '',
      created_by_name: '',
      updated_by: '',
      updated_by_name: '',
      active: '',
      deleted_at: ''
    }
  });

  const salvarContato = (data) => {
    fetchSave(data);
    console.log('Salvando contato:', data);
  };

  const limparFormulario = () => {
    reset();
    console.log('Formulário limpo');
  };

  const handleCancel = () => {
    // Implementar lógica de cancelamento (voltar para página anterior, etc.)
    console.log('Ação cancelar');
  };

  const maskPhone = (input) => {

    let numbers = input.replace(/[^\d]/g, '');

    let isCell = numbers.length > 10 && numbers[2] === '9';

    let masked = '';
    if (numbers.length === 0) return masked;

    if (isCell) {
      masked += '(' + numbers.substring(0, 2);
      if (numbers.length >= 2) masked += ') ';
      if (numbers.length >= 3) masked += numbers[2] + ' ';
      if (numbers.length >= 7) {
        masked += numbers.substring(3, 7) + '-' + numbers.substring(7, 11);
      } else if (numbers.length > 3) {
        masked += numbers.substring(3);
      }
    } else {
      masked += '(' + numbers.substring(0, 2);
      if (numbers.length >= 2) masked += ') ';
      if (numbers.length >= 6) {
        masked += numbers.substring(2, 6) + '-' + numbers.substring(6, 10);
      } else if (numbers.length > 2) {
        masked += numbers.substring(2);
      }
    }

    return masked;
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    setValue('numero', maskPhone(value));

    const data = {
      tel_numero: value,
    };

    setTimeout(() => {
      fetchFilterPhone(data);
    }, 100);

  };

  const handlePhoneBlur = async (e) => {
    const value = e.target.value;
    setValue('numero', value);

    const data = {
      tel_numero: value,
    };

    console.log('data:', data);


    const getPhone = await fetchFilterPhone(data);
    if (
      getPhone[0] !== undefined &&
      value !== ''
    ) {
      console.log('getPhone:', getPhone);
      addToast('Cuidado', 'Telefone já foi cadastrado no Sistema!', 'warning', 5000);

    }
  };

  const handleEmailBlur = async (e) => {
    const value = e.target.value;
    setValue('email', value);

    const data = {
      email_email: value,
    };

    console.log('data:', data);

    const getEmail = await fetchFilterMail(data);

    if (
      getEmail[0] !== undefined &&
      value !== ''
    ) {
      console.log('getEmail:', getEmail);
      addToast('Cuidado', 'E-mail já foi cadastrado no Sistema!', 'warning', 5000);
    }

  };

  const clearAllToasts = () => {
    setToastMessages([]);
  };

  const addToast = (title, message, variant = 'info', delay = 5000) => {
    const newToast = {
      id: Date.now() + Math.random(), // ID único
      title: title,
      body: message,
      variant: variant,
      delay: delay,
      autohide: true,
      time: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setToastMessages(prev => [...prev, newToast]);

    // Remove o toast após o delay
    setTimeout(() => {
      setToastMessages(prev => prev.filter(toast => toast.id !== newToast.id));
    }, delay);
  };

  const setUpFormHeader = async (Headermessage, Headerdefault) => {
    setConfirmationMessage(`/ ${Headermessage}`);
    setDefaultHeader(Headerdefault);
    return null;
  }

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

  const fetchGetById = async (id = getID) => {
    try {
      const response = await ContatoService.getById(id);
      // console.log('fetchGetById/Contato:', response);
      return response;
    } catch (err) {
      console.error('Erro circuitos:', err);
    }
  };

  const fetchFilterPhone = async (data) => {
    const response = await TelefoneService.postFilter(data);
    return response;
  }

  const fetchFilterMail = async (data) => {
    const response = await EmailService.postFilter(data);
    return response;
  }

  const fetchSave = async (data) => {
    console.log('fetchSave/data ::', data);

    try {
      setLoading(false);

      const response = await ContatoService.postSave(data);

      if (
        response.status === 'erro' &&
        response.id === 0 &&
        response.affectedRows === 0
      ) {
        setUpFormHeader('Erro ao salvar os Dados', 'danger');
        addToast('Erro', 'Erro ao salvar os Dados', 'danger', 5000);
      }

      if (
        response.status === 'success' &&
        response.id > 0 &&
        response.affectedRows > 0
      ) {
        setUpFormHeader('Dados salvos com sucesso', 'success');
        addToast('Sucesso', 'Contato salvo com sucesso!', 'success', 3000);
      }

      if (response.length > 0) {
        setLista(response);
      }

      setLoading(false);
    } catch (err) {
      console.error('Erro filtro:', err);
      setLoading(false);
    }
  };

  const registerform = async () => {
    const updateData = await fetchGetById();
    // console.log('updateData :: ', updateData);

    if (updateData) {
      let dadosIniciais = {
        token_csrf: token_csrf || 'erro',
        id: updateData.id || '',
        pro_origem_id: updateData.orig_id || '6',
        tipo: updateData.cad_tipo || 'Contato',
        sigla_pronome_tratamento: updateData.cad_sigla_pronome_tratamento || '',
        cnpj_cpf: updateData.cad_cnpj_cpf || '',
        nome: updateData.cad_nome || '',
        tipo_email: updateData.mail_tipo || '',
        email: updateData.mail_email || '',
        tipo_numero: updateData.tel_tipo || '',
        numero: updateData.tel_numero || '',
        remember_token: updateData.cad_remember_token || token_csrf,
        created_by: updateData.cad_created_by || '0',
        created_by_name: updateData.cad_created_by_name || 'unknown',
        updated_by: updateData.cad_updated_by || '0',
        updated_by_name: updateData.cad_updated_by_name || 'unknown',
        created_at: updateData.created_at || '',
        updated_at: updateData.updated_at || '',
        deleted_at: updateData.deleted_at || null
      };
      // console.log('dadosIniciais :: ', dadosIniciais)
      reset(dadosIniciais);
      setShowUpdateData(updateData);
      // console.log('dadosIniciais:', dadosIniciais);
    } else {
      let dadosIniciais = {
        remember_token: updateData.cad_remember_token || token_csrf,
        token_csrf: updateData.cad_token_csrf || token_csrf,
        pro_origem_id: updateData.pro_origem_id || '6',
        tipo: updateData.cad_tipo || 'Contato',
      };
      reset(dadosIniciais);
    }
  }

  useEffect(() => {
    try {
      const startData = async () => {
        await fetchSecretarias();
        await registerform();
        console.log('------------------');
        console.log('getURI :: ', getURI);
      };

      startData();

    } catch (error) {
      console.error('Erro no useEffect:', error);

    } finally {
      console.log('---------------------');
      console.log('#useEffect finalizado');
    }

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
        console.log('#useEffect finalizado');
      }
    };

    initializeData();
  }, [reset]);

  const renderCampoTextSigla = () => {
    return (
      <div className="form-group">
        <label htmlFor="formSigla" className="form-label">Sigla *</label>
        <select
          className={`form-select ${errors.sigla_pronome_tratamento ? 'is-invalid' : ''}`}
          id="formSec"
          name='sigla_pronome_tratamento'
          value={getValues('sigla_pronome_tratamento')}
          {...register('sigla_pronome_tratamento', { required: 'Secretaria é obrigatório' })}
        >
          <option value="">Selecione o tipo</option>
          {loading ? (
            <option>Carregando...</option>
          ) : (
            secretarias.map((sec, index) => (
              <option key={index} value={sec.id}>
                {`${debugMyPrint ? sec.id : ''}`} - {sec.cad_sigla_pronome_tratamento}
              </option>
            ))
          )}
        </select>
        {errors.sigla_pronome_tratamento && (
          <div className="invalid-feedback">
            {errors.sigla_pronome_tratamento.message}
          </div>
        )}
      </div>
    );
  }

  const renderCampoTextNome = () => {
    return (
      <div className="form-group">
        <label htmlFor="formNome" className="form-label">Nome *</label>
        <input
          type="text"
          className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
          id="formNome"
          {...register('nome', { required: 'Nome é obrigatório' })}
        />
        {errors.nome && (
          <div className="invalid-feedback">
            {errors.nome.message}
          </div>
        )}
      </div>
    );
  }

  const renderCampoRadioAtivo = () => {
    return (
      <div className="form-group">
        <label htmlFor="formActive" className="form-label">Ativo *</label>
        <select
          className="form-select"
          id="formActive"
          value={getValues('active')}
          {...register('active', { required: 'Ativo é obrigatório' })}
        >
          <option value="Y">Sim</option>
          <option value="N">Não</option>
        </select>
        {errors.active && (
          <div className="invalid-feedback">
            {errors.active.message}
          </div>
        )}
      </div>
    );
  }

  const renderCampoMailEmail = () => {
    return (
      <div className="form-group">
        <label htmlFor="formEmail" className="form-label">Email *</label>
        <input
          type="mail"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="formEmail"
          {...register('email', { required: 'Email é obrigatório' })}
          onBlur={handleEmailBlur}
        />
        {errors.email && (
          <div className="invalid-feedback">
            {errors.email.message}
          </div>
        )}
      </div>
    );
  }

  const renderCampoSelectTipoEmail = () => {
    return (
      <>
        <label htmlFor="formTipEmail" className="form-label">Tipo de Email *</label>
        <select
          className={`form-select ${errors.tipo_email ? 'is-invalid' : ''}`}
          id="formSec"
          value={getValues('tipo_email')}
          {...register('tipo_email', { required: 'Tipo de Email é obrigatório' })}
        >
          <option value="">Selecione o tipo</option>
          <option value="Pessoal">Pessoal</option>
          <option value="Institucional">Institucional</option>
          <option value="Recado">Recado</option>
        </select>
        {errors.tipo_email && (
          <div className="invalid-feedback">
            {errors.tipo_email.message}
          </div>
        )}
      </>
    );
  }

  const renderCampoTextTelefone = () => {
    return (
      <div className="form-group">
        <label htmlFor="formTel" className="form-label">Telefone *</label>
        <input
          type="text"
          className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
          id="formTel"
          name='numero'
          {...register('numero', { required: 'Telefone é obrigatório' })}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
        />
        {errors.numero && (
          <div className="invalid-feedback">
            {errors.numero.message}
          </div>
        )}
      </div>
    );
  }

  const renderCampoSelectTipoTelefone = () => {
    return (
      <>
        <label htmlFor="formTipEmail" className="form-label">Tipo de Telefone *</label>
        <select
          className={`form-select ${errors.tipo_numero ? 'is-invalid' : ''}`}
          id="formSec"
          value={getValues('tipo_numero')}
          {...register('tipo_numero', { required: 'Tipo de Telefone é obrigatório' })}
        >
          <option value="">Selecione o tipo</option>
          <option value="Pessoal">Pessoal</option>
          <option value="Institucional">Institucional</option>
          <option value="Recado">Recado</option>
        </select>
        {errors.tipo_numero && (
          <div className="invalid-feedback">
            {errors.tipo_numero.message}
          </div>
        )}
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
          onSubmit={handleSubmit(salvarContato)}
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
      </>
    );
  }

  return (
    <div className="form-container">
      {/* TOAST */}
      <ToastsReact
        showWithoutButton={true}
        position="top-center"
        toasts={toastMessages}
        variant="dark"
        opacity="25"
      />
      <div className="row justify-content-center">
        <div className="col-lg-12 col-md-12">
          <div className="card">
            <div className={`card-header bg-${defaultHeader} text-white`}>
              <h4 className="mb-0">Formulário / Contato {confirmationMessage}</h4>
            </div>
            <div className="card-body">
              <form
                className="nav-item"
                onSubmit={handleSubmit(salvarContato)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                <div className="row mb-3">
                  <div className="col-md-3">
                    {/* CAMPO SIGLA */}
                    {renderCampoTextSigla()}
                  </div>
                  <div className="col-md-6">
                    {/* CAMPO NOME */}
                    {renderCampoTextNome()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO ATIVO */}
                    {renderCampoRadioAtivo()}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    {/* CAMPO E-MAIL */}
                    {renderCampoMailEmail()}
                  </div>
                  <div className="col-md-6">
                    {/* CAMPO TIPO */}
                    {renderCampoSelectTipoEmail()}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    {/* CAMPO TELFONE */}
                    {renderCampoTextTelefone()}
                  </div>
                  <div className="col-md-6">
                    {/* CAMPO TIPO TELEFONE */}
                    {renderCampoSelectTipoTelefone()}
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