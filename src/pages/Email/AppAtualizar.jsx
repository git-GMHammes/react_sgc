import React, { useEffect, useState } from "react";
import AppForm from './AppForm';
// import EmailService from '../../services/email';

const AppAtualizar = ({
    token_csrf = {},
    getID = null
}) => {
    const letID = getID || 'PASS NULL';
    // console.log('getID', getID); 
    return (
        <>
            <h2 className="mb-4">Atualizar</h2>
            <AppForm 
                token_csrf={token_csrf}
                getID={getID}
            />
        </>
    );
}

export default AppAtualizar;