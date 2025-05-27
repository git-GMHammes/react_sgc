import React from 'react';

/**
 * Componente para visualizar dados JSON formatados usando Bootstrap 5
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object|Array} props.data - Dados a serem exibidos no formato JSON
 * @param {string} props.title - Título opcional para o visualizador
 * @param {boolean} props.collapsed - Define se o visualizador inicia colapsado
 * @param {string} props.className - Classes CSS adicionais
 * @returns {JSX.Element} Componente renderizado
 */
const JSONViewer = ({ 
  data, 
  title = 'JSON Viewer', 
  collapsed = false,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

  // Formata o JSON com indentação de 2 espaços
  const formattedJSON = React.useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return `Error formatting JSON: ${error.message}`;
    }
  }, [data]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`card mb-3 ${className}`}>
      <div 
        className="card-header d-flex justify-content-between align-items-center" 
        onClick={toggleCollapse}
        style={{ cursor: 'pointer' }}
      >
        <h6 className="mb-0">{title}</h6>
        <button className="btn btn-sm">
          <i className={`bi ${isCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'}`}></i>
        </button>
      </div>
      
      <div className={`collapse ${isCollapsed ? '' : 'show'}`}>
        <div className="card-body p-0">
        <pre className="m-0 p-3 bg-secundary bg-gradient text-light">{formattedJSON}</pre>
        </div>
      </div>
    </div>
  );
};

export default JSONViewer;