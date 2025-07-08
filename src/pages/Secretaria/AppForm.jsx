// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Secretaria\AppForm.jsx
import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import { set, useForm, useWatch } from 'react-hook-form';
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
      pro_origem_id: '2',
      nome: '',
      cnpj_cpf: '',
      tipo: 'Secretaria',
      active: 'Y',
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

  // Observar mudanças no campo cad_cnpj_cpf para formatação
  const cnpjCpfValue = useWatch({
    control,
    name: 'cnpj_cpf',
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
        pro_origem_id: updateData.orig_id || '2',
        tipo: updateData.cad_tipo || 'Secretaria',
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
      setShowUpdateData(updateData);
    } else {
      // Cadastro: limpa o formulário/inicializa com os valores default
      let dadosIniciais = {
        remember_token: token_csrf,
        token_csrf: token_csrf,
        pro_origem_id: '2',
        tipo: 'Secretaria'
      };
      reset(dadosIniciais);
    }
  }

  // Formatar CNPJ/CPF
  useEffect(() => {

    if (cnpjCpfValue) {
      // Remover todos os caracteres não numéricos
      let value = cnpjCpfValue.replace(/\D/g, '');

      // Formato CNPJ: XX.XXX.XXX/XXXX-XX
      if (value.length > 12) {
        value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, '$1.$2.$3/$4-$5');
      } else if (value.length > 8) {
        value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4}).*/, '$1.$2.$3/$4');
      } else if (value.length > 5) {
        value = value.replace(/^(\d{2})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,3}).*/, '$1.$2');
      }

      if (value !== cnpjCpfValue) {
        setValue('cnpj_cpf', value);
      }
    }

  }, [cnpjCpfValue, setValue]);

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

  // Função para formatar CNPJ/CPF durante a digitação
  const handleCnpjCpfChange = (e) => {
    let { value } = e.target;

    // Remover todos os caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Formato CNPJ: XX.XXX.XXX/XXXX-XX
    if (value.length > 12) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, '$1.$2.$3/$4-$5');
    } else if (value.length > 8) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4}).*/, '$1.$2.$3/$4');
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,3}).*/, '$1.$2');
    }

    // Limpar erro específico quando o campo é alterado
    if (errors.cnpj_cpf) {
      setErrors({
        ...errors,
        cnpj_cpf: null
      });
    }
  };

  const renderCampoSelectSigla = () => {
    return (
      <div className="form-group">
        <label htmlFor="formSigla" className="form-label">Sigla*</label>
        <input
          type="text"
          className={`form-control ${errors.sigla_pronome_tratamento ? 'is-invalid' : ''}`}
          id="formSigla"
          {...register('sigla_pronome_tratamento', { required: 'SEI é obrigatório' })}
        />
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
    );
  }

  const renderCampoCnpjCpf = () => {
    return (
      <>
        <label htmlFor="formCnpjCpf" className="form-label">CNPJ*</label>
        <input
          type="text"
          className={`form-control ${errors.cnpj_cpf ? 'is-invalid' : ''}`}
          onSubmit={handleCnpjCpfChange}
          id="formCnpjCpf"
          placeholder="00.000.000/0000-00"
          {...register('cnpj_cpf', {
            required: 'CNPJ é obrigatório',
            validate: {
              validFormat: (value) => {
                const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
                const onlyNumbers = value.replace(/\D/g, '');

                if (onlyNumbers.length > 11) {
                  // CNPJ
                  return (cnpjRegex.test(value) || onlyNumbers.length === 14) ||
                    'CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX ou apenas números';
                }
              }
            }
          })}
        />
        {errors.cnpj_cpf && (
          <div className="invalid-feedback">
            {errors.cnpj_cpf.message}
          </div>
        )}
      </>
    );
  }

  const renderCampoTextAcitve = () => {
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
          onSubmit={handleSubmit(salvarSecretaria)}
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
                  <div className="col-md-3">
                    {/* CAMPO SECRETARIA */}
                    {renderCampoSelectSigla()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO SEI */}
                    {renderCampoTextNome()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO SEI */}
                    {renderCampoCnpjCpf()}
                  </div>
                  <div className="col-md-3">
                    {/* CAMPO SEI */}
                    {renderCampoTextAcitve()}
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