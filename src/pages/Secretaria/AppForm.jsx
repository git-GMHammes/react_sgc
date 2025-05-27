// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Secretaria\AppForm.jsx
import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import { set, useForm, useWatch } from 'react-hook-form';
import SecretariaService from '../../services/secretaria';
import ToastsReact from '../../components/Message/Toasts';
import { Alert, Spinner } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { start } from '@popperjs/core';

const AppForm = ({
  token_csrf = {},
  getID = null
}) => {

  const [secretarias, setSecretarias] = useState([]);
  const [tokenCsrf, setTokenCsrf] = useState('');
  const [loading, setLoading] = useState(true);
  const [defaultHeader, setDefaultHeader] = useState('primary');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [messageToast, setMessageToast] = useState('...');
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
        </div>
      )
    }
  ]);

  // Configuração do formulário com react-hook-form
  const { register, control, setValue, getValues, reset, formState: { errors }, handleSubmit } = useForm({
    defaultValues: {
      token_csrf: token_csrf,
      id: '',
      pro_origem_id: '2',
      nome: '',
      cnpj_cpf: '',
      tipo: 'Cliente',
      active: '',
      sigla_pronome_tratamento: '',
      created_by: '',
      created_by_name: '',
      updated_by: '',
      updated_by_name: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    }
  });

  // Funções de submissão para diferentes propósitos
  const salvarSecretaria = (data) => {
    fetchSave(data);
    console.log('Salvando empresa:', data);
  };

  const limparFormulario = () => {
    reset();
    console.log('Formulário limpo');
  };

  const handleCancel = () => {
    // Implementar lógica de cancelamento (voltar para página anterior, etc.)
    console.log('Ação cancelar');
  };

  const setUpFormHeader = async (Headermessage, Headerdefault) => {
    setConfirmationMessage(`/ ${Headermessage}`);
    setDefaultHeader(Headerdefault);
    return null;
  };

  const cadastrarSecretaria = async (formData) => {
    try {

      // 1. Obtém token CSRF antes do envio
      const endpointData = await SecretariaService.getEndPoint();

      // 2. Monta o payload com token e json: 1
      const payload = {
        ...formData,
        token_csrf: endpointData.token_csrf,
        json: 1,
      };

      const response = await SecretariaService.postSave(payload);

      if (response && !response.error) {
        // Cadastro foi bem-sucedido
        console.log('Secretaria cadastrada com sucesso:', response);
        alert('Cadastro realizado com sucesso!');
      } else {
        // Houve algum erro vindo do back-end
        console.error('Erro ao cadastrar:', response.error);
        alert('Erro ao cadastrar: ' + response.error);
      }
    } catch (error) {
      // Erro de rede ou exceção
      console.error('Erro ao salvar secretaria:', error);
      alert('Erro inesperado ao salvar');
    }
  };

  const setUpToastMessage = async (toastMessage, toastStrong, toastVariant) => {

    setMessageToast(toastMessage);

    setTimeout(() => {
      if (messageToast !== '...') {
        setCustomToasts(prev => [
          {
            ...prev[0],
            title: "Cadastro de Secretaria",
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
      setLoading(true);
      const response = await SecretariaService.getAll();
      // console.log("Secretarias encontradas:", response);
      setSecretarias(response); // Preenche o select
    } catch (err) {
      console.error("Erro ao buscar secretarias:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGetById = async (id = getID) => {
    try {
      const response = await SecretariaService.getById(id);
      console.log('fetchGetById/Cliente:', response);
      return response;

    } catch (err) {
      console.error('Erro circuitos:', err);
    }
  };

  const fetchSave = async (data) => {
    try {
      setLoading(false);

      const response = await SecretariaService.postSave(data);
      console.log('Resposta do postFilter:', response);

      setUpFormHeader('Erro ao salvar os Dados', 'danger');

      setUpFormHeader('Dados salvos com sucesso', 'success');

      setUpToastMessage('Secretaria salvo com sucesso!', 'Sucesso', 'success');

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

  const registerform = async () => {

    if (getID) {
      const updateData = await fetchGetById(getID);
      console.log('updateData :: ', updateData);

      if (updateData) {
        let dadosIniciais = {
          token_csrf: token_csrf || 'erro',
          id: updateData.id || '',
          pro_origem_id: updateData.orig_id || '2',
          tipo: updateData.cad_tipo || 'Cliente',
          sigla_pronome_tratamento: updateData.cad_sigla_pronome_tratamento || '',
          cnpj_cpf: updateData.cad_cnpj_cpf || '',
          nome: updateData.cad_nome || '',
          remember_token: updateData.cad_remember_token || token_csrf,
          created_by: updateData.cad_created_by || '0',
          created_by_name: updateData.cad_created_by_name || 'unknown',
          updated_by: updateData.cad_updated_by || '0',
          updated_by_name: updateData.cad_updated_by_name || 'unknown',
          created_at: updateData.created_at || '',
          updated_at: updateData.updated_at || '',
          deleted_at: updateData.deleted_at || null
        };
        reset(dadosIniciais);
      }
    } else {
      // Cadastro: limpa o formulário/inicializa com os valores default
      reset({
        token_csrf: token_csrf,
        id: '',
        pro_origem_id: '2',
        nome: '',
        cnpj_cpf: '',
        tipo: 'Cliente',
        active: '',
        sigla_pronome_tratamento: '',
        created_by: '',
        created_by_name: '',
        updated_by: '',
        updated_by_name: '',
        created_at: '',
        updated_at: '',
        deleted_at: ''
      });
    }
  }

  useEffect(() => {
    try {
      const startData = async () => {
        await fetchSecretarias();
        await registerform();
      };

      startData();

    } catch (error) {
      console.error('Erro no useEffect:', error);

    } finally {
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
              <h4 className="mb-0">Formulário / Secretaria {confirmationMessage}</h4>
            </div>
            <div className="card-body">
              <form
                className="nav-item"
                onSubmit={handleSubmit(salvarSecretaria)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="formSigla" className="form-label">Sigla*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.sigla_pronome_tratamento ? 'is-invalid' : ''}`}
                        id="formSigla"
                        {...register('sigla_pronome_tratamento', { required: 'Sigla é obrigatória' })}
                      />
                      {errors.sigla_pronome_tratamento && (
                        <div className="invalid-feedback">
                          {errors.sigla_pronome_tratamento.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="formNome" className="form-label">Nome*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                        id="formNome"
                        {...register('nome', { required: 'Nome é obrigatória' })}
                      />
                      {errors.nome && (
                        <div className="invalid-feedback">
                          {errors.nome.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="formSigla" className="form-label">Cnpj*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cad_cnpj_cpf ? 'is-invalid' : ''}`}
                        id="formSigla"
                        {...register('cad_cnpj_cpf', { required: 'Sigla é obrigatória' })}
                      />
                      {errors.cad_cnpj_cpf && (
                        <div className="invalid-feedback">
                          {errors.cad_cnpj_cpf.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
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
                  </div>
                </div>
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

              </form>
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
                  onSubmit={handleSubmit(cadastrarSecretaria)}
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
            </div>
            <div className="card-footer text-muted">
              <small>* Campos obrigatórios</small>
            </div>
          </div>
        </div>
      </div>

      {/* Exibindo o Loading independentemente do conteúdo da tabela */}
      <Loading openLoading={loading} />

    </div>
  );

};

export default AppForm;