// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\config\env.js
const isNode = typeof window === 'undefined';

// Definir as variáveis de localização
let PROTOCOL, HOSTNAME, PORT, PATHNAME;

if (!isNode) {
  // Código para navegador
  PROTOCOL = window.location.protocol.replace(':', '');
  HOSTNAME = window.location.hostname;
  PORT = window.location.port;
  PATHNAME = window.location.pathname;

} else {
  // Valores padrão para ambiente Node.js
  PROTOCOL = 'http';
  HOSTNAME = 'localhost';
  PORT = '3000';
  PATHNAME = '/';

}

// console.log('PROTOCOL :: ', PROTOCOL);
// console.log('HOSTNAME :: ', HOSTNAME);
// console.log('PORT :: ', PORT);
// console.log('PATHNAME :: ', PATHNAME);
// console.log('---');

/*
  possíveis ambientes dev para react:
  [DEV1/Docker] npm run dev -- --host 127.0.0.1 --port 7777
  [DEV2/Laragon] npm run dev -- --host localhost --port 9999
*/

const determineEnvironment = () => {
  // Verificar ambientes de desenvolvimento
  if (HOSTNAME === '127.0.0.1' && PORT === '7777') {
    return 'DEV1';
  } else if (HOSTNAME === 'localhost' && PORT === '9999') {
    return 'DEV2';
  } else if (HOSTNAME === '127.0.0.1' && PORT === '59000') {
    return 'DEV1_BUILD';
  } else if (HOSTNAME === '127.0.0.1' && PORT === '80') {
    return 'DEV2_BUILD';
  }

  // Verificar ambientes de produção/homologação baseado no hostname
  if (HOSTNAME === 'www.hml.proderj.rj.gov.br') {
    return 'HML';
  } else if (HOSTNAME === 'www.proderj.rj.gov.br') {
    return 'PRD';
  } else if (HOSTNAME === 'teste.proderj.rj.gov.br') {
    return 'TESTE';
  } else if (HOSTNAME === 'aprovacao.proderj.rj.gov.br') {
    return 'APROVACAO';
  } else if (HOSTNAME === 'seguranca.proderj.rj.gov.br') {
    return 'SEGURANCA';
  }

  // Ambiente padrão caso nenhum outro seja detectado
  return 'DEV2';
};

// Definição das constantes de ambiente
const ENV = {
  // Ambiente atual
  CURRENT: determineEnvironment(),
  // Definição das APIs por ambiente
  API: {
    // Para desenvolvimento com proxy Vite
    DEV1: '/api/index.php/',
    DEV2: '/api/index.php/',
    DEV1_BUILD: 'http://127.0.0.1:59001/src/public/index.php/',
    DEV2_BUILD: 'http://127.0.0.1:80/sgcpro/src/public/index.php/',
    HML: 'https://www.hml.proderj.rj.gov.br/',
    PRD: 'https://www.prd.rj.gov.br/',
    TESTE: 'https://teste.proderj.proderj.rj.gov.br/',
    APROVACAO: 'https://aprovacao.proderj.proderj.rj.gov.br/',
    SEGURANCA: 'https://seguranca.proderj.proderj.rj.gov.br/'
  },

  // Definição das URLs por ambiente
  URL: {
    // Para desenvolvimento com proxy Vite
    DEV1: 'http://127.0.0.1:59001/',
    DEV2: 'http://localhost/sgcpro/',
    DEV1_BUILD: 'http://127.0.0.1:59001/src/public/index.php/',
    DEV2_BUILD: 'http://127.0.0.1:80/sgcpro/src/public/index.php/',
    HML: 'https://www.hml.proderj.rj.gov.br/',
    PRD: 'https://www.prd.rj.gov.br/',
    TESTE: 'https://teste.proderj.proderj.rj.gov.br/',
    APROVACAO: 'https://aprovacao.proderj.proderj.rj.gov.br/',
    SEGURANCA: 'https://seguranca.proderj.proderj.rj.gov.br/'
  },

  // Outras constantes globais
  API_TIMEOUT: 30000,
  MAX_UPLOAD_SIZE: 5242880, // 5MB
  APP_VERSION: '1.0.0'
};

// console.log('ENV.CURRENT:', ENV.CURRENT);
// console.log('ENV.API:', ENV.API[ENV.CURRENT]);
// console.log('ENV.URL:', ENV.URL[ENV.CURRENT]);

// Função auxiliar para obter a URL base atual
export const getBaseApi = () => ENV.API[ENV.CURRENT];
export const getBaseUrl = () => ENV.URL[ENV.CURRENT];

// Exporta o objeto de configuração completo
export default ENV;