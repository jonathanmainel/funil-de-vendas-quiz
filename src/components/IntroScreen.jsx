import { ClockIcon } from "./Icons";
import { ProgressBar } from "./ProgressBar";

export function IntroScreen({ onStart }) {
  return (
    <section className="screen screen--intro" aria-labelledby="intro-title">
      <ProgressBar current={1} total={9} />
      <div className="intro-content">
        <h1 id="intro-title">Onde sua operação comercial está perdendo força?</h1>
        <p className="lead">
          Responda a algumas perguntas para que nossa equipe analise sua operação e
          prepare uma reunião diagnóstica sem custo.
        </p>
        <p className="service-mode">Atendimento online ou presencial.</p>
        <button className="primary-button" type="button" onClick={onStart}>
          Iniciar diagnóstico
        </button>
        <p className="time-note">
          <ClockIcon />
          Leva de 2 a 3 minutos
        </p>
      </div>
    </section>
  );
}
