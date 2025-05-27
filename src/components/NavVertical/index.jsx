import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';

const NavVertical = ({ isOpen, toggleNav }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Monitorar mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Define as rotas baseadas nas pastas pages
  const routes = [
    { path: '/', name: 'Home', icon: 'bi-house-door-fill', exact: true },
    {
      path: '/empresa/listar', name: 'Empresas', icon: 'bi-building',
      subRoutes: [
        { path: '/empresa/listar', name: 'Listar' },
        { path: '/empresa/cadastrar', name: 'Cadastrar' },
        { path: '/empresa/consultar', name: 'Consultar' }
      ]
    },
    {
      path: '/contrato/listar', name: 'Contratos', icon: 'bi-file-earmark-text-fill',
      subRoutes: [
        { path: '/contrato/listar', name: 'Listar' },
        { path: '/contrato/cadastrar', name: 'Cadastrar' },
        { path: '/contrato/consultar', name: 'Consultar' }
      ]
    },
    {
      path: '/circuito/listar', name: 'Circuitos', icon: 'bi-diagram-3-fill',
      subRoutes: [
        { path: '/circuito/listar', name: 'Listar' },
        { path: '/circuito/cadastrar', name: 'Cadastrar' },
        { path: '/circuito/consultar', name: 'Consultar' }
      ]
    },
    {
      path: '/secretaria/listar', name: 'Secretarias', icon: 'bi-people-fill',
      subRoutes: [
        { path: '/secretaria/listar', name: 'Listar' },
        { path: '/secretaria/cadastrar', name: 'Cadastrar' },
        { path: '/secretaria/consultar', name: 'Consultar' }
      ]
    },
    {
      path: '/contato/listar', name: 'Contatos', icon: 'bi-person-lines-fill',
      subRoutes: [
        { path: '/contato/listar', name: 'Listar' },
        { path: '/contato/cadastrar', name: 'Cadastrar' },
        { path: '/contato/consultar', name: 'Consultar' }
      ]
    },
    {
      path: '/cobranca/listar', name: 'Cobranças', icon: 'bi-cash-coin',
      subRoutes: [
        { path: '/cobranca/listar', name: 'Listar' },
        { path: '/cobranca/cadastrar', name: 'Cadastrar' },
        { path: '/cobranca/consultar', name: 'Consultar' }
      ]
    },
    {
      path: '/teste-session', name: 'GFS (teste)', icon: 'bi-gear-fill',
      subRoutes: [
        { path: '/teste-session', name: 'Sess/Cook' },
        { path: '/pagina-provisoria', name: 'Tes Btn' },
        { path: '/pagina-modal', name: 'Pg Modal' },
        { path: '/pagina-toasts-react', name: 'Pg Toast' },

        { path: '/pagina-tools', name: 'Pg Tools' },

        { path: '/colaborador-nicholas-empresa', name: 'N1 Empresa' },
        { path: '/colaborador-nicholas-contato', name: 'N1 Contato' }

      ]
    },
    { path: '/about', name: 'Sobre', icon: 'bi-info-circle-fill' }
  ];

  // Verifica se a rota atual está ativa
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Alterna a expansão de um item com subrotas
  const toggleExpand = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Verifica se um item deve ser expandido
  const isExpanded = (path) => {
    // Expandir automaticamente se a rota atual estiver dentro deste grupo
    if (isActive(path) && expandedItems[path] === undefined) {
      return true;
    }
    return !!expandedItems[path];
  };

  // Fechar o menu ao navegar em dispositivos móveis
  const handleMobileNavigation = () => {
    if (isMobile && isOpen) {
      toggleNav();
    }
  };

  // Determinar classe CSS combinada do sidebar
  const sidebarClassName = `sidebar ${isOpen ? 'expanded' : 'collapsed'} bg-dark border-end border-secondary`;

  return (
    <div className="">
      {/* Overlay que aparece quando o menu está aberto em dispositivos móveis */}
      {isMobile && isOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleNav}
        ></div>
      )}

      <div className={sidebarClassName}>
        {/* Cabeçalho do sidebar com o botão de toggle */}
        <div className="sidebar-header d-flex align-items-center p-2 border-bottom border-secondary">
          <button
            className="btn btn-dark btn-sm me-2 nav-toggle-btn"
            onClick={toggleNav}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            <i className={`bi ${isOpen ? 'bi-arrow-left' : 'bi-arrow-right'}`}></i>
          </button>
          {isOpen && <span className="text-white">Menu</span>}
        </div>

        <div className="nav-content">
          <div className="nav flex-column nav-pills">
            {routes.map((route, index) => {
              // Se o item tem subrotas
              if (route.subRoutes && isOpen) {
                return (
                  <div key={index} className="nav-item">
                    {/* Item principal */}
                    <a
                      href="#"
                      className={`nav-link text-white d-flex align-items-center justify-content-between ${isActive(route.path) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpand(route.path);
                      }}
                    >
                      <div>
                        <i className={`bi ${route.icon} nav-icon me-2`}></i>
                        <span className="nav-text">{route.name}</span>
                      </div>
                      <i className={`bi ${isExpanded(route.path) ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                    </a>

                    {/* Subitens */}
                    <div className={`ms-3 ${isExpanded(route.path) ? 'd-block' : 'd-none'} mt-1`}>
                      {route.subRoutes.map((subRoute, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subRoute.path}
                          className={`nav-link text-white-50 py-1 ${location.pathname === subRoute.path ? 'active text-white' : ''}`}
                          onClick={handleMobileNavigation}
                        >
                          <i className="bi bi-dot me-2"></i>
                          {subRoute.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              // Se o item tem subrotas mas o menu está recolhido, ou se é um item simples
              return (
                <Link
                  key={index}
                  to={route.path}
                  title={route.name}
                  className={`nav-link text-white d-flex align-items-center ${isActive(route.path) ? 'active' : ''}`}
                  onClick={handleMobileNavigation}
                >
                  <i className={`bi ${route.icon} nav-icon ${isOpen ? 'me-2' : ''}`}></i>
                  {isOpen && <span className="nav-text">{route.name}</span>}
                  {/* Se tem subrotas e menu está recolhido, mostra indicador */}
                  {!isOpen && route.subRoutes && <i className="ms-1 small"></i>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavVertical;