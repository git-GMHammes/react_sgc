// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\components\Auth\useSession.js
import { useState, useEffect } from 'react';

export function useSessionData() {
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Método 1: Tentar ler o cookie (se disponível)
        const getCookieData = () => {
            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('gov_br_data='));

            if (cookieValue) {
                try {
                    const cookieData = JSON.parse(decodeURIComponent(cookieValue.split('=')[1]));
                    setSessionData(cookieData);
                    setLoading(false);
                    return true;
                } catch (e) {
                    console.error("Erro ao parsear cookie:", e);
                }
            }
            return false;
        };

        // Método 2: Se não conseguir ler o cookie, buscar da API
        const fetchSessionData = async () => {
            try {
                // Verificar se conseguimos dados do cookie primeiro
                if (getCookieData()) return;

                // Se não, buscar da API
                setLoading(true);
                const response = await fetch('http://127.0.0.1:59000/src/public/index.php/sgcpro/usuario/api/session', {
                    method: 'GET',
                    credentials: 'include', // Importante para enviar cookies
                });

                if (!response.ok) {
                    throw new Error(`Status: ${response.status}`);
                }

                const data = await response.json();
                setSessionData(data.result.gov_br);
            } catch (err) {
                setError(err.message);
                console.error("Erro ao buscar dados da sessão:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, []);

    return { sessionData, loading, error };
}