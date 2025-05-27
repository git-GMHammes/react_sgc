// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\App.jsx
import React, { useState, useEffect } from 'react';
import Routes from './routes/index.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import NavVertical from './components/NavVertical';
import NavHorizontal from './components/NavHorizontal';
import './App.css';

function App() {
  const [navOpen, setNavOpen] = useState(false);

  // Função para alternar o estado do menu lateral
  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTimeout(() => {
          setNavOpen(false);
        }, 2000);
      }
    };

    // Executar no carregamento inicial
    handleResize();

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="app d-flex flex-column min-vh-100">
      <Header />
      <NavHorizontal />
      <div className="content-wrapper flex-grow-1 d-flex">
        <NavVertical isOpen={navOpen} toggleNav={toggleNav} />
        <main className={`p-3 flex-grow-1 ${navOpen ? 'ms-200' : 'ms-45'}`}>
          <Routes />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;