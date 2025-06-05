// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Empresa\AppForm.jsx
import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { set, useForm, useWatch } from 'react-hook-form';
import EmpresaService from '../../services/empresa';
import OrigemService from '../../services/origem';
import EmailService from '../../services/email';
import TelefoneService from '../../services/telefone';
import EnderecoService from '../../services/endereco';
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
  const [origens, setOrigens] = useState([]);
  const [emails, setEmails] = useState([]);
  const [telefones, setTelefones] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [tokenCsrf, setTokenCsrf] = useState('');
  const [loading, setLoading] = useState(true);
  const [defaultHeader, setDefaultHeader] = useState('primary');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [messageToast, setMessageToast] = useState('...');
  const [showToast, setShowToast] = useState(false);
  const [showUpdateData, setShowUpdateData] = useState([]);
  
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

      // cad (cadastro principal)
      id: '',
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

      // orig (pro_cad_origem)
      orig_id: '4',
      orig_form_on: '',
      orig_descricao: '',
      orig_informação: '',
      orig_created_by: '0',
      orig_created_by_name: 'unknown',
      orig_updated_by: '0',
      orig_updated_by_name: 'unknown',
      orig_created_at: '',
      orig_updated_at: '',
      orig_deleted_at: '',

      // mail (pro_cad_email)
      mail_id: '',
      mail_email: '',
      mail_favorito: 'Y',
      mail_cadastro_id: '',
      mail_created_by: '0',
      mail_created_by_name: 'unknown',
      mail_updated_by: '0',
      mail_updated_by_name: 'unknown',
      mail_created_at: '',
      mail_updated_at: '',
      mail_deleted_at: '',

      // tel (pro_cad_telefone)
      tel_id: '',
      tel_numero: '',
      tel_tipo: '',
      tel_favorito: 'Y',
      tel_cadastro_id: '',
      tel_created_by: '0',
      tel_created_by_name: 'unknown',
      tel_updated_by: '0',
      tel_updated_by_name: 'unknown',
      tel_created_at: '',
      tel_updated_at: '',
      tel_deleted_at: '',

      // end (pro_cad_endereco)
      end_id: '',
      end_favorito: 'Y',
      end_cadastro_id: '',
      end_cep: '',
      end_tipo_logradouro: '',
      end_logradouro: '',
      end_numero: '',
      end_complemento: '',
      end_bairro: '',
      end_cidade: '',
      end_estado: '',
      end_pais: '',
      end_ponto_referencia: '',
      end_latitude: '',
      end_longitude: '',
      end_regiao: '',
      end_tipo_imovel: '',
      end_informacao_acesso: '',
      end_area_risco: '',
      end_created_by: '0',
      end_created_by_name: 'unknown',
      end_updated_by: '0',
      end_updated_by_name: 'unknown',
      end_created_at: '',
      end_updated_at: '',
      end_deleted_at: '',

      // campos de controle comuns
      created_at: '',
      updated_at: '',
      deleted_at: null,
    }
  });

  // Observar mudanças no campo cad_cnpj_cpf para formatação
  const cnpjCpfValue = useWatch({
    control,
    name: 'cad_cnpj_cpf',
  });

  // Funções de submissão para diferentes propósitos
  const salvarEmpresa = (data) => {
    fetchSave(data);
    // console.log('Salvando empresa:', data);
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

  const cadastrarEmpresa = async (formData) => {
    try {

      // 1. Obtém token CSRF antes do envio
      const endpointData = await EmpresaService.getEndPoint();

      // 2. Monta o payload com token e json: 1
      const payload = {
        ...formData,
        token_csrf: endpointData.token_csrf,
        json: 1,
      };

      const response = await EmpresaService.postSave(payload);

      if (response && !response.error) {
        // Cadastro foi bem-sucedido
        console.log('Empresa cadastrada com sucesso:', response);
        alert('Cadastro realizado com sucesso!');
      } else {
        // Houve algum erro vindo do back-end
        console.error('Erro ao cadastrar:', response.error);
        alert('Erro ao cadastrar: ' + response.error);
      }
    } catch (error) {
      // Erro de rede ou exceção
      console.error('Erro ao salvar empresa:', error);
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

  const fetchOrigens = async () => {
    try {
      setLoading(true);
      const response = await OrigemService.getAll(1, 100); // isso retorna a lista do banco
      console.log("Origens encontradas:", response); // Verificar o que está vindo
      setOrigens(response);
    } catch (error) {
      console.error('Erro ao buscar origens:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGetById = async (id = getID) => {
    try {
      const response = await EmpresaService.getById(id);
      console.log('fetchGetById/Cliente:', response);
      return response;

    } catch (error) {
      console.error('Erro empresa:', error);
    }
  };

  const fetchSave = async (data) => {
    try {
      setLoading(false);

      const response = await EmpresaService.postSave(data);
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
    const resultado = await EmpresaService.getEndPoint();
    if (resultado && resultado.token_csrf) {
      setTokenCsrf(resultado.token_csrf);
    } else {
      alert('Erro ao obter token CSRF.');
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

          orig_id: updateData.orig_id || '4',
          orig_created_by: updateData.orig_created_by || '0',
          orig_created_by_name: updateData.orig_created_by_name || 'unknown',
          orig_updated_by: updateData.orig_updated_by || '0',
          orig_updated_by_name: updateData.orig_updated_by_name || 'unknown',

          mail_favorito: updateData.mail_favorito || 'Y',
          mail_cadastro_id: updateData.mail_cadastro_id || '',
          mail_created_by: updateData.mail_created_by || '0',
          mail_created_by_name: updateData.mail_created_by_name || 'unknown',
          mail_updated_by: updateData.mail_updated_by || '0',
          mail_updated_by_name: updateData.mail_updated_by_name || 'unknown',

          tel_favorito: updateData.tel_favorito || 'Y',
          tel_cadastro_id: updateData.tel_cadastro_id || '',
          tel_created_by: updateData.tel_created_by || '0',
          tel_created_by_name: updateData.tel_created_by_name || 'unknown',
          tel_updated_by: updateData.tel_updated_by || '0',
          tel_updated_by_name: updateData.tel_updated_by_name || 'unknown',

          end_favorito: updateData.end_favorito || 'Y',
          end_created_by: updateData.end_created_by || '0',
          end_created_by_name: updateData.end_created_by_name || 'unknown',
          end_updated_by: updateData.end_updated_by || '0',
          end_updated_by_name: updateData.end_updated_by_name || 'unknown',

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

        orig_id: '',
        orig_created_by: '',
        orig_created_by_name: '',
        orig_updated_by: '',
        orig_updated_by_name: '',

        mail_favorito: '',
        mail_cadastro_id: '',
        mail_created_by: '',
        mail_created_by_name: '',
        mail_updated_by: '',
        mail_updated_by_name: '',

        tel_favorito: '',
        tel_cadastro_id: '',
        tel_created_by: '',
        tel_created_by_name: '',
        tel_updated_by: '',
        tel_updated_by_name: '',

        end_favorito: '',
        end_created_by: '',
        end_created_by_name: '',
        end_updated_by: '',
        end_updated_by_name: '',

        created_at: '',
        updated_at: '',
        deleted_at: ''
      });
    }
  };

  // Formatar CNPJ/CPF
  useEffect(() => {
  
    if (cnpjCpfValue) {
      // Remover todos os caracteres não numéricos
      let value = cnpjCpfValue.replace(/\D/g, '');

      if (value.length <= 11) {
        // Formato CPF: XXX.XXX.XXX-XX
        if (value.length > 9) {
          value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
          value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
        } else if (value.length > 3) {
          value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
        }
      } else {
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
      }

      if (value !== cnpjCpfValue) {
        setValue('cad_cnpj_cpf', value);
      }
    }

  },[cnpjCpfValue, setValue]);  

  useEffect(() => {
    try {
      const startData = async () => {
        await fetchOrigens();
        await registerform();
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

    if (value.length <= 11) {
      // Formato CPF: XXX.XXX.XXX-XX
      if (value.length > 9) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
      } else if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
      }
    } else {
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
    }

    // Limpar erro específico quando o campo é alterado
    if (errors.cad_cnpj_cpf) {
      setErrors({
        ...errors,
        cad_cnpj_cpf: null
      });
    }
  };

  const renderCampoSelectOrigem = () => {
    return (
      <>
        <label htmlFor="formOrigem" className="form-label">Origem*</label>
        <select
          className={`form-select ${errors.pro_origem_id ? 'is-invalid' : ''}`}
          id="formOrigem"
          {...register('cad_pro_origem_id', { required: 'Origem é obrigatório' })}
        >
          <option value="">Selecione...</option>
          {origens.map((origem) => (
            <option key={origem.id} value={origem.id}>
              {origem.descricao}
            </option>
          ))}
        </select>
        {errors.cad_pro_origem_id && (
          <div className="invalid-feedback">
            {errors.cad_pro_origem_id.message}
          </div>
        )}
      </>
    );
  }

  const renderCampoTipo = () => {
    return (
      <>
        <label htmlFor="formTipo" className="form-label">Tipo*</label>
        <select
          className={`form-select ${errors.cad_tipo ? 'is-invalid' : ''}`}
          id="formTipo"
          {...register('cad_tipo', { required: 'Tipo é obrigatório' })}
        >
          <option value="">Selecione o tipo</option>
          <option value="Cliente">Cliente</option>
          <option value="Fornecedor">Fornecedor</option>
          <option value="Ambos">Ambos</option>
        </select>
        {errors.tipo && (
          <div className="invalid-feedback">
            {errors.tipo.message}
          </div>
        )}
      </>
    );
  }

  const renderCampoSigla = () => {
    return (
      <>
        <label htmlFor="formSigla" className="form-label">Sigla/Pronome</label>
        <input
          type="text"
          className="form-control"
          id="formSigla"
          maxLength={10}
          {...register('cad_sigla_pronome_tratamento')}
        />
      </>
    );
  }

  const renderCampoNome = () => {
    return (
      <>
        <label htmlFor="formNome" className="form-label">Nome/Razão Social*</label>
        <input
          type="text"
          className={`form-control ${errors.cad_nome ? 'is-invalid' : ''}`}
          id="formNome"
          {...register('cad_nome', { required: 'Nome é obrigatório' })}
        />
        {errors.cad_nome && (
          <div className="invalid-feedback">
            {errors.cad_nome.message}
          </div>
        )}
      </>
    );
  }

  const renderCampoAtivo = () => {
    return (
      <>
        <label htmlFor="formActive" className="form-label">Ativo</label>
        <select
          className="form-select"
          id="formActive"
          {...register('cad_active')}
        >
          <option value="Y">Sim</option>
          <option value="N">Não</option>
        </select>
      </>
    );
  }

  const renderCampoCPF_CNPJ = () => {
    return (
      <>
        <label htmlFor="formCnpjCpf" className="form-label">CNPJ/CPF*</label>
        <input
          type="text"
          className={`form-control ${errors.cad_cnpj_cpf ? 'is-invalid' : ''}`}
          onSubmit={handleCnpjCpfChange}
          id="formCnpjCpf"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          {...register('cad_cnpj_cpf', {
            required: 'CNPJ/CPF é obrigatório',
            validate: {
              validFormat: (value) => {
                const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
                const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                const onlyNumbers = value.replace(/\D/g, '');

                if (onlyNumbers.length > 11) {
                  // CNPJ
                  return (cnpjRegex.test(value) || onlyNumbers.length === 14) ||
                    'CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX ou apenas números';
                } else {
                  // CPF
                  return (cpfRegex.test(value) || onlyNumbers.length === 11) ||
                    'CPF inválido. Use o formato XXX.XXX.XXX-XX ou apenas números';
                }
              }
            }
          })}
        />
        {errors.cad_cnpj_cpf && (
          <div className="invalid-feedback">
            {errors.cad_cnpj_cpf.message}
          </div>
        )}
      </>
    );
  }

  const renderCampoEmail = () => {
    return (
      <>
        <label htmlFor="formEmail" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="formEmail"
          {...register('mail_email')}
        />
      </>
    );
  }

  const renderCampoNumero = () => {
    return (
      <>
        <label htmlFor="formNumero" className="form-label">Telefone</label>
        <input
          type="text"
          className="form-control"
          id="formNumero"
          {...register('tel_numero')}
        />
      </>
    );
  }

  const renderCampoTelTipo = () => {
    return (
      <>
        <label htmlFor="formTelTipo" className="form-label">Tipo Telefone</label>
        <input
          type="text"
          className="form-control"
          id="formTelTipo"
          {...register('tel_tipo')}
        />
      </>
    );
  }

  const renderCampoCEP = () => {
    return (
      <>
        <label htmlFor="formCEP" className="form-label">CEP</label>
        <input
          type="number"
          className="form-control"
          id="formCEP"
          {...register('end_cep')}
        />
      </>
    );
  }

  const renderCampoLogadouro = () => {
    return (
      <>
        <label htmlFor="formLogradouro" className="form-label">Logradouro</label>
        <input
          type="text"
          className="form-control"
          id="formLogradouro"
          {...register('end_logradouro')}
        />
      </>
    );
  }

  const renderCampoEndNumero = () => {
    return (
      <>
        <label htmlFor="formEndNumero" className="form-label">Número</label>
        <input
          type="text"
          className="form-control"
          id="formEndNumero"
          {...register('end_numero')}
        />
      </>
    );
  }

  const renderCampoBairro = () => {
    return (
      <>
        <label htmlFor="formBairro" className="form-label">Bairro</label>
        <input
          type="text"
          className="form-control"
          id="formBairro"
          {...register('end_bairro')}
        />
      </>
    );
  }

  const renderCampoCidade = () => {
    return (
      <>
        <label htmlFor="formCidade" className="form-label">Cidade</label>
        <input
          type="text"
          className="form-control"
          id="formCidade"
          {...register('end_cidade')}
        />
      </>
    );
  }

  const renderCampoEstado = () => {
    return (
      <>
        <label htmlFor="formEstado" className="form-label">Estado</label>
        <input
          type="text"
          className="form-control"
          id="formEstado"
          {...register('end_estado')}
        />
      </>
    );
  }

  const renderRowLogForm = () => {
    return (
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="formToken" className="form-label">Token</label>
            <input
              type="text"
              className="form-control font-monospace"
              id="formToken"
              disabled
              {...register('cad_remember_token')}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="formCreatedBy" className="form-label">Criado por</label>
            <input
              type="text"
              className="form-control bg-secondary"
              id="formCreatedBy"
              disabled
              {...register('cad_created_by_name')}
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
              {...register('cad_created_at')}
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
              {...register('cad_updated_by_name')}
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
              {...register('cad_updated_at')}
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
          onSubmit={handleSubmit(salvarEmpresa)}
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
              <h4 className="mb-0">Formulário / Empresa {confirmationMessage}</h4>
            </div>
            <div className="card-body">
              <form
                className="nav-item"
                onSubmit={handleSubmit(salvarEmpresa)}
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
                  <div className="form-group">
                    <input
                      type="hidden"
                      className="form-control bg-secondary"
                      id="formEnderecoFav"
                      value="Y"
                      {...register('end_favorito')}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    {/* CAMPO SECRETARIA */}
                    {renderCampoSelectOrigem()}
                  </div>
                  <div className="col-md-4">
                    {/* CAMPO SEI */}
                    {renderCampoTipo()}
                  </div>
                  <div className="col-md-4">
                    {/* CAMPO DATA INÍCIO */}
                    {renderCampoSigla()}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    {/* CAMPO DATA FIM */}
                    {renderCampoNome()}
                  </div>
                  <div className="col-md-4">
                    {/* CAMPO SECRETARIA */}
                    {renderCampoAtivo()}
                  </div>
                  <div className="col-md-4">
                    {/* CAMPO SEI */}
                    {renderCampoCPF_CNPJ()}
                  </div>
                </div>
                  

                <div className="row mb-3">
                  <div className="col-md-4">
                    {/* CAMPO DATA INÍCIO */}
                    {renderCampoEmail()}
                  </div>
                  <div className="col-md-4">
                    {/* CAMPO DATA FIM */}
                    {renderCampoNumero()}
                  </div>
                  <div className="col-md-4">
                    {/* CAMPO SECRETARIA */}
                    {renderCampoTelTipo()}
                  </div>
                </div>


                <div className="row mb-3">
                  <div className="col-md-4">
                    {/* CAMPO SEI */}
                    {renderCampoCEP()}
                  </div>
                  <div className="col-md-4">
                    {/* CAMPO DATA INÍCIO */}
                    {renderCampoLogadouro()}
                  </div>
                  <div className="col-md-4">
                    {/* CAMPO DATA FIM */}
                    {renderCampoEndNumero()}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    {/* CAMPO SECRETARIA */}
                    {renderCampoBairro()}
                  </div>
                  <div className="col-md-4">
                    {/* CAMPO SEI */}
                    {renderCampoCidade()}
                  </div>
                  <div className="col-md-4">
                    {/* CAMPO DATA INÍCIO */}
                    {renderCampoEstado()}
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
            data={origens}
            title="Resposta da API Origens"
            collapsed={true}
          />

          <JSONViewer
            data={showUpdateData}
            title="Resposta da API fetchGetById (Atualizar Empresa)"
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