// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\components\Footer\index.jsx
import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";
import logoProderj from "../../assets/images/logoProderj.png";

const Footer = () => {
    const [isFixed, setIsFixed] = useState(true);

    useEffect(() => {
        const checkHeight = () => {
            // Obtém a altura do conteúdo
            const bodyHeight = document.body.scrollHeight;
            // Obtém a altura da janela do navegador
            const windowHeight = window.innerHeight;

            // Define o footer como fixo apenas se o conteúdo for menor que a altura da janela
            const shouldBeFixed = bodyHeight <= windowHeight;
            setIsFixed(shouldBeFixed);

            // Adiciona/remove classe auxiliar no elemento main
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                if (shouldBeFixed) {
                    mainContent.classList.add('has-fixed-footer');
                } else {
                    mainContent.classList.remove('has-fixed-footer');
                }
            }
        };

        // Verifica no carregamento inicial
        checkHeight();

        // Adiciona um listener para redimensionamento da janela
        window.addEventListener('resize', checkHeight);

        // Observa mudanças no DOM para recalcular quando o conteúdo mudar
        const observer = new MutationObserver(checkHeight);
        observer.observe(document.body, { childList: true, subtree: true });

        // Limpa event listeners e observer
        return () => {
            window.removeEventListener('resize', checkHeight);
            observer.disconnect();
        };
    }, []);

    return (
        <footer className={`footer ${isFixed ? 'fixed-bottom' : ''} bg-dark py-3`}>
            {/* NOVO FOOTER*/}
            <div className="row align-items-center">
                <div className="col-md-3 col-12 text-center text-md-start mb-2 mb-md-0">
                    <img src={logoProderj} alt="Logo Proderj" className="img-fluid" style={{ maxHeight: "40px" }}/>
                </div>
                <div className="col-md-3 col-12 text-center mb-2 mb-md-0 text-white">
                    <div className="badge text-wrap">
                        Av.Pres.Vargas, 817, andares 24º e 25º,
                        Centro, Rio de Janeiro
                        RJ, <br />
                        CEP 20550-900
                    </div>
                </div>
                <div className="col-md-3 col-12 text-center text-md-end">
                    <div className="badge text-wrap">
                        Unidade UERJ
                        Rua São Francisco Xavier, 524 - 2º
                        andar, sala 61 - Maracanã, Rio de
                        Janeiro
                        RJ, CEP 20550-900
                    </div>
                </div>
                <div className="col-md-3 col-12 text-center mb-2 mb-md-0 text-white">
                    <div className=" d-flex justify-content-evenly w-100">
                        <a href="#"><i className="bi bi-twitter-x"></i></a>
                        <a href="#"><i className="bi bi-facebook"></i></a>
                        <a href="#"><i className="bi bi-instagram"></i></a>
                        <a href="#"><i className="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </div>
            {/* NOVO FOOTER*/}

        </footer>
    );
};

export default Footer;