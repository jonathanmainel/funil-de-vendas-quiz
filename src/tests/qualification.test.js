import { describe, expect, it } from "vitest";
import { calculateQualification } from "../utils/qualification";

const healthyAnswers = {
  jobTitle: "Dono ou sócio",
  team_size: "three_five",
  process: "documented",
  goals: "action_plan",
  followup: "routine",
  insight_timing: "during_month",
  bottleneck: "process_indicators",
  timeline: "now",
};

describe("calculateQualification", () => {
  it("classifica decisor com equipe adequada e urgência como prioridade alta", () => {
    expect(calculateQualification(healthyAnswers).priority).toBe("high");
  });

  it("reconhece cargo de liderança informado em texto livre", () => {
    const result = calculateQualification({
      ...healthyAnswers,
      jobTitle: "Diretora Comercial",
    });
    expect(result.priority).toBe("high");
  });

  it("mantém cargo sem poder de decisão como prioridade baixa", () => {
    const result = calculateQualification({
      ...healthyAnswers,
      jobTitle: "Assistente comercial",
    });
    expect(result.priority).toBe("low");
  });

  it("classifica horizonte de 90 dias como prioridade média", () => {
    const result = calculateQualification({ ...healthyAnswers, timeline: "ninety_days" });
    expect(result.priority).toBe("medium");
  });

  it("mantém equipe pequena como prioridade baixa", () => {
    const result = calculateQualification({ ...healthyAnswers, team_size: "one_two" });
    expect(result.priority).toBe("low");
    expect(result.fit).toBe(false);
  });

  it("usa o gargalo declarado para desempatar dimensões", () => {
    const result = calculateQualification(healthyAnswers);
    expect(result.dominantBottleneck).toBe("planning");
  });

  it("identifica execução e acompanhamento como maior fragilidade isolada", () => {
    const result = calculateQualification({
      ...healthyAnswers,
      followup: "unreliable",
      bottleneck: "prospecting",
    });
    expect(result.dominantBottleneck).toBe("execution");
  });
});
