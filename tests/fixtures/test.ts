import { test as base, expect } from "@playwright/test";

export { expect };
export type { Page } from "@playwright/test";

export const test = base.extend<{ localNetworkOnly: void }>({
  localNetworkOnly: [async ({ context, baseURL }, use) => {
    const allowed = new URL(baseURL!);
    const blocked: string[] = [];
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin === allowed.origin) { await route.continue(); return; }
      blocked.push(`${url.protocol}//${url.host}`);
      await route.abort("blockedbyclient");
    });
    await context.routeWebSocket("**/*", (socket) => {
      const url = new URL(socket.url());
      if (url.protocol === "ws:" && url.host === allowed.host) { socket.connectToServer(); return; }
      blocked.push(`${url.protocol}//${url.host}`);
      socket.close();
    });
    await use();
    expect(blocked, "Aplikasi mock tidak boleh mencoba koneksi ke layanan luar").toEqual([]);
  }, { auto: true }],
});
