// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Contrato\AppForm.jsx
import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import { set, useForm, useWatch } from 'react-hook-form';
import ContratoService from '../../services/contrato';
import SecretariaService from '../../services/secretaria';
import ToastsReact from '../../components/Message/Toasts';
import JSONViewer from '../../components/JSONViewer';
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
      cont_sei: '',
      cont_nome: '',
      cont_active: '',
      cont_data_inicio: '',
      cont_data_fim: '',
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
  const salvarContrato = (data) => {
    fetchSave(data);
    console.log('Salvando empresa:', data);
  };

  const limparFormulario = () => {
    reset();
    // console.log('Formulário limpo');
  };

  const handleCancel = () => {
    // Implementar lógica de cancelamento (voltar para página anterior, etc.)
    // console.log('Ação cancelar');
  };

  const setUpFormHeader = async (Headermessage, Headerdefault) => {
    setConfirmationMessage(`/ ${Headermessage}`);
    setDefaultHeader(Headerdefault);
    return null;
  };

  const cadastrarContrato = async (formData) => {
    try {

      const endpointData = await ContratoService.getEndPoint();

      const payload = {
        ...formData,
        token_csrf: endpointData.token_csrf,
        json: 1,
      };

      const response = await ContratoService.postSave(payload);
      console.log(response); // Veja o que realmente está vindo

      if (response && !response.error) {
        // Cadastro foi bem-sucedido
        console.log('Contrato cadastrada com sucesso:', response);
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
      setLoading(true);
      const response = await ContratoService.getSecretarias();
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
      const response = await ContratoService.getById(id);
      console.log('fetchGetById/Cliente:', response);
      return response;

    } catch (err) {
      console.error('Erro circuitos:', err);
    }
  };

  const fetchSave = async (data) => {
    try {
      setLoading(false);

      const response = await ContratoService.postSave(data);
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
          cont_sei: updateData.cont_sei || '',
          cont_nome: updateData.cont_nome || '',
          cont_active: updateData.cont_active || '',
          cont_data_inicio: updateData.cont_data_inicio || '',
          cont_data_fim: updateData.cont_data_fim || '',
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
        cont_sei: '',
        cont_nome: '',
        cont_active: '',
        cont_data_inicio: '',
        cont_data_fim: '',
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

  const renderCampoSelectSecretaria = () => {
    return (
      <>
        <label htmlFor="formSec" className="form-label">Secretaria*</label>
        <select
          className={`form-select ${errors.cad_sigla_pronome_tratamento ? 'is-invalid' : ''}`}
          id="formSec"
          {...register('cad_sigla_pronome_tratamento', { required: 'Secretaria é obrigatório' })}
        >
          <option value="">Selecione o tipo</option>
          {loading ? (
            <option>Carregando...</option>
          ) : (
            secretarias.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.cad_sigla_pronome_tratamento} - {sec.cad_tipo} - {sec.cad_pro_origem_id}
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

  const renderCampoTextSei = () => {
    return (
      <div className="form-group">
        <label htmlFor="formSei" className="form-label">SEI*</label>
        <input
          type="text"
          className={`form-control ${errors.cont_sei ? 'is-invalid' : ''}`}
          id="formSei"
          {...register('cont_sei', { required: 'SEI é obrigatório' })}
        />
        {errors.cont_sei && (
          <div className="invalid-feedback">
            {errors.cont_sei.message}
          </div>
        )}
      </div>
    );
  }

  const renderCampoAtivo = () => {
    return (
      <>
        <div className="form-grup">
          <label htmlFor="formActive" className="form-label">Ativo*</label>
          <select
            className="form-select"
            id="formActive"
            value={getValues('cont_active')}
            {...register('cont_active', { required: 'Ativo é obrigatório' })}
          >
            <option value="Y">Sim</option>
            <option value="N">Não</option>
          </select>
          {errors.cont_active && (
            <div className="invalid-feedback">
              {errors.cont_active.message}
            </div>
          )}
        </div>
      </>
    );
  }

  const renderTextNome = () => {
    return (
      <div className="form-grup">
        <label htmlFor="formNome" className="form-label">Nome*</label>
        <input
          type="text"
          className={`form-control ${errors.sei ? 'is-invalid' : ''}`}
          id="formNome"
          {...register('cont_nome', { required: 'Nome é obrigatório' })}
        />
        {errors.cont_nome && (
          <div className="invalid-feedback">
            {errors.cont_nome.message}
          </div>
        )}
      </div>
    );
  }

  const renderCampoDataInicio = () => {
    return (
      <div className="form-group">
        <label htmlFor="formData1" className="form-label">Data Início*</label>
        <input
          type="date"
          className={`form-control ${errors.cont_data_inicio ? 'is-invalid' : ''}`}
          id="formData1"
          {...register('cont_data_inicio', { required: 'Data Início é obrigatório' })}
        />
        {errors.cont_data_inicio && (
          <div className="invalid-feedback">
            {errors.cont_data_inicio.message}
          </div>
        )}
      </div>
    );
  }

  const renderCampoDataFim = () => {
    return (
      <div className="form-group">
        <label htmlFor="formData2" className="form-label">Data Fim*</label>
        <input
          type="date"
          className={`form-control ${errors.cont_data_fim ? 'is-invalid' : ''}`}
          id="formData2"
          {...register('cont_data_fim', { required: 'Data Fim é obrigatório' })}
        />
        {errors.cont_data_fim && (
          <div className="invalid-feedback">
            {errors.cont_data_fim.message}
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
    )
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
          onSubmit={handleSubmit(cadastrarContrato)}
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
              <h4 className="mb-0">Formulário / Contrato {confirmationMessage}</h4>
            </div>
            <div className="card-body">
              <form
                className="nav-item"
                onSubmit={handleSubmit(salvarContrato)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                <div className="row mb-3">
                  <div className="col-md-3">
                    {/* CAMPO SECRETARIA */}
                    {renderCampoSelectSecretaria()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO SEI */}
                    {renderCampoTextSei()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO SEI */}
                    {renderCampoAtivo()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO SEI */}
                    {renderTextNome()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO DATA INÍCIO */}
                    {renderCampoDataInicio()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO DATA FIM */}
                    {renderCampoDataFim()}
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