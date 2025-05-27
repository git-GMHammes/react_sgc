import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavHorizontal = () => {
    const location = useLocation();

    // Verifica se a rota atual está ativa
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    // Define as rotas baseadas nas pastas pages
    const routes = [
        { path: '/', name: 'Home', exact: true },
        {
            path: '/empresa', name: 'Empresas',
            subRoutes: [
                { path: '/empresa/listar', name: 'Listar' },
                { path: '/empresa/cadastrar', name: 'Cadastrar' },
                { path: '/empresa/consultar', name: 'Consultar' }
            ]
        },
        {
            path: '/contrato', name: 'Contratos',
            subRoutes: [
                { path: '/contrato/listar', name: 'Listar' },
                { path: '/contrato/cadastrar', name: 'Cadastrar' },
                { path: '/contrato/consultar', name: 'Consultar' }
            ]
        },
        {
            path: '/circuito', name: 'Circuitos',
            subRoutes: [
                { path: '/circuito/listar', name: 'Listar' },
                { path: '/circuito/cadastrar', name: 'Cadastrar' },
                { path: '/circuito/consultar', name: 'Consultar' }
            ]
        },
        {
            path: '/secretaria', name: 'Secretarias',
            subRoutes: [
                { path: '/secretaria/listar', name: 'Listar' },
                { path: '/secretaria/cadastrar', name: 'Cadastrar' },
                { path: '/secretaria/consultar', name: 'Consultar' }
            ]
        },
        {
            path: '/contato', name: 'Contatos',
            subRoutes: [
                { path: '/contato/listar', name: 'Listar' },
                { path: '/contato/cadastrar', name: 'Cadastrar' },
                { path: '/contato/consultar', name: 'Consultar' }
            ]
        },
        {
            path: '/cobranca', name: 'Cobranças',
            subRoutes: [
                { path: '/cobranca/listar', name: 'Listar' },
                { path: '/cobranca/cadastrar', name: 'Cadastrar' },
                { path: '/cobranca/consultar', name: 'Consultar' }
            ]
        },
        {
            path: '/teste-session', name: 'GFS (teste)',
            subRoutes: [
                { path: '/teste-session', name: 'Sessões e Cookies' },
                { path: '/pagina-provisoria', name: 'Teste Botão' },
                { path: '/pagina-modal', name: 'Teste Modal' },
                { path: '/pagina-toasts-react', name: 'Pg Toast' },

                { path: '/pagina-tools', name: 'Pg Tools' },

                { path: '/colaborador-nicholas-empresa', name: 'N1 Empresa' },
                { path: '/colaborador-nicholas-contato', name: 'N1 Contato' }

            ]
        },
        { path: '/about', name: 'Sobre' }
    ];

    return (
        <div className=" ms-3">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark ms-5">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">SGC</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarMain"
                        aria-controls="navbarMain"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarMain">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {routes.map((route) => {
                                // Se a rota tem subrotas, criar um dropdown
                                if (route.subRoutes) {
                                    return (
                                        <li className="nav-item dropdown" key={route.path}>
                                            <a
                                                className={`nav-link dropdown-toggle ${isActive(route.path) ? 'active' : ''}`}
                                                href="#"
                                                id={`${route.name.toLowerCase()}Dropdown`}
                                                role="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {route.name}
                                            </a>
                                            <ul className="dropdown-menu" aria-labelledby={`${route.name.toLowerCase()}Dropdown`}>
                                                {route.subRoutes.map((subRoute) => (
                                                    <li key={subRoute.path}>
                                                        <Link
                                                            className={`dropdown-item ${location.pathname === subRoute.path ? 'active' : ''}`}
                                                            to={subRoute.path}
                                                        >
                                                            {subRoute.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    );
                                }

                                // Se não tem subrotas, criar um item de menu simples
                                return (
                                    <li className="nav-item" key={route.path}>
                                        <Link
                                            className={`nav-link ${isActive(route.path) ? 'active' : ''}`}
                                            to={route.path}
                                            aria-current={isActive(route.path) ? "page" : undefined}
                                        >
                                            {route.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="d-flex">
                            <button className="btn btn-outline-light btn-sm" type="button">
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavHorizontal;