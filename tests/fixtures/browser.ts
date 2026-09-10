import type { Page } from "@playwright/test";
import { exampleDemo } from "./demo";
import { STORAGE_KEY } from "../../src/demo/storage";

/** Explicit test setup only. No app route or control loads this fixture. */
export async function installTestBook(page: Page) {
  await page.addInitScript(({ key, value }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value));
  }, { key: STORAGE_KEY, value: exampleDemo() });
}
