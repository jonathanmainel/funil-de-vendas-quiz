export function ProgressBar({ current, total }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Progresso do diagnóstico"
      aria-valuemin="0"
      aria-valuemax={total}
      aria-valuenow={current}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          className={index < current ? "progress__segment is-complete" : "progress__segment"}
          key={index}
        />
      ))}
    </div>
  );
}
