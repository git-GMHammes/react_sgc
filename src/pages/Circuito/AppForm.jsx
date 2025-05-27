// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Secretaria\AppForm.jsx
import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import { useForm, useWatch } from 'react-hook-form';
import CircuitoService from '../../services/circuito';
import ToastsReact from '../../components/Message/Toasts';
import { Alert, Spinner } from 'react-bootstrap';

const AppForm = ({
  token_csrf = {},
  getID = null
}) => {

  const [secretarias, setSecretarias] = useState([]);

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
      circ_sigla: '',
      circ_nome: '',
      circ_active: '',
      circ_data_ativacao: '',
      vel_velocidade: '',
      circ_SEI: '',
      circ_data_cancelamento: '',
      remember_token: '',
      created_by: '',
      created_by_name: '',
      updated_by: '',
      updated_by_name: '',
      created_at: '',
      updated_at: '',
      deleted_at: null
    }
  });

  // Funções de submissão para diferentes propósitos
  const salvarCircuito = (data) => {
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

  const fetchSecretarias = async () => {
    try {
      setLoading(true);
      const response = await CircuitoService.getSecretarias();
      console.log("Secretarias encontradas:", response); // Verificar o que está vindo
      setSecretarias(response); // Preenche o select
    } catch (err) {
      console.error("Erro ao buscar secretarias:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGetById = async (id = getID) => {
    try {
      const response = await CircuitoService.getById(id);
      return response;

    } catch (err) {
      console.error('Erro circuitos:', err);
    }
  };

  const fetchSave = async (data) => {
    try {
      setLoading(false);

      const response = await CircuitoService.postSave(data);
      console.log('Resposta do postFilter:', response);
      setConfirmationMessage('/ Erro ao salvar os Dados');
      // setDefaultHeader('success'); 
      setDefaultHeader('danger');
      setMessageToast('Circuito salvo com sucesso!');
      setCustomToasts(prev => [
        {
          ...prev[0],
          title: "Cadastro de Circuito",
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
      return false;

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
    fetchSecretarias();
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
        const updateData = await fetchGetById();
        console.log('updateData :: ', updateData)

        if (updateData) {
          let dadosIniciais = {
            token_csrf: token_csrf,
            id: updateData.id || '',
            circ_sigla: updateData.cad_circ_sigla || '',
            circ_nome: updateData.cad_circ_nome || '',
            circ_active: updateData.cad_active || 'Y',
            circ_data_ativacao: updateData.cad_circ_data_ativacao || '',
            vel_velocidade: updateData.cad_vel_velocidade || '',
            circ_SEI: updateData.cad_circ_SEI || '',
            circ_data_cancelamento: updateData.cad_circ_data_cancelamento || '',
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
        } else {
          let dadosIniciais = {
            remember_token: updateData.cad_remember_token || token_csrf,
          };
          reset(dadosIniciais);
        }

      } catch (err) {
        console.error('Erro na inicialização dos dados:', err);

      } finally {
        console.log('useEffect finalizado');
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
              <h4 className="mb-0">Formulário / Circuito {confirmationMessage}</h4>
            </div>
            <div className="card-body">
              <form
                className="nav-item"
                onSubmit={handleSubmit(salvarCircuito)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formSigla" className="form-label">Sigla*</label>
                      <select
                        className={`form-select ${errors.circ_sigla ? 'is-invalid' : ''}`}
                        id="formSigla"
                        {...register('circ_sigla', { required: 'Sigla é obrigatória' })}
                      >
                        <option value="">Selecione o tipo</option>
                        {loading ? (
                          <option>Carregando...</option>
                        ) : (
                          secretarias.map((sec) => (
                            <option key={sec.id} value={sec.id}>
                              {sec.cad_sigla_pronome_tratamento}
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
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formNome" className="form-label">Nome*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.circ_nome ? 'is-invalid' : ''}`}
                        id="formNome"
                        {...register('circ_nome', { required: 'Nome é obrigatório' })}
                      />
                      {errors.circ_nome && (
                        <div className="invalid-feedback">
                          {errors.circ_nome.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formStatus" className="form-label">Status*</label>
                      <select
                        className={`form-select ${errors.circ_active ? 'is-invalid' : ''}`}
                        id="formStatus"
                        {...register('circ_active', { required: 'Status é obrigatório' })}
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="Y">Ativo</option>
                        <option value="N">Inativo</option>
                      </select>
                      {errors.circ_active && (
                        <div className="invalid-feedback">
                          {errors.circ_active.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formAtivacao" className="form-label">Data de Ativação*</label>
                      <input
                        type="date"
                        className={`form-control ${errors.circ_data_ativacao ? 'is-invalid' : ''}`}
                        id="formAtivacao"
                        {...register('circ_data_ativacao', { required: 'Data de ativação é obrigatório' })}
                      />
                      {errors.circ_data_ativacao && (
                        <div className="invalid-feedback">
                          {errors.circ_data_ativacao.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formVelocidade" className="form-label">Velocidade Mbps*</label>
                      <input
                        type="number"
                        className={`form-control ${errors.vel_velocidade ? 'is-invalid' : ''}`}
                        id="formVelocidade"
                        {...register('vel_velocidade', { required: 'Velocidade é obrigatória' })}
                      />
                      {errors.vel_velocidade && (
                        <div className="invalid-feedback">
                          {errors.vel_velocidade.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formSei" className="form-label">SEI*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.circ_SEI ? 'is-invalid' : ''}`}
                        id="formSei"
                        {...register('circ_SEI', { required: 'SEI é obrigatório' })}
                      />
                      {errors.circ_SEI && (
                        <div className="invalid-feedback">
                          {errors.circ_SEI.message}
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
                  onSubmit={handleSubmit(salvarCircuito)}
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