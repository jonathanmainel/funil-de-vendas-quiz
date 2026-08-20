/**
 * Entrega os arquivos estáticos da landing page na hospedagem.
 * Não processa nem encaminha dados de cadastro.
 */
export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
