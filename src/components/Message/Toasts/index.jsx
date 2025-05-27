// src\public\script\react_modelo_v1\frontend\src\components\Message\Toasts\index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, Toast, ToastContainer } from 'react-bootstrap';

// Componente principal para gerenciar múltiplos toasts
const ToastsReact = ({
    position = "top-end",
    buttonText,
    showWithoutButton = false,
    toasts = [],
    variant = "dark", // Adiciona prop de cor com "dark" como padrão
    children,
    opacity = "25"
}) => {
    const [visibleToasts, setVisibleToasts] = useState([]);

    // Mostrar todos os toasts quando o botão for clicado
    const handleShowToasts = () => {
        const updatedToasts = toasts.map(toast => ({
            ...toast,
            visible: true,
            variant: toast.variant || variant, // Usa a variante do toast ou a padrão
            opacity: toast.opacity || opacity, // Adiciona opacidade aos toasts
            id: Date.now() + Math.random().toString(),
            children: toast.children // Suporte para children individuais por toast
        }));
        setVisibleToasts(updatedToasts);
    };

    // Mostrar toasts automaticamente quando showWithoutButton for true
    useEffect(() => {
        if (showWithoutButton && toasts.length > 0) {
            handleShowToasts();
        }
    }, [showWithoutButton, toasts]);

    // Manipular o fechamento de um toast específico
    const handleClose = (id) => {
        setVisibleToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Determinar a posição do container
    const getPositionClasses = () => {
        switch (position) {
            case "top-start":
                return "top-0 start-0";
            case "top-center":
                return "top-0 start-50 translate-middle-x";
            case "top-end":
                return "top-0 end-0";
            case "middle-start":
                return "top-50 start-0 translate-middle-y";
            case "middle-center":
                return "top-50 start-50 translate-middle";
            case "middle-end":
                return "top-50 end-0 translate-middle-y";
            case "bottom-start":
                return "bottom-0 start-0";
            case "bottom-center":
                return "bottom-0 start-50 translate-middle-x";
            case "bottom-end":
                return "bottom-0 end-0";
            default:
                return "top-0 end-0";
        }
    };

    // Se apenas um toast e com children direto no componente
    useEffect(() => {
        if (showWithoutButton && children && toasts.length === 0) {
            // Criar um toast único com os children passados diretamente
            const singleToast = [{
                id: Date.now() + Math.random().toString(),
                variant: variant,
                opacity: opacity,
                visible: true,
                children: children
            }];
            setVisibleToasts(singleToast);
        }
    }, [showWithoutButton, children, variant, opacity]);

    return (
        <>
            {/* Renderizar o botão apenas se buttonText estiver definido */}
            {buttonText && (
                <Button variant="primary" onClick={handleShowToasts}>
                    {buttonText}
                </Button>
            )}

            {/* Container para os toasts */}
            <div aria-live="polite" aria-atomic="true" className="position-relative">
                <ToastContainer className={`p-3 ${getPositionClasses()}`}>
                    {visibleToasts.map((toast) => (
                        <ToastItem
                            key={toast.id}
                            id={toast.id}
                            title={toast.title}
                            body={toast.body}
                            image={toast.image}
                            tStrong={toast.tStrong}
                            time={toast.time}
                            variant={toast.variant}
                            opacity={toast.opacity || opacity}
                            onClose={() => handleClose(toast.id)}
                            delay={toast.delay || 3000}
                            autohide={toast.autohide !== false}
                        >
                            {toast.children}
                        </ToastItem>
                    ))}
                </ToastContainer>
            </div>
        </>
    );
};

// Componente individual para cada toast
const ToastItem = ({
    id,
    title,
    body,
    image,
    tStrong,
    time,
    variant = "dark", // Adiciona prop de cor com padrão "dark"
    opacity = "90", // Adiciona opacidade com padrão 90%
    onClose,
    delay,
    autohide,
    children
}) => {
    const [show, setShow] = useState(true);

    const handleOnClose = () => {
        setShow(false);
        setTimeout(() => {
            onClose();
        }, 150); // Pequeno atraso para a animação
    };

    // Lista de variantes válidas do Bootstrap
    const validVariants = ["primary", "secondary", "success", "info", "warning", "danger", "light", "dark"];

    // Verifica se a variante é válida, senão usa "dark"
    const toastVariant = validVariants.includes(variant) ? variant : "dark";
    
    // Formata o valor da opacidade (garantindo que seja entre 10-100)
    const opacityValue = Math.min(Math.max(parseInt(opacity) || 90, 10), 100);
    
    // Classes de opacidade do Bootstrap
    const opacityClass = `bg-opacity-${opacityValue}`;

    return (
        <Toast
            show={show}
            onClose={handleOnClose}
            delay={delay}
            autohide={autohide}
            bg={toastVariant}
            className={`${opacityClass} border border-${toastVariant} ${toastVariant === "light" ? "text-dark" : "text-white"}`}
        >
            <Toast.Header className={`bg-opacity-75 ${toastVariant === "light" ? "" : `bg-${toastVariant} text-white`}`}>
                {image && <img src={image} className="rounded me-2" alt="" />}
                <strong className="me-auto">{tStrong || title}</strong>
                {time && <small className={toastVariant === "light" ? "text-body-secondary" : "text-white-50"}>{time}</small>}
            </Toast.Header>
            <Toast.Body>
                {children ? children : body}
            </Toast.Body>
        </Toast>
    );
};

export default ToastsReact;