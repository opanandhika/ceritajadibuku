import type { Operation, Scenario } from "../domain/model";
import type { ProviderResult } from "../domain/session";
import { questionsFor, words } from "../domain/product";

export interface WritingProvider {
  run(operation: Operation, scenario: Scenario, askedTargets: string[]): Promise<ProviderResult>;
}
export function simulatedResult(operation: Operation, scenario: Scenario, askedTargets: string[]): ProviderResult {
  if (scenario === "failure") throw new Error("Synthetic provider failure");
  if (operation.kind === "draft") {
    // Preserve submitted facts verbatim. This fixture demonstrates workflow, not AI prose quality.
    return { action: "written", text: operation.payload.join("\n\n").split(/\s+/u).length <= 800
      ? operation.payload.join("\n\n") : operation.payload.join("\n\n").split(/\s+/u).slice(0, 800).join(" ") };
  }
  if (scenario === "enough" || ((scenario === "normal" || scenario === "late") && words(operation.payload.join(" ")) >= 28)) return { action: "draft" };
  if (scenario === "stacked") return { action: "ask", text: "Apa yang terjadi dan siapa yang menemanimu?", targets: ["moment", "companion"] };
  const questions = questionsFor(operation.payload.join(" "));
  const question = questions.find((item) => !askedTargets.includes(item.target)) ?? questions[3];
  return { action: "ask", text: question.text, targets: [question.target] };
}
export const mockProvider: WritingProvider = {
  async run(operation, scenario, askedTargets) {
    await new Promise((resolve) => setTimeout(resolve, scenario === "late" ? 5000 : 650));
    return simulatedResult(operation, scenario, askedTargets);
  },
};
