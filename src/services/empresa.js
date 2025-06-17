// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\services\empresa.js
import axios from 'axios';
import { getBaseApi } from '../config/env';

// Obter a URL base do ambiente atual
const baseUrl = getBaseApi();
// console.log('baseUrl (C:/laragon/www/sgcpro/src/public/script/react_modelo_v1/frontend/src/services/circuito.js):', baseUrl);

// Configuração base do axios
const api = axios.create({
    baseURL: `${baseUrl}sgcpro`,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000
});

// Serviço para gerenciar empresas
const EmpresaService = {

    getEndPoint: async (parameter = null) => {
        let url = `/empresa/endpoint/exibir`;

        if (parameter === null) {
            url = `/empresa/endpoint/exibir`;
        } else {
            url = `/empresa/endpoint/${parameter}`;
        }
        let gov_br = [];
        let token_csrf = '';
        let getURI = [];
        try {
            const response = await api.get(url);
            // console.log('response ::', response)

            if (response.data.result.gov_br) {
                gov_br = response.data.result.gov_br;
            } else {
                return false;
            }

            if (response.data.result.token_csrf) {
                token_csrf = response.data.result.token_csrf;
            } else {
                return false;
            }
            if (response.data.metadata.getURI) {
                getURI = response.data.metadata.getURI;
            } else {
                return false;
            }

            return {
                'gov_br': gov_br,
                'token_csrf': token_csrf,
                'getURI': getURI
            };

        } catch (error) {
            // Tratamento específico para erro 404
            if (error.response && error.response.status === 404) {
                // console.error('Erro 404: Endereço não encontrado');
                return { error: 'Endereço [getEndPoint] => ${url}' + url + ' não encontrado', status: 404 };
            }
            console.error('Erro em getEndPoint:', error);
            throw error;
        }
    },

    // Método getAll com tratamento de erro completo
    getAll: async (page = 1, limit = 10) => {

        const url = `/empresa/api/exibir?page=${page}&limit=${limit}`;

        try {
            const response = await api.get(url);
            if (response.data.result.dbResponse !== undefined) {
                return response.data.result.dbResponse;
            } else {
                return [];
            }
        } catch (error) {
            // Tratamento específico para erro 404
            if (error.status && error.status === 404) {
                // console.error('Erro 404: Endereço não encontrado');
                return { error: 'Endereço [getAll] => ${url}' + url + ' não encontrado', status: 404 };
            }

            console.error('Erro em getAll:', error);
            throw error;
        }
    },

    // Método getPagination com tratamento de erro completo
    getPagination: async (page = 1, limit = 10) => {

        const url = `/empresa/api/exibir?page=${page}&limit=${limit}`;

        try {
            const response = await api.get(url);
            if (response.data.result.linksArray !== undefined) {
                return response.data.result.linksArray;
            } else {
                return [];
            }
        } catch (error) {
            // Tratamento específico para erro 404
            if (error.response && error.response.status === 404) {
                // console.error('Erro 404: Endereço não encontrado');
                return { error: 'Endereço [getPagination] => ${url}' + url + ' não encontrado', status: 404 };
            }

            console.error('Erro em getPagination:', error);
            throw error;
        }
    },

    // Método getById com tratamento de erro completo
    getById: async (id) => {
        const url = `/empresa/api/exibir/${id}`;

        try {
            const response = await api.get(url);

            if (response.data.result.dbResponse[0]) {
                return response.data.result.dbResponse[0];
            } else {
                return false;
            }
        } catch (error) {
            // Tratamento específico para erro 404
            if (error.status && error.status === 404) {
                // console.error('Erro 404: Endereço não encontrado');
                return { error: `Endereço [getById] => ${url} não encontrado`, status: 404 };
            }

            console.error('Erro em getById:', error);
            throw error;
        }
    },

    // Método postFilter com tratamento de erro completo
    postFilter: async (data, page = 1, limit = 10) => {

        const url = `/empresa/api/filtrar?page=${page}&limit=${limit}`;
        // console.log('url (C:/laragon/www/sgcpro/src/public/script/react_modelo_v1/frontend/src/services/empresa.js):', url);

        try {
            const response = await api.post(url, data);
            if (response.data.result.dbResponse !== undefined) {
                return response.data.result.dbResponse;
            } else {
                return [];
            }
        } catch (error) {
            // Tratamento específico para erro 404
            if (error.response && error.response.status === 404) {
                // console.error('Erro 404: Endereço não encontrado');
                return { error: 'Endereço [postFilter] => ${url}' + url + ' não encontrado', status: 404 };
            }

            console.error('Erro em postFilter:', error);
            throw error;
        }
    },

    // Método postSalvar com tratamento de erro completo
    postSave: async (data) => {

        const url = `/empresa/api/salvar`;
        // console.log('url (C:/laragon/www/sgcpro/src/public/script/react_modelo_v1/frontend/src/services/empresa.js):', url);

        let idSave = 0;
        let buildReturn = {
            status: `erro`,
            id: 0,
            affectedRows: 0,
        };

        try {
            const response = await api.post(url, data);
            // console.log('response :: ', response);

            // insertID
            // updateID
            // affectedRows

            if (
                response.data !== undefined &&
                response.data.result !== undefined &&
                response.data.result.insertID !== undefined
            ) {
                idSave = response.data.result.insertID;
            }

            if (
                response.data !== undefined &&
                response.data.result !== undefined &&
                response.data.result.updateID !== undefined
            ) {
                idSave = response.data.result.updateID;
            }

            if (
                response.data !== undefined &&
                response.data.status !== undefined &&
                response.data.result.affectedRows !== null
            ) {
                buildReturn = {
                    status: response.data.status,
                    id: idSave,
                    affectedRows: response.data.result.affectedRows,
                };
            }

            console.log('buildReturn :: ', buildReturn);
            return buildReturn;

        } catch (error) {
            // Tratamento específico para erro 404
            if (error.response && error.response.status === 404) {
                // console.error('Erro 404: Endereço não encontrado');
                return { error: 'Endereço [postFilter] => ${url}' + url + ' não encontrado', status: 404 };
            }

            console.error('Erro em postFilter:', error);
            throw error;
        }
    }

}

export default EmpresaService;