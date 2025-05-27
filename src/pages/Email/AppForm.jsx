import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import { useForm, FormProvider } from 'react-hook-form';
import EmailService from '../../services/email';
import ToastReact from '../../components/Message/Toasts';
import { Alert, Spinner } from 'react-bootstrap';

const AppForm = ({
    token_csrf = {},
    getID = null
}) => {
    const [loading, setLoading] = useState(false);
    const [listaEmail, setListaEmail] = useState([]);
    const [selectedEmailId, setSelectedEmailId] = useState(getID || null);
    const [showToast, setShowToast] = useState(false);
    const [messageToast, setMessageToast] = useState('');
    const [defaultHeader, setDefaultHeader] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [customToasts, setCustomToasts] = useState([{
        title: "Cadastro de Email",
        strong: "",
        time: "agora",
        delay: 1000,
        variant: "success",
        opacity: "25",
        renderChildren: null
    }]);

    // Definição dos campos para cada tipo de submissão
    const formFields = {
        // Campos para o radio submit
        radioSubmit: [
            'token_csrf',
            'id',
            'cadastro_id',
            'email',
            'favorito'
        ],

        // Campos para o submit completo (todos os campos)
        completeSubmit: [
            'token_csrf',
            'id',
            'cadastro_id',
            'favorito',
            'tipo',
            'email',
            'created_by_name',
            'created_by',
            'updated_by_name',
            'updated_by',
            'created_at',
            'updated_at',
            'deleted_at'
        ],

        // Campos para o seletor de e-mail
        selectorSubmit: [
            'token_csrf',
            'email_id'
        ]
    };

    {/* CAMPOS SUBMIT BK */ }
    const methods = useForm({
        defaultValues: {
            token_csrf: token_csrf,
            id: selectedEmailId,
            cadastro_id: null,
            favorito: null,
            tipo: null,
            email: null,
            created_by_name: null,
            created_by: null,
            updated_by_name: null,
            updated_by: null,
            created_at: null,
            updated_at: null,
            deleted_at: null,
        }
    });

    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        reset,
        formState: { errors }
    } = methods;

    // Função auxiliar para extrair apenas os campos necessários para cada submissão
    const extractFormData = (allData, fieldsList) => {
        const extractedData = {};
        fieldsList.forEach(field => {
            if (allData[field] !== undefined) {
                extractedData[field] = allData[field];
            }
        });
        return extractedData;
    };

    {/* FAVORITAR E-MAIL BK */ }
    const onSubmitRadio = (data) => {
        // console.log('onSubmitRadio Radio:', data);
        // fetchPostFilter(data.id);
        const radioData = extractFormData(data, formFields.radioSubmit);
        // console.log('onSubmitRadio radioData ::', radioData);
        // fetchSave(radioData);
    };

    {/* SALVAR DADOS BK*/ }
    const onSubmitCompleto = (data) => {
        // console.log('onSubmitCompleto Completo:', data);
        // Extrair todos os campos relevantes para o submit completo
        const completeData = extractFormData(data, formFields.completeSubmit);
        // console.log('Dados filtrados para Complete Submit:', completeData);
        // fetchSave(completeData);
    };

    {/* TROCAR E-MAIL BK */ }
    const onSubmitSeletor = async (emailId) => {
        // console.log('onSubmitSeletor | src/public/script/react_modelo_v1/frontend/src/pages/Email/AppForm.jsx');
        // console.log('onSubmitSeletor emailId:', emailId);

        if (emailId) {
            await setSelectedEmailId(emailId);
            await fetchGetById(emailId);
            await fetchPostFilter(emailId);
        }
    };

    {/* BOTÃO CANCELAR BK */ }
    const limparFormulario = () => {
        const choice = getValues('id');
        // console.log('limparFormulario - src/public/script/react_modelo_v1/frontend/src/pages/Email/AppForm.jsx');
        // console.log('limparFormulario getValues(id)', choice);
        if (
            choice === null ||
            choice === undefined ||
            choice === ''
        ) {
            reset({
                token_csrf: token_csrf,
                id: null,
                cadastro_id: null,
                favorito: null,
                tipo: null,
                email: null,
                created_by_name: null,
                created_by: null,
                updated_by_name: null,
                updated_by: null,
                created_at: null,
                updated_at: null,
                deleted_at: null,
            });
        } else {
            fetchGetById(choice);
        }
        // console.log('Formulário limpo');
    };

    const handleCancel = () => {
        // console.log('Ação cancelar');
        limparFormulario();
    };

    {/* API de FILTRO de E-MAIL */ }
    const fetchPostFilter = async (emailId = null) => {
        // console.log('fetchPostFilter / src/public/script/react_modelo_v1/frontend/src/pages/Email/AppForm.jsx');
        const cadastro_id = (emailId !== null) ? emailId : getValues('cadastro_id');
        // console.log('fetchPostFilter cadastro_id :: ', cadastro_id);
        let data = {
            email_cadastro_id: cadastro_id,
        }
        // console.log('fetchPostFilter data :: ', data);
        try {
            const response = await EmailService.postFilter(data);
            // console.log('fetchPostFilter response ::', response);
            return response;
        } catch (err) {
            console.error('Erro:', err);
        }
    };

    {/* CARREGA TODOS OS DADOS DO FOMULÁRIO BK */ }
    const fetchGetById = async (id = selectedEmailId) => {
        // console.log('Buscando email pelo ID:', id);
        if (!id) return null;

        try {
            const response = await EmailService.getById(id);
            if (response) {
                {/* esse é como o formdata */ }
                {/* usado pelo react-hook-form*/ }
                reset(response);
            }
            return response;
        } catch (err) {
            console.error('Erro:', err);
        }
    };

    const fetchSave = async (data) => {
        try {
            setLoading(true);
            const response = await EmailService.postSave(data);
            // console.log('Resposta do salvar:', response);

            // Exibir mensagem de sucesso
            setDefaultHeader('success');
            setMessageToast('Email salvo com sucesso!');
            setCustomToasts(prev => [
                {
                    ...prev[0],
                    title: "Cadastro de Email",
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

            // Recarregar lista de emails
            const updatedEmails = await fetchPostFilter();
            if (updatedEmails && updatedEmails.length > 0) {
                setListaEmail(updatedEmails);
            }
        } catch (err) {
            console.error('Erro ao salvar:', err);
            setDefaultHeader('danger');
            setMessageToast('Erro ao salvar os dados do email');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    // Efeitos
    useEffect(() => {
        // console.log('useEffect AppForm - inicialização');

        const inicializarDados = async () => {
            try {
                await fetchGetById(selectedEmailId);

                const response = await fetchPostFilter();
                if (response) {
                    setListaEmail(response);
                }
            } catch (err) {
                console.error('Erro na inicialização dos dados:', err);
            }
        };

        inicializarDados();
    }, []);

    useEffect(() => {
        if (selectedEmailId) {
            fetchGetById(selectedEmailId);
        }
    }, [selectedEmailId]);

    return (
        <div className="w-100 mb-5">
            {showToast && (
                <ToastReact
                    showToast={showToast}
                    setShowToast={setShowToast}
                    header={defaultHeader}
                    body={messageToast}
                    customToasts={customToasts}
                />
            )}

            <FormProvider {...methods}>
                <div className="row justify-content-center">
                    <div className="col-12">

                        {/* SEÇÃO 2: CAMPOS INDIVIDUAIS */}
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                <h4 className="mb-0">Formulário / E-mail {confirmationMessage}</h4>
                            </div>
                            <div className="card-body">
                                {/* Campos escondidos comum a todas as submissões */}
                                <form>
                                    <input type="hidden" {...register('token_csrf')} />
                                </form>

                                <form>
                                    <input type="hidden" {...register('id')} />
                                </form>

                                <form>
                                    <input type="hidden" {...register('cadastro_id')} />
                                </form>

                                <div className="row mb-3">
                                    {/* Form para o Radio Button (Favoritar) */}
                                    <div className="col-12 col-sm-6">
                                        <form>
                                            <div>
                                                <label htmlFor="email_id" className="form-label">Favoritar</label>
                                            </div>
                                            <div className="btn-group w-100">
                                                <button className="btn btn-dark btn-sm d-flex justify-content-between border rounded-2 w-100 text-start w-100" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                                    Selecione...
                                                    <i className="bi bi-chevron-down p-1"></i>
                                                </button>
                                                <ul className="dropdown-menu overflow-y-scroll w-100" style={{ maxHeight: '200px' }}>
                                                    {listaEmail.map((item_email, index) => (
                                                        <li key={index} value={item_email.id || ''} className="px-3 py-1">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="email"
                                                                    id={`email-${item_email.id}`}
                                                                    value={item_email.email_email}
                                                                    onChange={() => {
                                                                        // Obter o ID do email selecionado
                                                                        const emailId = item_email.email_id || '';
                                                                        // Atualizar os campos relacionados ao email
                                                                        setValue('email', item_email.email_email);
                                                                        setValue('favorito', true);
                                                                        setValue('email_id', emailId);
                                                                        
                                                                        // Chamar a mesma função que é chamada quando o select muda
                                                                        // para garantir comportamento idêntico
                                                                        if (emailId) {
                                                                            onSubmitSeletor(emailId);
                                                                            
                                                                            // O onSubmitSeletor já carrega todos os dados e muda tudo,
                                                                            // então não precisamos chamar handleSubmit(onSubmitRadio)
                                                                            // pois isso seria processado redundantemente
                                                                        }
                                                                    }}
                                                                    checked={getValues('email') === item_email.email_email}
                                                                />
                                                                <label className="form-check-label" htmlFor={`email-${item_email.email_id}`}>
                                                                    {item_email.email_email}
                                                                </label>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Form para o Seletor de Email */}
                                    <div className="col-12 col-sm-6">
                                        {/* TROCAR E-MAIL BK */}
                                        <label htmlFor="email_id" className="form-label">Mudar email</label>
                                        <select
                                            className="form-select"
                                            id="email_id"
                                            {...register('email_id')}
                                            onChange={(e) => {
                                                const selectedEmailId = e.target.value;
                                                if (selectedEmailId) {
                                                    onSubmitSeletor(selectedEmailId); // Chama a função diretamente com o valor
                                                }
                                            }}
                                        >
                                            {/* SEÇÃO 1: SELEÇÃO DE EMAIL */}
                                            <option value="">Selecione...</option>
                                            {listaEmail.map((item, index) => (
                                                <option key={index} value={item.email_id || ''}>
                                                    {item.email_email || 'Email não identificado'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Form para os campos principais (Submit Completo) */}
                                <form onSubmit={handleSubmit(onSubmitCompleto)}>
                                    <div className="row mb-3">
                                        <div className="col-12 col-sm-6">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                {...register('email')}
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <label htmlFor="tipo" className="form-label">Tipo</label>
                                            <select
                                                className={`form-select ${errors.tipo ? 'is-invalid' : ''}`}
                                                id="tipo"
                                                {...register('tipo')}
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="pessoal">Pessoal</option>
                                                <option value="comercial">Comercial</option>
                                                <option value="outro">Outro</option>
                                            </select>
                                            {errors.tipo && <div className="invalid-feedback">{errors.tipo.message}</div>}
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 justify-content-end mt-3">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="btn btn-secondary me-2"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? <Spinner animation="border" size="sm" /> : 'Salvar Tudo'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* SEÇÃO 3: INFORMAÇÕES DE AUDITORIA */}
                        <div className="accordion mt-4" id="accordionPanelsStayOpenExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelIdCadastro" aria-expanded="false" aria-controls="panelIdCadastro">
                                        Informações de Auditoria
                                    </button>
                                </h2>
                                <div id="panelIdCadastro" className="accordion-collapse collapse">
                                    <div className="accordion-body">
                                        <div className="row mb-3">
                                            <div className="col-12 col-sm-6">
                                                <label htmlFor="readOnlyId" className="form-label">ID</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-secondary text-white"
                                                    id="readOnlyId"
                                                    value={getValues('id') || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <label htmlFor="readOnlyCadastroId" className="form-label">Cadastro ID</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-secondary text-white"
                                                    id="readOnlyCadastroId"
                                                    value={getValues('cadastro_id') || ''}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-12 col-sm-8">
                                                <label htmlFor="readOnlyCreatedByName" className="form-label">Criado por (Nome)</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-secondary text-white"
                                                    id="readOnlyCreatedByName"
                                                    value={getValues('created_by_name') || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4">
                                                <label htmlFor="readOnlyCreatedBy" className="form-label">Criado por (ID)</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-secondary text-white"
                                                    id="readOnlyCreatedBy"
                                                    value={getValues('created_by') || ''}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-12 col-sm-8">
                                                <label htmlFor="readOnlyUpdatedByName" className="form-label">Atualizado por (Nome)</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-secondary text-white"
                                                    id="readOnlyUpdatedByName"
                                                    value={getValues('updated_by_name') || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4">
                                                <label htmlFor="readOnlyUpdatedBy" className="form-label">Atualizado por (ID)</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-secondary text-white"
                                                    id="readOnlyUpdatedBy"
                                                    value={getValues('updated_by') || ''}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-12 col-sm-4">
                                                <label htmlFor="readOnlyCreatedAt" className="form-label">Criado em</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-secondary text-white"
                                                    id="readOnlyCreatedAt"
                                                    value={getValues('created_at') || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4">
                                                <label htmlFor="readOnlyUpdatedAt" className="form-label">Atualizado em</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-secondary text-white"
                                                    id="readOnlyUpdatedAt"
                                                    value={getValues('updated_at') || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4">
                                                <label htmlFor="readOnlyDeletedAt" className="form-label">Deletado em</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-secondary text-white"
                                                    id="readOnlyDeletedAt"
                                                    value={getValues('deleted_at') || ''}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FormProvider >
        </div >
    );
}

export default AppForm;