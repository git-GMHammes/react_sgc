// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Teste\PaginaProvisoria.jsx
import React, { useState } from 'react';
import BtnProvisorio from '../../components/Button/Teste/BtnProvisorio';

const PaginaProvisoria = () => {
    const [contador, setContador] = useState(0);

    const handleClick = () => {
        setContador(contador + 1);
    };

    return (
        <div className="container mx-auto p-4">
            
            <h1 className="text-2xl font-bold mb-4">Página Provisória</h1>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="mb-4">Esta é uma página provisória de demonstração.</p>

                <p className="mb-4">Contador: {contador}</p>

                <BtnProvisorio onClick={handleClick}>
                    Incrementar Contador
                </BtnProvisorio>
            </div>

        </div>
    );
};

export default PaginaProvisoria;