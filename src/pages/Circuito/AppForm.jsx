// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Secretaria\AppForm.jsx
import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import { set, useForm, useWatch } from 'react-hook-form';
import CircuitoService from '../../services/circuito';
import JSONViewer from '../../components/JSONViewer';
import ToastsReact from '../../components/Message/Toasts';
import { Alert, Spinner } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { start } from '@popperjs/core';

const AppForm = ({
  token_csrf = {},
  getID = null
}) => {
  const [debugMyPrint, setDebugMyPrint] = useState(true);
  const [secretarias, setSecretarias] = useState([]);
  const [tokenCsrf, setTokenCsrf] = useState('');
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

  const setUpFormHeader = async (Headermessage, Headerdefault) => {
    setConfirmationMessage(`/ ${Headermessage}`);
    setDefaultHeader(Headerdefault);
    return null;
  };

  const cadastrarCircuito = async (formData) => {
    try {

      const endpointData = await CircuitoService.getEndPoint();

      const payload = {
        ...formData,
        token_csrf: endpointData.token_csrf,
        json: 1,
      };

      const response = await CircuitoService.postSave(payload);
      console.log(response); // Veja o que realmente está vindo

      if (response && !response.error) {
        // Cadastro foi bem-sucedido
        console.log('Circuito cadastrada com sucesso:', response);
        alert('Cadastro realizado com sucesso!');
      } else {
        // Houve algum erro vindo do back-end
        console.error('Erro ao cadastrar:', response.error);
        alert('Erro ao cadastrar: ' + response.error);
      }

    } catch (error) {
      // Erro de rede ou exceção
      console.error('Erro ao salvar contrato:', error);
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
            title: "Cadastro de Circuito",
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
          circ_sigla: updateData.cad_circ_sigla || '',
          circ_nome: updateData.cad_circ_nome || '',
          circ_active: updateData.cad_active || 'Y',
          circ_data_ativacao: updateData.cad_circ_data_ativacao || '',
          vel_velocidade: updateData.cad_vel_velocidade || '',
          circ_SEI: updateData.cad_circ_SEI || '',
          circ_data_cancelamento: updateData.cad_circ_data_cancelamento || '',
          remember_token: updateData.remember_token || '',
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
      reset({
        token_csrf: token_csrf,
        id: '',
        circ_sigla: '',
        circ_nome: '',
        circ_active: '',
        circ_data_ativacao: '',
        circ_SEI: '',
        circ_data_cancelamento: '',
        vel_velocidade: '',
        remember_token: '',
        created_by: '',
        created_by_name: '',
        updated_by: '',
        updated_by_name: '',
        created_at: '',
        updated_at: '',
        deleted_at: ''
      });
    }
  };

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

  const renderCampoSelectSigla = () => {
    return (
      <>
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
      </>
    );
  }

  const renderCampoTextNomeCirc = () => {
    return (
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
    );
  }

  const renderCampoSelectStatus = () => {
    return (
      <>
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
      </>
    );
  }

  const renderCampoSelectAtivacao = () => {
    return (
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
    );
  }

  const renderCampoTextVel = () => {
    return (
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
    );
  }

  const renderCampoTextSei = () => {
    return (
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
          onSubmit={handleSubmit(cadastrarCircuito)}
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
                    {/* CAMPO SECRETARIA */}
                    {renderCampoSelectSigla()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO SEI */}
                    {renderCampoTextNomeCirc()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO SEI */}
                    {renderCampoSelectStatus()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO SEI */}
                    {renderCampoSelectAtivacao()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO DATA INÍCIO */}
                    {renderCampoTextVel()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO DATA FIM */}
                    {renderCampoTextSei()}
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
            title="Resposta da API fetchGetById (Atualizar Contrato)"
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