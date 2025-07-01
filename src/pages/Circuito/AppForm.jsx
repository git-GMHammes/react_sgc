// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Circuito\AppForm.jsx
import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import { set, useForm, useWatch } from 'react-hook-form';
import CircuitoService from '../../services/circuito';
import EmpresaService from '../../services/empresa';
import SecretariaService from '../../services/secretaria';
import ToastsReact from '../../components/Message/Toasts';
import JSONViewer from '../../components/JSONViewer';
import { Alert, Spinner } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { start } from '@popperjs/core';

const AppForm = ({
  getURI = [],
  token_csrf = {},
  getID = null
}) => {
  const [debugMyPrint, setDebugMyPrint] = useState(false);
  const [secretarias, setSecretarias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [tokenCsrf, setTokenCsrf] = useState('');
  const [loading, setLoading] = useState(true);
  const [defaultHeader, setDefaultHeader] = useState('primary');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [toastMessages, setToastMessages] = useState([]);
  const [showUpdateData, setShowUpdateData] = useState([]);
  const [formSuccess, setFormSuccess] = useState(false);
  const ids = secretarias.map(s => s.id);
  const duplicados = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  // console.log("IDs duplicados:", duplicados);


  // Configuração do formulário com react-hook-form
  const {
    register,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues: {
      token_csrf: token_csrf,
      
      // circ (pro_circuito)
      id: '',
      circ_cadastro_empresa_id: '',
      circ_cadastro_secretaria_id: '',
      circ_velocidade_id: '',
      circ_endereco_id: '',
      circ_sigla: '',
      circ_status: 'Ativo',
      circ_active: '',
      circ_nome: '',
      circ_data_ativacao: '',
      circ_data_cancelamento: '',
      circ_SEI: '',
      circ_operacao: '',
      circ_created_by: '0',
      circ_created_by_name: 'unknown',
      circ_updated_by: '0',
      circ_updated_by_name: 'unknown',

      // vel (pro_velocidade)
      vel_id: '',
      vel_cadastro_empresa_id: '',
      vel_active: '',
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
      created_at: '',
      updated_at: '',
      deleted_at: null,

    }
  });

  const onSubmit = (data) => {
    console.log('Dados do formulário:', data);

    // Simulação de envio para API
    // Em um caso real, você faria uma chamada fetch/axios aqui

    // Exibe mensagem de sucesso
    setFormSuccess(true);

    // Limpa o formulário após envio bem-sucedido
    reset();

    // Remove a mensagem de sucesso após 3 segundos
    setTimeout(() => {
      setFormSuccess(false);
    }, 3000);
  };

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

  const fetchSecretarias = async () => {
    try {
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

  const fetchGetById = async (id = getID) => {
    try {
      const response = await CircuitoService.getById(id);
      return response;
    } catch (err) {
      console.error('Erro circuitos:', err);
    }
  };

  const fetchSave = async (data) => {
    // console.log('fetchSave/data ::', data);

    try {
      setLoading(false);

      const response = await CircuitoService.postSave(data);
      console.log('Resposta do postFilter:', response);

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

    if(getID){
      const updateData = await fetchGetById(getID);
      // console.log('updateData :: ', updateData);
    
      if (updateData) {
        let dadosIniciais = {
          token_csrf: token_csrf || 'erro',
          
          // circ (pro_circuito)
          id: updateData.id || '',
          cadastro_empresa_id: updateData.circ_cadastro_empresa_id || '',
          cadastro_secretaria_id: updateData.circ_cadastro_secretaria_id || '',
          velocidade_id: updateData.circ_velocidade_id || '',
          endereco_id: updateData.circ_endereco_id || '',
          sigla: updateData.circ_sigla || '',
          status: updateData.circ_status || 'Ativo',
          active: updateData.circ_active || '',
          nome: updateData.circ_nome || '',
          data_ativacao: updateData.circ_data_ativacao || '',
          data_cancelamento: updateData.circ_data_cancelamento || '',
          sei: updateData.circ_SEI || '',
          operacao: updateData.circ_operacao || '',
          created_by: updateData.circ_created_by || '0',
          created_by_name: updateData.circ_created_by_name || 'unknown',
          updated_by: updateData.circ_updated_by || '0',
          updated_by_name: updateData.circ_updated_by_name || 'unknown',

          // vel (pro_velocidade)
          vel_id: updateData.vel_id || '',
          vel_cadastro_empresa_id: updateData.vel_cadastro_empresa_id || '',
          vel_active: updateData.vel_active || '',
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
        cadastro_empresa_id: '',
        cadastro_secretaria_id: '',
        velocidade_id: '',
        endereco_id: '',
        sigla: '',
        status: '',
        active: '',
        nome: '',
        data_ativacao: '',
        data_cancelamento: '',
        sei: '',
        operacao: '',
        created_by: '',
        created_by_name: '',
        updated_by: '',
        updated_by_name: '',

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
        
        created_at: '',
        updated_at: '',
        deleted_at: null,
      });
    }
  };

  useEffect(() => {
    try {
      const startData = async () => {
        await fetchSecretarias();
        await fetchEmpresas();
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

  const renderCampoEmpresa = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="formSec" className="form-label">Empresa*</label>
          <select
            className={`form-select ${errors.circ_cadastro_empresa_id ? 'is-invalid' : ''}`}
            id="formSec"
            name='circ_cadastro_empresa_id'
            value={debugMyPrint ? getValues('circ_cadastro_empresa_id') || '' : null}
            {...register('circ_cadastro_empresa_id', { required: 'Empresa é obrigatório' })}
          >
            <option value="">Selecione o tipo</option>
            {loading ? (
              <option>Carregando...</option>
            ) : (
              empresas.map((empresa, index) => (
                <option key={`${index}`} value={empresa.id}>
                  {debugMyPrint ? `${empresa.id} - ` : ''}{empresa.cad_nome}
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

  const renderCampoSecretaria = () => {
    return (
      <>
        <label htmlFor="formSec" className="form-label">Secretaria*</label>
        <select
          className={`form-select ${errors.circ_cadastro_secretaria_id ? 'is-invalid' : ''}`}
          id="formSec"
          name='circ_cadastro_secretaria_id'
          value={debugMyPrint ? getValues('circ_cadastro_secretaria_id') || '' : null}
          {...register('circ_cadastro_secretaria_id', { required: 'Secreataria é obrigatória' })}
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
      </>
    );
  }

  const renderCampoTextNomeCirc = () => {
    return (
      <div className="form-group">
        <label htmlFor="formNome" className="form-label">Nome*</label>
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

  const renderCampoSelectActive = () => {
    return (
      <>
        <label htmlFor="formActive" className="form-label">Status*</label>
        <select
          className={`form-select ${errors.active ? 'is-invalid' : ''}`}
          id="formActive"
          {...register('active', { required: 'Status é obrigatório' })}
        >
          <option value="">Selecione o tipo</option>
          <option value="Y">Ativo</option>
          <option value="N">Inativo</option>
        </select>
        {errors.active && (
          <div className="invalid-feedback">
            {errors.active.message}
          </div>
        )}
      </>
    );
  }

  const renderCampoSelectOperacao = () => {
    return (
      <>
        <label htmlFor="formOperacao" className="form-label">Operação*</label>
        <select
          className={`form-select ${errors.circ_operacao ? 'is-invalid' : ''}`}
          id="formOperacao"
          {...register('circ_operacao', { required: 'Operação é obrigatório' })}
        >
          <option value="">Selecione o tipo</option>
          <option value="">Normal</option>
          <option value="">Lento</option>
          <option value="">Desativado</option>
        </select>
        {errors.circ_operacao && (
          <div className="invalid-feedback">
            {errors.circ_operacao.message}
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
          className={`form-control ${errors.data_ativacao ? 'is-invalid' : ''}`}
          id="formAtivacao"
          {...register('data_ativacao', { required: 'Data de ativação é obrigatório' })}
        />
        {errors.data_ativacao && (
          <div className="invalid-feedback">
            {errors.data_ativacao.message}
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
          className={`form-control ${errors.velocidade ? 'is-invalid' : ''}`}
          id="formVelocidade"
          {...register('velocidade', { required: 'Velocidade é obrigatória' })}
        />
        {errors.velocidade && (
          <div className="invalid-feedback">
            {errors.velocidade.message}
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
          className={`form-control ${errors.sei ? 'is-invalid' : ''}`}
          id="formSei"
          {...register('sei', { required: 'SEI é obrigatório' })}
        />
        {errors.sei && (
          <div className="invalid-feedback">
            {errors.sei.message}
          </div>
        )}
      </div>
    );
  }

  const renderCampoSelectServico = () => {
    return (
      <>
        <label htmlFor="formService" className="form-label">Lote*</label>
        <select
          className={`form-select ${errors.vel_tipo_servico ? 'is-invalid' : ''}`}
          id="formService"
          {...register('vel_tipo_servico', { required: 'Lote é obrigatório' })}
        >
          <option value="">Selecione o tipo</option>
          <option value="">Lote 1 MPLS</option>
          <option value="">Lote 2 IP</option>
        </select>

        {errors.vel_tipo_servico && (
          <div className="invalid-feedback">
            {errors.vel_tipo_servico.message}
          </div>
        )}
      </>
    );
  }

  const renderCampoSelectLink = () => {
    return (
      <>
        <label htmlFor="formLink" className="form-label">Link*</label>
        <select
          className={`form-select ${errors.vel_link ? 'is-invalid' : ''}`}
          id="formLink"
          {...register('vel_link', { required: 'Link é obrigatório' })}
        >
          <option value="">Selecione o tipo</option>
          <option value="">Básico</option>
          <option value="">Crítico</option>
        </select>
        {errors.vel_link && (
          <div className="invalid-feedback">
            {errors.vel_link.message}
          </div>
        )}
      </>
    );
  }

  const renderCampoEstoque = () => {
    return (
      <div className="form-group">
        <label htmlFor="formEstoque" className="form-label">Estoque*</label>
        <input
          type="text"
          className="form-control bg-secondary"
          id="formEstoque"
          {...register('estoque')}
          disabled
        />
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
                    {renderCampoSecretaria()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO EMPRESA */}
                    {renderCampoEmpresa()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO NOME */}
                    {renderCampoTextNomeCirc()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO STATUS */}
                    {renderCampoSelectActive()}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-3">
                    {/* CAMPO OPERAÇÃO */}
                    {renderCampoSelectOperacao()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO DATA DE ATIVAÇÃO */}
                    {renderCampoSelectAtivacao()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO SEI */}
                    {renderCampoTextSei()}
                  </div>
                  {/* CAMPO VELOCIDADE */}
                  <div className="col-md-3">
                    {renderCampoTextVel()}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-3">
                    {/* CAMPO SERVIÇO*/}
                    {renderCampoSelectServico()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO LINK */}
                    {renderCampoSelectLink()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO ESTOQUE */}
                    {renderCampoEstoque()}
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