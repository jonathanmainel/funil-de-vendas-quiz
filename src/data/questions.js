export const questions = [
  {
    id: "bottleneck",
    question: "Qual é hoje o principal gargalo comercial?",
    answers: [
      { value: "prospecting", label: "Prospecção" },
      { value: "followup", label: "Acompanhamento" },
      { value: "conversion", label: "Conversão" },
      { value: "team", label: "Gestão da equipe" },
      { value: "process_indicators", label: "Processo e indicadores" },
    ],
  },
  {
    id: "team_size",
    question: "Quantas pessoas fazem parte da equipe comercial?",
    answers: [
      { value: "one_two", label: "Uma ou duas" },
      { value: "three_five", label: "Três a cinco" },
      { value: "six_ten", label: "Seis a dez" },
      { value: "more_ten", label: "Mais de dez" },
    ],
  },
  {
    id: "process",
    question: "Como funciona o processo comercial atualmente?",
    dimension: "method",
    answers: [
      { value: "documented", label: "É documentado e utilizado", score: 0 },
      { value: "partial", label: "Está parcialmente definido", score: 1 },
      { value: "individual", label: "Depende de cada vendedor", score: 2 },
      { value: "unclear", label: "Não existe um processo claro", score: 3 },
    ],
  },
  {
    id: "goals",
    question: "Como as metas são transformadas em ações?",
    dimension: "planning",
    answers: [
      { value: "action_plan", label: "Existe um plano com atividades", score: 0 },
      { value: "sometimes", label: "Isso acontece parcialmente", score: 1 },
      { value: "final_target", label: "Existe apenas a meta final", score: 2 },
      { value: "no_plan", label: "Não há planejamento claro", score: 3 },
    ],
  },
  {
    id: "followup",
    question: "Como oportunidades e próximas ações são acompanhadas?",
    dimension: "execution",
    answers: [
      { value: "routine", label: "Existe uma rotina definida", score: 0 },
      { value: "partial", label: "O acompanhamento é parcial", score: 1 },
      { value: "memory", label: "Depende de planilhas ou memória", score: 2 },
      { value: "unreliable", label: "Não existe um controle confiável", score: 3 },
    ],
  },
  {
    id: "insight_timing",
    question: "Quando os gestores percebem um problema nos resultados?",
    dimension: "management",
    answers: [
      { value: "during_month", label: "Durante o mês", score: 0 },
      { value: "meetings", label: "Em reuniões periódicas", score: 1 },
      { value: "near_close", label: "Perto do fechamento", score: 2 },
      { value: "after_result", label: "Somente depois do resultado", score: 3 },
    ],
  },
  {
    id: "timeline",
    question: "Quando a empresa pretende melhorar essa operação?",
    answers: [
      { value: "now", label: "Agora" },
      { value: "thirty_days", label: "Nos próximos 30 dias" },
      { value: "ninety_days", label: "Nos próximos 90 dias" },
      { value: "evaluating", label: "Ainda estamos avaliando" },
    ],
  },
];

export const dimensionLabels = {
  method: "Método comercial",
  planning: "Planejamento",
  execution: "Execução e acompanhamento",
  management: "Gestão por indicadores",
};
