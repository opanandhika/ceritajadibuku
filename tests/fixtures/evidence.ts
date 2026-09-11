import type { Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

/** Only an explicit evidence refresh may update the documented screenshots. */
export async function captureEvidence(page: Page, path: string, fullPage = true) {
  if (process.env.UPDATE_E2E_EVIDENCE !== "1") return;
  await mkdir(dirname(path), { recursive: true });
  await page.screenshot({ path, fullPage, animations: "disabled" });
}
