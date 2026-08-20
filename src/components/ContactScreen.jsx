import { useState } from "react";
import { ArrowLeftIcon } from "./Icons";
import { ProgressBar } from "./ProgressBar";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  jobTitle: "",
  company: "",
  consent: false,
};

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)} ${digits.slice(7)}`;
}

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Informe seu nome.";
  if (form.phone.replace(/\D/g, "").length < 10) errors.phone = "Informe um telefone válido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Informe um email válido.";
  if (form.jobTitle.trim().length < 2) errors.jobTitle = "Informe seu cargo.";
  if (form.company.trim().length < 2) errors.company = "Informe sua empresa.";
  if (!form.consent) errors.consent = "O aceite é necessário para receber o contato.";
  return errors;
}

export function ContactScreen({ onSubmit, onBack, isSubmitting, submitError, onPrivacy }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit(form);
  };

  return (
    <section className="screen screen--contact" aria-labelledby="contact-title">
      <ProgressBar current={8} total={8} />
      <div className="question-meta">Última etapa</div>
      <h1 id="contact-title" className="contact-title">
        Como nossa equipe pode falar com você?
      </h1>
      <p className="contact-copy">
        Preencha seus dados para solicitar a reunião diagnóstica sem custo.
      </p>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Nome"
          name="name"
          autoComplete="name"
          value={form.name}
          error={errors.name}
          onChange={(value) => update("name", value)}
        />
        <Field
          label="Telefone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone}
          error={errors.phone}
          onChange={(value) => update("phone", formatPhone(value))}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={form.email}
          error={errors.email}
          onChange={(value) => update("email", value)}
        />
        <SelectField
          label="Cargo"
          name="jobTitle"
          value={form.jobTitle}
          error={errors.jobTitle}
          onChange={(value) => update("jobTitle", value)}
        />
        <Field
          className="field--wide"
          label="Empresa"
          name="company"
          autoComplete="organization"
          value={form.company}
          error={errors.company}
          onChange={(value) => update("company", value)}
        />
        <label className={errors.consent ? "consent has-error" : "consent"}>
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) => update("consent", event.target.checked)}
          />
          <span>
            Concordo com o uso dos meus dados para análise das respostas e contato da equipe.
            {" "}
            <button type="button" className="inline-link" onClick={onPrivacy}>
              Saiba como tratamos seus dados.
            </button>
          </span>
        </label>
        {errors.consent ? <p className="field-error field-error--wide">{errors.consent}</p> : null}
        {submitError ? (
          <p className="submit-error" role="alert">
            {submitError}
          </p>
        ) : null}
        <button className="primary-button field--wide" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando respostas..." : "Solicitar diagnóstico sem custo"}
        </button>
      </form>
      <button className="back-button" type="button" onClick={onBack} disabled={isSubmitting}>
        <ArrowLeftIcon />
        Voltar
      </button>
    </section>
  );
}

function Field({ label, name, type = "text", value, error, onChange, className = "", ...props }) {
  const errorId = `${name}-error`;
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({ label, name, value, error, onChange }) {
  const errorId = `${name}-error`;
  return (
    <label className="field">
      <span>{label}</span>
      <select
        name={name}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="" disabled>
          Selecione uma opção
        </option>
        <option value="Dono ou sócio">Dono ou sócio</option>
        <option value="Gestor comercial">Gestor comercial</option>
        <option value="Outro cargo">Outro cargo</option>
      </select>
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
