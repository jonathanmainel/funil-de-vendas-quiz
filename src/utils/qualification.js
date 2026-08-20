import { dimensionLabels, questions } from "../data/questions";

const declaredDimension = {
  prospecting: "method",
  followup: "execution",
  conversion: "method",
  team: "management",
  process_indicators: "planning",
};

const initialScores = {
  method: 0,
  planning: 0,
  execution: 0,
  management: 0,
};

export function calculateQualification(answers) {
  const scores = { ...initialScores };

  for (const question of questions) {
    if (!question.dimension) continue;
    const selected = question.answers.find(
      (answer) => answer.value === answers[question.id],
    );
    scores[question.dimension] += selected?.score ?? 0;
  }

  const maxScore = Math.max(...Object.values(scores));
  const topDimensions = Object.keys(scores).filter(
    (dimension) => scores[dimension] === maxScore,
  );
  const declared = declaredDimension[answers.bottleneck];
  const dominant = topDimensions.includes(declared) ? declared : topDimensions[0];

  const decisionMaker = ["Dono ou sócio", "Gestor comercial"].includes(
    answers.jobTitle,
  );
  const adequateTeam = answers.team_size !== "one_two";
  const immediate = ["now", "thirty_days"].includes(answers.timeline);
  const mediumTerm = answers.timeline === "ninety_days";

  let priority = "low";
  if (decisionMaker && adequateTeam && immediate) {
    priority = "high";
  } else if (decisionMaker && adequateTeam && mediumTerm) {
    priority = "medium";
  }

  return {
    scores,
    dominantBottleneck: dominant,
    dominantBottleneckLabel: dimensionLabels[dominant],
    priority,
    fit: decisionMaker && adequateTeam,
  };
}
