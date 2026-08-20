import { useEffect, useRef } from "react";
import { CloseIcon } from "./Icons";

export function PrivacyDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  const privacyUrl = import.meta.env.VITE_PRIVACY_URL?.trim();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog className="privacy-dialog" ref={dialogRef} onClose={onClose}>
      <button className="dialog-close" type="button" aria-label="Fechar" onClick={onClose}>
        <CloseIcon />
      </button>
      <h2>Como tratamos seus dados</h2>
      <p>
        As informações deste formulário serão usadas para analisar o cenário comercial da
        empresa e permitir que a equipe da unidade de Ribeirão Preto entre em contato.
      </p>
      <p>
        As respostas do quiz, os dados informados e a origem da campanha serão registrados
        para preparar a conversa e acompanhar o atendimento.
      </p>
      {privacyUrl ? (
        <a href={privacyUrl} target="_blank" rel="noreferrer">
          Consultar política de privacidade completa
        </a>
      ) : (
        <p className="privacy-dialog__notice">
          A política de privacidade completa deve ser vinculada antes da publicação.
        </p>
      )}
    </dialog>
  );
}
