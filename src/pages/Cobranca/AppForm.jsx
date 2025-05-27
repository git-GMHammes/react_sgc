import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import JSONViewer from '../../components/JSONViewer';
import { useForm, useWatch } from 'react-hook-form';
import CobrancaService from '../../services/cobranca';
import SecretariaService from '../../services/secretaria';
import ToastsReact from '../../components/Message/Toasts';
import { Alert, Spinner } from 'react-bootstrap';

const AppForm = ({
  token_csrf = {},
  getID = null
}) => {

  const [secretarias, setSecretarias] = useState([]);
  const [debugMyPrint, setDebugMyPrint] = useState(true);
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
      id: '',
      vel_velocidade: '',
      cad_id: '',
      SEI: '',
      active: '',
      custo_mensal: '',
      data_inicio: '',
      data_fim: '',
      created_by: '',
      created_by_name: '',
      updated_by: '',
      updated_by_name: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    }
  });

  // id
  // cadastro_cliente_id
  // cadastro_prestadora_id
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
    console.log('Formulário limpo');
  };

  const handleCancel = () => {
    // Implementar lógica de cancelamento (voltar para página anterior, etc.)
    console.log('Ação cancelar');
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

  const fetchGetById = async (id = getID) => {
    try {
      const response = await CobrancaService.getById(id);
      return response;

    } catch (err) {
      console.error('Erro circuitos:', err);
    }
  };

  const fetchSave = async (data) => {
    try {
      setLoading(false);

      const response = await CobrancaService.postSave(data);
      console.log('Resposta do postFilter:', response);
      setConfirmationMessage('/ Erro ao salvar os Dados');
      // setDefaultHeader('success'); 
      setDefaultHeader('danger');
      setMessageToast('Cobranca salva com sucesso!');
      setCustomToasts(prev => [
        {
          ...prev[0],
          title: "Cadastro de Cobranca",
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

  const registerform = async () => {
    const updateData = await fetchGetById();
    // console.log('updateData :: ', updateData);

    if (updateData) {
      let dadosIniciais = {
        token_csrf: token_csrf,
        remember_token: updateData.cad_remember_token || token_csrf,
        id: updateData.id || '',
        cad_id: updateData.cad_id || '',
        active: updateData.cob_active || '',
        SEI: updateData.cob_SEI || '',
        custo_mensal: updateData.cob_custo_mensal || '',
        data_inicio: updateData.cob_data_inicio || '',
        data_fim: updateData.cob_data_fim || '',
        created_by: updateData.cad_created_by || '0',
        created_by_name: updateData.cad_created_by_name || 'unknown',
        updated_by: updateData.cad_updated_by || '0',
        updated_by_name: updateData.cad_updated_by_name || 'unknown',
        // vel_velocidade: updateData.cad_vel_velocidade || '',
        // cad_nome: updateData.cad_nome || '',
        // tel_numero: updateData.cad_tel_numero || '',
        // email_email: updateData.cad_email_email || '',
        // created_at: updateData.created_at || '',
        // updated_at: updateData.updated_at || '',
        // deleted_at: updateData.deleted_at || null
      };
      // console.log('dadosIniciais :: ', dadosIniciais)
      reset(dadosIniciais);
      setShowUpdateData(updateData);

    } else {
      let dadosIniciais = {
        remember_token: updateData.cad_remember_token || token_csrf,
      };
      reset(dadosIniciais);
    }
  }

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

        registerform();

      } catch (err) {
        console.error('Erro na inicialização dos dados:', err);

      } finally {
        console.log('useEffect finalizado');
      }
    };

    initializeData();
  }, [reset]);

  const renderCampoSecretaria = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formSec" className="form-label">Secretaria *</label>
          <select
            className={`form-select ${errors.sigla_pronome_tratamento ? 'is-invalid' : ''}`}
            id="formSec"
            name='cad_id'
            value={getValues('cad_id') || ''}
            {...register('cad_id', { required: 'Secretaria é obrigatório' })}
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
              <div className="d-flex justify-content-between mb-2">
                <a className='btn btn-primary w-100' href='#' role='button'>Listar Contatos</a>
              </div>
              <div className='border mt-2 p-2 w-100'>
                ggggggggggggggggggggggggggg <br />
              </div>
              <div className='border mt-2 p-2 w-100'>
                ggggggggggggggggggggggggggg <br />
              </div>
              <div className='border mt-2 p-2 w-100'>
                ggggggggggggggggggggggggggg <br />
              </div>
              <div className='border mt-2 p-2 w-100'>
                ggggggggggggggggggggggggggg <br />
              </div>
              <div className='border mt-2 p-2 w-100'>
                ggggggggggggggggggggggggggg <br />
              </div>
              <div className='border mt-2 p-2 w-100'>
                ggggggggggggggggggggggggggg <br />
              </div>
              <div className='border mt-2 p-2 w-100'>
                ggggggggggggggggggggggggggg <br />
              </div>
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
            defaultValue={getValues('active') || 'Y'}
            {...register('active')}
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
            className={`form-control ${errors.custo_mensal ? 'is-invalid' : ''}`}
            id="formCusto"
            name='custo_mensal'
            value={getValues('custo_mensal') || ''}
            {...register('custo_mensal', { required: 'Cobrança é obrigatório' })}
          />
          {errors.cob_custo_mensal && (
            <div className="invalid-feedback">
              {errors.custo_mensal.message}
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
            name='SEI'
            value={getValues('SEI') || ''}
            {...register('SEI', { required: 'Processo SEI é obrigatório' })}
          />
          {errors.SEI && (
            <div className="invalid-feedback">
              {errors.SEI.message}
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
            name='data_inicio'
            value={getValues('data_inicio') || ''}
            {...register('data_inicio', { required: 'Data de Cobrança é obrigatória' })}
          />
          {errors.data_inicio && (
            <div className="invalid-feedback">
              {errors.data_inicio.message}
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
            className={`form-control ${errors.data_fim ? 'is-invalid' : ''}`}
            id="formData2"
            name='data_fim'
            value={getValues('data_fim') || ''}
            {...register('data_fim', { required: 'Data de Cobrança é obrigatória' })}
          />
          {errors.data_fim && (
            <div className="invalid-feedback">
              {errors.data_fim.message}
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
                <div className="row mb-2">
                  <div className="col-12 col-sm-4">
                    {/*CAMPO SELECT SECRETARIA*/}
                    {renderCampoSecretaria()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/*CAMPO SELECT CONTATO*/}
                    {renderCampoContato()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/*CAMPO RADIO ATIVO*/}
                    {renderCampoAtivo()}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12 col-sm-4">
                    {/*CAMPO TEXT CUSTO MENSAL*/}
                    {renderCampoCustoMensal()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/*CAMPO TXT SEI*/}
                    {renderCampoSEI()}
                  </div>
                  <div className="col-12 col-sm-4">
                    {/*CAMPO DATE INICIO*/}
                    {renderCobrancaDataInicio()}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12 col-sm-4">
                    {/*CAMPO DATE FIM*/}
                    {renderCobrancaDataFim()}
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
              </form>

              {renderRowLogForm()}

              {renderButtonCommands()}

            </div>
            <div className="card-footer text-muted">
              <small>* Campos obrigatórios</small>
            </div>
          </div>
        </div>
      </div>

      {/* Exibindo o Loading independentemente do conteúdo da tabela */}
      <Loading openLoading={loading} />

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

    </div>
  );

};

export default AppForm;