import React, { useEffect, useState } from "react";
import AppForm from './AppForm';
import TelefoneService from '../../services/telefone';

const AppCadastrar = () => {
    return (
        <>
            <h2 className="mb-4">Cadastrar</h2>
            <AppForm />
        </>
    );
}

export default AppCadastrar;