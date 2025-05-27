// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\src\pages\Teste\PaginaModal.jsx
import React from 'react';
import './PaginaModal.css';
import BasicModal from '../../components/Modal/BasicModal';
import FadeModal from '../../components/Modal/FadeModal';
import ElasticModal from '../../components/Modal/ElasticModal';
import BlurInModal from '../../components/Modal/BlurInModal';
import SlideLeftRightbasicModal from '../../components/Modal/SlideLeftRightbasicModal';
import PulsateModal from '../../components/Modal/PulsateModal';
import ShakeModal from '../../components/Modal/ShakeModal';
import RotateModal from '../../components/Modal/RotateModal';
import SwingModal from '../../components/Modal/SwingModal';
import FlipModal from '../../components/Modal/FlipModal';
import SlideUpDownModal from '../../components/Modal/SlideUpDownModal';

const PaginaModal = () => {
  return (
    <div className="container mt-4">
      <h2 className='m-3'>Exemplo de Múltiplos Modais</h2>
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-4">

            {/* Abrir Modal Basic */}
            <BasicModal
              idModal="modalBasic1"
              buttonName="Básico"
              strTitleModal="Modal Basic"
            >
              <p>Conteúdo do Modal Basic</p>
            </BasicModal>

          </div>
          <div className="col-4">

            {/* Modal ou Mensagem Automatica */}
            <BasicModal
              idModal="modalBasic2"
              buttonName="Modal Automatica"
              strTitleModal="Modal ou Mensagem Automatica"
              isOpenInitial={true}
            >
              <p>Conteudo de Modal ou Mensagem Automatica</p>
            </BasicModal>

          </div>
          <div className="col-4">

            {/* Modal Fade */}
            <FadeModal
              idModal="modalFade"
              buttonName="Modal Fade"
              strTitleModal="Modal Fade"
            >
              <p>Conteúdo do Modal Fade</p>
            </FadeModal>

          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-4">

            {/* Modal Elastic */}
            <ElasticModal
              idModal="modalElastic"
              buttonName="Modal Elastic"
              strTitleModal="Modal Elastic"
            >
              <p>Conteúdo do Modal Elastic</p>
            </ElasticModal>

          </div>
          <div className="col-4">

            {/* Modal Blur In */}
            <BlurInModal
              idModal="modalBluerIn"
              buttonName="Modal Bluer In"
              strTitleModal="Modal Bluer In"
            >
              <p>Conteúdo do Modal Bluer In</p>
            </BlurInModal>

          </div>
          <div className="col-4">

            {/* Modal Slide Left Right basic */}
            <SlideLeftRightbasicModal
              idModal="modalSlideLeftRightbasic"
              buttonName="Modal Slide Left Right basic"
              strTitleModal="Modal Slide Left Right basic"
            >
              <p>Conteúdo com Modal Slide Left Right basic</p>
            </SlideLeftRightbasicModal>

          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-4">

            {/* Modal Pulse */}
            <PulsateModal
              idModal="modalPulsate"
              buttonName="Modal Pulsate"
              strTitleModal="Modal Pulsate"
            >
              <p>Conteúdo do Modal Pulsate</p>
            </PulsateModal>

          </div>
          <div className="col-4">

            {/* Modal Shake */}
            <ShakeModal
              idModal="modalShake"
              buttonName="Modal Shake"
              strTitleModal="Modal Shake"
            >
              <p>Conteúdo do Modal Shake</p>
            </ShakeModal>

          </div>
          <div className="col-4">

            {/* Modal Rotate */}
            <RotateModal
              idModal="modalRotate"
              buttonName="Modal Rotate"
              strTitleModal="Modal Rotate"
            >
              <p>Conteúdo do Modal Rotate</p>
            </RotateModal>

          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-4">

            {/* Modal Swing */}
            <SwingModal
              idModal="modalSwing"
              buttonName="Modal Swing"
              strTitleModal="Modal Swing"
            >
              <p>Conteúdo do Modal Swing</p>
            </SwingModal>

          </div>
          <div className="col-4">

            {/* Flip horizontal (padrão) */}
            <FlipModal
              idModal="flipH"
              buttonName="Modal Flip Horizontal"
              strTitleModal="Modal Flip Horizontal"
            >
              Conteúdo do modal Flip Horizontal
            </FlipModal>

          </div>
          <div className="col-4">

            {/* Flip vertical */}
            <FlipModal
              idModal="flipV"
              buttonName="Modal Flip Vertical"
              strTitleModal="Modal Flip Vertical"
              flipAxis="vertical"
            >
              Conteúdo do modal Flip Vertical
            </FlipModal>

          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-4">

            {/* Para modal que desliza de cima para baixo (padrão) */}
            <SlideUpDownModal
              idModal="slideDown"
              buttonName="Modal Slide Down"
              strTitleModal="Modal Slide Down"
            >
              Conteúdo do modal que desliza de cima para baixo
            </SlideUpDownModal>

          </div>
          <div className="col-4">
            {/* Para modal que desliza de baixo para cima */}
            <SlideUpDownModal
              idModal="slideUp"
              buttonName="Modal Slide Up"
              strTitleModal="Modal Slide Up"
              direction="up"
            >
              Conteúdo do modal que desliza de baixo para cima
            </SlideUpDownModal>
          </div>
          <div className="col-4">
          </div>
        </div>
      </div>











    </div>
  );
};

export default PaginaModal;