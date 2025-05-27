// App.jsx - Exemplo de como usar o componente ToastsReact
import React, { useState } from 'react';
import { Button, Container, Row, Col, Spinner, Badge, Card, Alert } from 'react-bootstrap';
import ToastsReact from '../../components/Message/Toasts';
// Todas as cores disponíveis do Bootstrap
const bootstrapColors = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark"
];
function PaginaToastsReact() {
    // Exemplo de array de toasts
    const exampleToasts = [
        {
            title: "Toast Simples",
            body: "Este é um toast básico",
            strong: "Notificação",
            time: "agora mesmo",
            image: "https://via.placeholder.com/30",
            delay: 5000,
            variant: "primary",
            opacity: "25" // Usando opacidade
        },
        {
            title: "Toast Importante",
            body: "Este toast tem informações importantes!",
            strong: "Alerta",
            time: "2 segundos atrás",
            image: "https://via.placeholder.com/30",
            delay: 8000,
            variant: "secondary",
            opacity: "50" // Usando opacidade
        }
    ];

    // Exemplo de um único toast
    const singleToast = [
        {
            title: "Mensagem",
            body: "Sua ação foi concluída com sucesso!",
            strong: "Sucesso",
            time: "agora",
            delay: 3000,
            variant: "success",
            opacity: "25" // Usando opacidade
        }
    ];

    // Toasts com children personalizados
    const customToasts = [
        {
            title: "Toast com Spinner",
            strong: "Processando",
            time: "agora",
            variant: "info",
            opacity: "25",
            children: (
                <div className="d-flex align-items-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Carregando dados...</span>
                </div>
            )
        }
    ];

    return (
        <div className="p-2">
            <h1>Demonstração do Componente ToastsReact</h1>
            <hr />
            <h3 className="mt-4">Exemplo com Botão</h3>
            <div className="row justify-content-center">
                <div className="col-lg-12 col-md-12">
                    <ToastsReact
                        buttonText="Mostrar Múltiplos Toasts"
                        position="top-end"
                        toasts={exampleToasts}
                    />
                </div>
            </div>
            <h3 className="mt-4">Diferentes Posições</h3>
            <h4 className="mt-3">Topo</h4>
            <div className="row justify-content-center">
                <div className="col-lg-4 col-md-12">
                    <ToastsReact
                        buttonText="Top-Start"
                        position="top-start"
                        toasts={[{
                            title: "Top-Start",
                            body: "Posicionado no topo à esquerda",
                            strong: "Posição",
                            time: "agora",
                            variant: "primary",
                            opacity: "25"
                        }]}
                    />
                </div>
                <div className="col-lg-4 col-md-12">
                    <ToastsReact
                        buttonText="Top-Center"
                        position="top-center"
                        toasts={[{
                            title: "Top-Center",
                            body: "Posicionado no topo ao centro",
                            strong: "Posição",
                            time: "agora",
                            variant: "info",
                            opacity: "25"
                        }]}
                    />
                </div>
                <div className="col-lg-4 col-md-12">
                    <ToastsReact
                        buttonText="Top-End"
                        position="top-end"
                        toasts={[{
                            title: "Top-End",
                            body: "Posicionado no topo à direita",
                            strong: "Posição",
                            time: "agora",
                            variant: "success",
                            opacity: "25"
                        }]}
                    />
                </div>
            </div>
            <h4 className="mt-3">Meio</h4>
            <div className="row justify-content-center">
                <div className="col-lg-4 col-md-12">
                    <ToastsReact
                        buttonText="Middle-Start"
                        position="middle-start"
                        toasts={[{
                            title: "Middle-Start",
                            body: "Posicionado no meio à esquerda",
                            strong: "Posição",
                            time: "agora",
                            variant: "warning",
                            opacity: "25"
                        }]}
                    />

                </div>
                <div className="col-lg-4 col-md-12">

                    <ToastsReact
                        buttonText="Middle-Center"
                        position="middle-center"
                        toasts={[{
                            title: "Middle-Center",
                            strong: "Posição",
                            time: "agora",
                            variant: "danger",
                            opacity: "25",
                            children: (
                                <div>
                                    <p>Posicionado no centro da tela</p>
                                    <Badge bg="danger">Com Badge!</Badge>
                                </div>
                            )
                        }]}
                    />

                </div>
                <div className="col-lg-4 col-md-12">

                    <ToastsReact
                        buttonText="Middle-End"
                        position="middle-end"
                        toasts={[{
                            title: "Middle-End",
                            body: "Posicionado no meio à direita",
                            strong: "Posição",
                            time: "agora",
                            variant: "secondary",
                            opacity: "25"
                        }]}
                    />
                </div>
            </div>
            <h4 className="mt-3">Base</h4>
            <div className="row justify-content-center">
                <div className="col-lg-4 col-md-12">
                    <ToastsReact
                        buttonText="Bottom-Start"
                        position="bottom-start"
                        toasts={[{
                            title: "Bottom-Start",
                            strong: "Posição",
                            time: "agora",
                            variant: "dark",
                            opacity: "25",
                            children: (
                                <Card className="border-0 bg-transparent text-white">
                                    <Card.Body className="p-0">
                                        <Card.Text>
                                            Posicionado na base à esquerda com card
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            )
                        }]}
                    />
                </div>
                <div className="col-lg-4 col-md-12">
                    <ToastsReact
                        buttonText="Bottom-Center"
                        position="bottom-center"
                        toasts={[{
                            title: "Bottom-Center",
                            body: "Posicionado na base ao centro",
                            strong: "Posição",
                            time: "agora",
                            variant: "light",
                            opacity: "25"
                        }]}
                    />
                </div>
                <div className="col-lg-4 col-md-12">
                    <ToastsReact
                        buttonText="Bottom-End"
                        position="bottom-end"
                        toasts={[{
                            title: "Bottom-End",
                            body: "Posicionado na base à direita",
                            strong: "Posição",
                            time: "agora",
                            variant: "primary",
                            opacity: "25"
                        }]}
                    />
                </div>
            </div>

            <h3 className="mt-4">Exemplo sem Botão (Automático)</h3>
            <div className="row justify-content-center">
                <div className="col-lg-12 col-md-12">
                    <div id="auto-toast">
                        Aparece sozinho ao lado
                        <ToastsReact
                            showWithoutButton={true}
                            position="bottom-end"
                            toasts={singleToast}
                        />
                    </div>
                </div>
            </div>

            <h3 className="mt-4">Exemplo com Children</h3>
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-12">
                    <ToastsReact
                        buttonText="Toast com Spinner"
                        position="top-end"
                        toasts={customToasts}
                    />
                </div>
                <div className="col-lg-6 col-md-12">
                    
                    <ToastsReact
                        buttonText="Toast com Alerta"
                        position="middle-end"
                        toasts={[{
                            title: "Alerta Importante",
                            strong: "Atenção",
                            time: "agora",
                            variant: "danger",
                            opacity: "25",
                            children: (
                                <Alert variant="danger" className="mb-0 mt-2 p-2 bg-transparent border-0">
                                    <Alert.Heading className="h6">Erro crítico!</Alert.Heading>
                                    <p className="mb-0">
                                        Este é um alerta dentro de um toast.
                                    </p>
                                </Alert>
                            )
                        }]}
                    />
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-12 col-md-12">
                    <h3 className="mt-4">Exemplo com Múltiplos Toasts de Cores Diferentes</h3>
                    <ToastsReact
                        buttonText="Mostrar Todos os Toasts"
                        position="bottom-end"
                        opacity="25"
                        toasts={bootstrapColors.map(color => ({
                            title: `Toast ${color}`,
                            body: `Mensagem com tema ${color}`,
                            strong: color,
                            time: "agora",
                            variant: color,
                            delay: 2500
                        }))}
                    />
                </div>
            </div>

        </div>
    );
}

export default PaginaToastsReact;