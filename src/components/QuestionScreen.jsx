import { ArrowLeftIcon } from "./Icons";
import { ProgressBar } from "./ProgressBar";

export function QuestionScreen({
  question,
  questionIndex,
  total,
  selectedValue,
  onAnswer,
  onBack,
}) {
  return (
    <section className="screen screen--question" aria-labelledby="question-title">
      <ProgressBar current={questionIndex + 1} total={total} />
      <div className="question-meta">
        Pergunta {questionIndex + 1} de {total}
      </div>
      <h1 id="question-title" className="question-title">
        {question.question}
      </h1>
      <div className="answers" role="group" aria-labelledby="question-title">
        {question.answers.map((answer) => (
          <button
            className={
              selectedValue === answer.value ? "answer-button is-selected" : "answer-button"
            }
            type="button"
            aria-pressed={selectedValue === answer.value}
            onClick={() => onAnswer(answer.value)}
            key={answer.value}
          >
            <span>{answer.label}</span>
            <span className="answer-button__marker" aria-hidden="true" />
          </button>
        ))}
      </div>
      <button className="back-button" type="button" onClick={onBack}>
        <ArrowLeftIcon />
        Voltar
      </button>
    </section>
  );
}
