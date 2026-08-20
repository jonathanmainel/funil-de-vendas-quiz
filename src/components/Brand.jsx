export function Brand() {
  return (
    <div className="brand" aria-label="Funil de Vendas">
      <img
        src={`${import.meta.env.BASE_URL}funil-de-vendas-logo.png`}
        alt="Funil de Vendas"
        width="477"
        height="75"
      />
    </div>
  );
}
