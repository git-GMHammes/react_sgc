import React from 'react';
import { useEffect, useState } from "react";
import ModalTeste from "../../components/Modal/BasicModal";
import Loading from '../../components/Loading';
import ListActions from '../../components/Button/ListActions';
import AppForm from './AppForm';
import './styles.css';


const AppListarConteudo = ({
    lista,
    pagination,
    loading,
    debugMyPrint,
    fetchEmpresa,
    fetchPagination,
    formatDateToPTBR,
    width,
    token_csrf,
    children,
}) => {
    return (
        <>AppListarConteudo</>
    );
}

export default AppListarConteudo;