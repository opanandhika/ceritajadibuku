import { describe, expect, it } from "vitest";
import { validateEnvironment } from "./environment";

describe("batas demo server", () => {
  it("build produksi Next tetap boleh untuk uji lokal; APP_ENV menentukan lingkungan aplikasi", () => {
    expect(validateEnvironment({ NODE_ENV: "production", APP_ENV: "development" }).demo).toBe(true);
  });
  it.each(["production", "staging", "anything"])("menolak APP_ENV=%s", (stage) => {
    expect(() => validateEnvironment({ APP_ENV: stage })).toThrow();
  });
  it("tidak berpura-pura mendukung provider nyata atau tester grant", () => {
    expect(() => validateEnvironment({ AI_PROVIDER: "openai" })).toThrow();
    expect(() => validateEnvironment({ ENABLE_TESTER_GRANTS: "true" })).toThrow();
  });
});
