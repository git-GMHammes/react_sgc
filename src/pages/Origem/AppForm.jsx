// src\public\script\react_modelo_v1\frontend\src\pages\Origem\AppForm.jsx
import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { useForm, useWatch } from 'react-hook-form';
import OrigemService from '../../services/origem';
import ToastsReact from '../../components/Message/Toasts';
import { Alert, Spinner } from 'react-bootstrap';

const AppForm = ({
  token_csrf = {},
  getID = null
}) => {

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

  const { register, control, setValue, getValues, reset, formState: { errors }, handleSubmit } = useForm({
    defaultValues: {
      token_csrf: token_csrf,
      id: '',
      form_on: '',
      descricao: '',
      informação: 'Y',
      created_by: '',
      created_by_name: 'unknown',
      updated_by: '0',
      updated_by_name: 'unknown',
      created_at: '',
      updated_at: '',
      deleted_at: null
    }
  });

  // Observar mudanças no campo cnpj_cpf para formatação
  const cnpjCpfValue = useWatch({
    control,
    name: 'cnpj_cpf',
  });

  // Funções de submissão para diferentes propósitos
  const salvarOrigem = (data) => {
    fetchSave(data);
    // console.log('Salvando origem:', data);
  };

  const limparFormulario = () => {
    reset();
    // console.log('Formulário limpo');
  };

  const handleCancel = () => {
    // Implementar lógica de cancelamento (voltar para página anterior, etc.)
    // console.log('Ação cancelar');
  };

  const fetchGetById = async (id = getID) => {
    try {
      const response = await OrigemService.getById(id);
      return response;

    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const fetchSave = async (data) => {
    try {
      setLoading(false);

      const response = await OrigemService.postSave(data);
      // console.log('Resposta do postFilter:', response);
      setConfirmationMessage('/ Erro ao salvar os Dados');
      // setDefaultHeader('success'); 
      setDefaultHeader('danger');
      setMessageToast('Origem salva com sucesso!');
      setCustomToasts(prev => [
        {
          ...prev[0],
          title: "Cadastro de Origem",
          strong: "Sucesso",
          time: "agora",
          delay: 1000,
          variant: "success",
          opacity: "25",
          renderChildren: () => (
            <div className="d-flex align-items-center">
              <i className="bi bi-check-circle me-2"></i>
              <span>{messageToast}</span>
            </div>
          )
        }
      ]);
      setShowToast(true);

      if (response.length > 0) {
        setLista(response);
      }
      setLoading(false);
    } catch (err) {
      console.error('Erro filtro:', err);
      setLoading(false);
    }
  };

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {

    const initializeData = async () => {
      try {
        const updateData = await fetchGetById();
        // console.log('updateData :: ', updateData)

        if (updateData) {
          let dadosIniciais = {
            token_csrf: token_csrf,
            id: updateData.id || '',
            form_on: updateData.cad_form_on || 'Y',
            descricao: updateData.cad_descricao || '',
            informação: updateData.cad_informação || '',
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
        } else {
          let dadosIniciais = {
            remember_token: updateData.cad_remember_token || token_csrf,
          };
          reset(dadosIniciais);
        }

      } catch (err) {
        console.error('Erro na inicialização dos dados:', err);

      } finally {
        // console.log('useEffect finalizado');
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
              <h4 className="mb-0">Formulário / Origem {confirmationMessage}</h4>
            </div>
            <div className="card-body">
              <form
                className="nav-item"
                onSubmit={handleSubmit(salvarOrigem)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                <div className="row mb-3">
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="hidden"
                        id="token_csrf"
                        {...register('token_csrf')}
                      />
                      <label htmlFor="formId" className="form-label">ID</label>
                      <input
                        type="text"
                        className="form-control bg-secondary"
                        id="formId"
                        disabled
                        {...register('id')}
                      />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group">
                      <label htmlFor="formOrigem" className="form-label">Origem*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
                        id="formDescricao"
                        {...register('descricao', { required: 'Descrição é obrigatório' })}
                      />
                      {errors.pro_origem_id && (
                        <div className="invalid-feedback">
                          {errors.pro_origem_id.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group">
                      <label htmlFor="formTipo" className="form-label">Tipo*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.informação ? 'is-invalid' : ''}`}
                        id="formInformação"
                        {...register('informação', { required: 'Informação é obrigatório' })}
                      />
                      {errors.tipo && (
                        <div className="invalid-feedback">
                          {errors.tipo.message}
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
                  onSubmit={handleSubmit(salvarOrigem)}
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