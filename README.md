# Landing page do Diagnóstico InCompany

Aplicação em React e Vite para a campanha da unidade Funil de Vendas de Ribeirão Preto.

## Como executar

1. Instale as dependências com `npm install`.
2. Inicie a versão local com `npm run dev`.
3. Abra `http://127.0.0.1:4173`.

Sem um webhook configurado, a versão local registra os envios de demonstração no armazenamento do navegador. A versão de produção não confirma o cadastro sem o webhook do Make.

## Configuração para publicação

Copie `.env.example` para `.env` e preencha:

* `VITE_MAKE_WEBHOOK_URL`: endereço do módulo Webhooks > Custom webhook do Make.
* `VITE_META_PIXEL_ID`: identificador público do Pixel da Meta.
* `VITE_PRIVACY_URL`: endereço da política de privacidade aprovada.

Depois execute `npm run build`. A pasta `dist` será criada para publicação.

## Configuração do Make

1. Crie um cenário com o módulo Webhooks > Custom webhook.
2. Copie a URL gerada para `VITE_MAKE_WEBHOOK_URL`.
3. Coloque o cenário em modo de captura e envie um cadastro pela landing page.
4. Use os campos recebidos para criar a oportunidade no Funil de Vendas CRM.
5. Use `submission_id` para identificar um mesmo envio caso ocorra uma nova tentativa.

O formulário envia os dados como campos de formulário comuns. Isso facilita o mapeamento no Make e evita colocar credenciais do CRM dentro do navegador.

## Campos enviados ao Make

O webhook recebe:

* `name`, `phone`, `email`, `job_title` e `company`.
* `consent_accepted` e `consent_text_version`.
* As nove respostas, da função do contato ao momento de compra.
* As cinco pontuações internas.
* `dominant_bottleneck`, `dominant_bottleneck_label`, `priority` e `fit`.
* UTMs, `fbclid`, campanha, conjunto e anúncio quando disponíveis.
* `source`, `unit`, `offer` e `initial_stage`.
* `submission_id`, que permite identificar novas tentativas do mesmo envio.

Se o webhook estiver temporariamente indisponível, o navegador guarda o envio e tenta novamente quando a conexão volta.

## Comandos de validação

* `npm test`: testa a classificação comercial.
* `npm run build`: valida e gera a versão de produção.
