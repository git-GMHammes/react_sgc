// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\routes\index.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas principais
import Home from '../pages/Home';
import TesteSession from '../pages/Teste/SessionCookie';
import PaginaProvisoria from '../pages/Teste/PaginaProvisoria';
import PaginaModal from '../pages/Teste/PaginaModal';
import PaginaToastsReact from '../pages/Teste/PaginaToastsReact';
import PaginaTools from '../pages/Teste/PaginaTools';

// Nicholas
import ColaboradorNicholasEmpresa from '../pages/Teste/Colaborador/Nicholas/Empresa';
import ColaboradorNicholasContato from '../pages/Teste/Colaborador/Nicholas/Contato';

// Circuitos
import CircuitosListar from '../pages/Circuito/AppListar';
import CircuitosCadastrar from '../pages/Circuito/AppCadastrar';
import CircuitosConsultar from '../pages/Circuito/AppConsultar';

// Secretarias
import SecretariasListar from '../pages/Secretaria/AppListar';
import SecretariasCadastrar from '../pages/Secretaria/AppCadastrar';
import SecretariasConsultar from '../pages/Secretaria/AppConsultar';

// Cobranças
import CobrancasListar from '../pages/Cobranca/AppListar';
import CobrancasCadastrar from '../pages/Cobranca/AppCadastrar';
import CobrancasConsultar from '../pages/Cobranca/AppConsultar';

// Contatos
import ContatosListar from '../pages/Contato/AppListar';
import ContatosCadastrar from '../pages/Contato/AppCadastrar';
import ContatosConsultar from '../pages/Contato/AppConsultar';

// Contrato (não encontrei Contato_operadoras na estrutura de diretórios)
import ContratosListar from '../pages/Contrato/AppListar';
import ContratosCadastrar from '../pages/Contrato/AppCadastrar';
import ContratosConsultar from '../pages/Contrato/AppConsultar';

// Empresas
import EmpresasListar from '../pages/Empresa/AppListar';
import EmpresasCadastrar from '../pages/Empresa/AppCadastrar';
import EmpresasConsultar from '../pages/Empresa/AppConsultar';

const RouteConfig = () => {
    return (
        <Routes>
            {/* Rotas principais */}
            <Route path="/" element={<Home />} />
            <Route path="/teste-session" element={<TesteSession />} />
            <Route path="/pagina-provisoria" element={<PaginaProvisoria />} />
            <Route path="/pagina-modal" element={<PaginaModal />} />
            <Route path="/pagina-toasts-react" element={<PaginaToastsReact />} />

            <Route path="/pagina-tools" element={<PaginaTools />} />

            {/* Nicholas */}
            <Route path="/colaborador-nicholas-empresa" element={<ColaboradorNicholasEmpresa />} />
            <Route path="/colaborador-nicholas-contato" element={<ColaboradorNicholasContato />} />

            
            {/* Rotas de Circuitos */}
            <Route path="/circuito/listar" element={<CircuitosListar />} />
            <Route path="/circuito/cadastrar" element={<CircuitosCadastrar />} />
            <Route path="/circuito/consultar" element={<CircuitosConsultar />} />
            
            {/* Rotas de Secretarias */}
            <Route path="/Secretaria/listar" element={<SecretariasListar />} />
            <Route path="/Secretaria/cadastrar" element={<SecretariasCadastrar />} />
            <Route path="/Secretaria/consultar" element={<SecretariasConsultar />} />
            
            {/* Rotas de Cobranças */}
            <Route path="/cobranca/listar" element={<CobrancasListar />} />
            <Route path="/cobranca/cadastrar" element={<CobrancasCadastrar />} />
            <Route path="/cobranca/consultar" element={<CobrancasConsultar />} />
            
            {/* Rotas de Contatos */}
            <Route path="/contato/listar" element={<ContatosListar />} />
            <Route path="/contato/cadastrar" element={<ContatosCadastrar />} />
            <Route path="/contato/consultar" element={<ContatosConsultar />} />
            
            {/* Rotas de Contratos */}
            <Route path="/contrato/listar" element={<ContratosListar />} />
            <Route path="/contrato/cadastrar" element={<ContratosCadastrar />} />
            <Route path="/contrato/consultar" element={<ContratosConsultar />} />
            
            {/* Rotas de Empresas */}
            <Route path="/empresa/listar" element={<EmpresasListar />} />
            <Route path="/empresa/cadastrar" element={<EmpresasCadastrar />} />
            <Route path="/empresa/consultar" element={<EmpresasConsultar />} />
            
            {/* Rota de fallback (redireciona URLs desconhecidas para Home) */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default RouteConfig;