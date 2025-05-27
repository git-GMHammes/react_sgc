// src\public\script\react_modelo_v1\frontend\src\pages\Empresa\AppForm.jsx
import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { useForm, useWatch } from 'react-hook-form';
import EmpresaService from '../../services/empresa';
import OrigemService from '../../services/origem';
import ToastsReact from '../../components/Message/Toasts';
import { Alert, Spinner } from 'react-bootstrap';

const AppForm = ({
  token_csrf = {},
  getID = null
}) => {

  const [tokenCsrf, setTokenCsrf] = useState('');
  const [opcoesOrigem, setOpcoesOrigem] = useState([]);
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

  const limparFormulario = () => {
    reset();
    // console.log('Formulário limpo');
  };

  // Formatar CNPJ/CPF
  useEffect(() => {

    const fetchOrigens = async () => {
      try {
        const data = await OrigemService.getAll(1, 100); // isso retorna a lista do banco
        setOpcoesOrigem(data);
      } catch (error) {
        console.error('Erro ao buscar origens:', error);
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

    carregarToken();

    fetchOrigens();

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
  }, [cnpjCpfValue, setValue]);

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

  const handleCancel = () => {
    // Implementar lógica de cancelamento (voltar para página anterior, etc.)
    // console.log('Ação cancelar');
  };

  const fetchGetById = async (id = getID) => {
    try {
      const response = await EmpresaService.getById(id);
      return response;

    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const fetchSave = async (data) => {
    try {
      setLoading(false);

      const response = await EmpresaService.postSave(data);
      // console.log('Resposta do postFilter:', response);
      setConfirmationMessage('/ Erro ao salvar os Dados');
      // setDefaultHeader('success'); 
      setDefaultHeader('danger');
      setMessageToast('Empresa salva com sucesso!');
      setCustomToasts(prev => [
        {
          ...prev[0],
          title: "Cadastro de Empresa",
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
            pro_origem_id: updateData.cad_pro_origem_id || '',
            tipo: updateData.cad_tipo || '',
            active: updateData.cad_active || 'Y',
            sigla_pronome_tratamento: updateData.cad_sigla_pronome_tratamento || '',
            nome: updateData.cad_nome || '',
            cnpj_cpf: updateData.cad_cnpj_cpf || '',
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
                      <select
                        className={`form-control ${errors.pro_origem_id ? 'is-invalid' : ''}`}
                        id="formOrigem"
                        {...register('cad_pro_origem_id', { required: 'Origem é obrigatório' })}
                      >
                        <option value="">Selecione...</option>
                        {opcoesOrigem.map((origem) => (
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
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group">
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
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formSigla" className="form-label">Sigla/Pronome</label>
                      <input
                        type="text"
                        className="form-control"
                        id="formSigla"
                        maxLength={10}
                        {...register('cad_sigla_pronome_tratamento')}
                      />
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="form-group">
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
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label htmlFor="formActive" className="form-label">Ativo</label>
                      <select
                        className="form-select"
                        id="formActive"
                        {...register('cad_active')}
                      >
                        <option value="Y">Sim</option>
                        <option value="N">Não</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="formCnpjCpf" className="form-label">CNPJ/CPF*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cad_cnpj_cpf ? 'is-invalid' : ''}`}
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
                    </div>
                  </div>
                  <div className="col-md-6">
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
                </div>

                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formEmail" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="formEmail"
                        {...register('mail_email')}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formNumero" className="form-label">Telefone</label>
                      <input
                        type="text"
                        className="form-control"
                        id="formNumero"
                        {...register('tel_numero')}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formTelTipo" className="form-label">Tipo Telefone</label>
                      <input
                        type="text"
                        className="form-control"
                        id="formTelTipo"
                        {...register('tel_tipo')}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formCEP" className="form-label">CEP</label>
                      <input
                        type="number"
                        className="form-control"
                        id="formCEP"
                        {...register('end_cep')}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formLogradouro" className="form-label">Logradouro</label>
                      <input
                        type="text"
                        className="form-control"
                        id="formLogradouro"
                        {...register('end_logradouro')}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formEndNumero" className="form-label">Número</label>
                      <input
                        type="text"
                        className="form-control"
                        id="formEndNumero"
                        {...register('end_numero')}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formBairro" className="form-label">Bairro</label>
                      <input
                        type="text"
                        className="form-control"
                        id="formBairro"
                        {...register('end_bairro')}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formCidade" className="form-label">Cidade</label>
                      <input
                        type="text"
                        className="form-control"
                        id="formCidade"
                        {...register('end_cidade')}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="formEstado" className="form-label">Estado</label>
                      <input
                        type="text"
                        className="form-control"
                        id="formEstado"
                        {...register('end_estado')}
                      />
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
                        {...register('updated_at')}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
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
                  onSubmit={handleSubmit(cadastrarEmpresa)}
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