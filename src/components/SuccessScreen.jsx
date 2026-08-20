import { CheckIcon } from "./Icons";
import { ProgressBar } from "./ProgressBar";

export function SuccessScreen({ queued }) {
  return (
    <section className="screen screen--success" aria-labelledby="success-title">
      <ProgressBar current={7} total={7} />
      <div className="success-icon">
        <CheckIcon />
      </div>
      <h1 id="success-title">Respostas recebidas.</h1>
      <p>
        {queued
          ? "Seus dados foram salvos e o envio será concluído assim que a conexão for restabelecida."
          : "Nossa equipe analisará o cenário e entrará em contato para combinar a reunião diagnóstica."}
      </p>
      <p className="service-mode">A reunião pode ser online ou presencial.</p>
    </section>
  );
}
