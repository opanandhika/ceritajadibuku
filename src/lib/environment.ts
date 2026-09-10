/** This release contains only a local demo. Never expose it as a production service. */
export function validateEnvironment(env: Record<string, string | undefined>) {
  const stage = env.APP_ENV ?? "development";
  if (stage !== "development") {
    throw new Error("Tahap 1 hanya mendukung APP_ENV=development. Staging/production belum diimplementasikan.");
  }
  for (const key of ["DATA_PROVIDER", "AI_PROVIDER", "PAYMENT_PROVIDER", "EMAIL_PROVIDER"]) {
    if (env[key] && env[key] !== "mock") throw new Error(`${key}: hanya adapter mock tersedia pada Tahap 1.`);
  }
  if (env.ENABLE_TESTER_GRANTS && env.ENABLE_TESTER_GRANTS !== "false") {
    throw new Error("Grant tester server belum tersedia. Gunakan kontrol saldo contoh di demo lokal.");
  }
  return { appEnv: stage, demo: true } as const;
}
