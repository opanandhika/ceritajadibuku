import { installTestBook } from "../fixtures/browser";
import { expect, test, type Page } from "@playwright/test";

async function state(page: Page) { return page.evaluate(() => JSON.parse(localStorage.getItem("ceritajadibuku:workspace:v2")!)); }
async function demo(page: Page) { await page.getByRole("button", { name: "Pengaturan demo", exact: true }).click(); }
async function close(page: Page) { await page.getByRole("button", { name: "Dialog tutup" }).click(); }
async function begin(page: Page) {
  await page.getByRole("button", { name: "Buka buku", exact: true }).click();
  await page.getByRole("button", { name: "Tambahkan cerita", exact: true }).click();
  await page.getByRole("button", { name: "Mulai sesi — maks. 5 kredit", exact: true }).click();
}
test.beforeEach(async ({ page }) => { await installTestBook(page);
  await page.goto("/"); await expect(page.getByRole("heading", { name: "Buku saya", exact: true })).toBeVisible(); });

test("kontras warna inti, nama pena, judul panjang, dan penyimpanan format", async ({ page }) => {
  const ratios = await page.evaluate(() => {
    const css = getComputedStyle(document.documentElement);
    const luminance = (hex: string) => {
      const rgb = hex.trim().replace("#", "").match(/../g)!.map((pair) => parseInt(pair, 16) / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
      return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
    };
    return ["--text", "--muted", "--primary", "--accent-text"].map((key) => ({ key, ratio: (luminance(css.getPropertyValue("--canvas")) + .05) / (luminance(css.getPropertyValue(key)) + .05) }));
  });
  for (const item of ratios) expect(item.ratio, item.key).toBeGreaterThanOrEqual(4.5);
  await page.getByRole("button", { name: "Tokoh & privasi", exact: true }).click();
  await page.getByRole("textbox", { name: "Nama pena di sampul", exact: true }).fill("Langit Sore");
  await page.getByRole("button", { name: "Simpan nama pena", exact: true }).click();
  expect((await state(page)).books[0].characters[0].displayName).toBe("Nara");
  await expect(page.locator(".account")).toContainText("Penulis");
  await page.getByRole("button", { name: "Naskah", exact: true }).click();
  await page.getByRole("textbox", { name: "Judul bagian naskah", exact: true }).fill("Judul panjang yang tetap terbaca ketika pengalaman ini ditulis dari layar telepon genggam");
  await page.getByRole("textbox", { name: "Isi naskah", exact: true }).fill("Cerita dengan format yang ingin dipertahankan.");
  await page.getByRole("textbox", { name: "Isi naskah", exact: true }).press("ControlOrMeta+a");
  await page.getByRole("button", { name: "Tebal", exact: true }).click();
  await page.reload();
  await expect(page.locator(".tiptap strong")).toContainText("Cerita dengan format");
  await page.setViewportSize({ width: 320, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.getByRole("textbox", { name: "Judul bagian naskah" }).evaluate((node) => node.scrollHeight <= node.clientHeight + 2)).toBe(true);
});

test("refresh pertanyaan kedua memulihkan input dan biaya; dua skip mempertahankan bahan", async ({ page }) => {
  await demo(page); await page.getByLabel("Skenario provider").selectOption("short"); await close(page); await begin(page);
  await page.getByLabel("Jawabanmu", { exact: true }).fill("Satu bahan yang terkirim.");
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await expect(page.getByText("Pertanyaan 2 · maksimal 4", { exact: true })).toBeVisible();
  await page.getByLabel("Jawabanmu", { exact: true }).fill("Buffer yang belum dikirim.");
  await page.getByRole("button", { name: "Simpan dan jeda", exact: true }).click();
  const before = (await state(page)).books[0].sessions[0];
  await page.reload();
  await page.getByRole("button", { name: "Lanjutkan sesi", exact: true }).click();
  const after = (await state(page)).books[0].sessions[0];
  expect(after.questions).toEqual(before.questions); expect(after.focus).toBe(before.focus);
  expect(after.answers).toEqual(before.answers); expect(after.spent).toBe(1);
  await expect(page.getByLabel("Jawabanmu", { exact: true })).toHaveValue("Buffer yang belum dikirim.");
  for (let i = 0; i < 2; i++) {
    await page.getByRole("button", { name: "Lewati", exact: true }).click();
    await page.getByRole("button", { name: "Lanjutkan tanpa mengirim", exact: true }).click();
  }
  await expect(page.getByText("Drafmu sudah tersedia", { exact: true })).toBeVisible();
  const session = (await state(page)).books[0].sessions[0];
  expect(session.answers).toHaveLength(1); expect(session.draft.text).toContain("Satu bahan yang terkirim.");
  expect(session.draft.text).not.toContain("Buffer"); expect(session.input).toContain("Buffer"); expect(session.spent).toBe(5);
});

test("pilihan no-AI menahan provider, ekspor manual boleh sampai sumber ditandai no-book", async ({ page }) => {
  await begin(page);
  await page.getByLabel("Jawabanmu", { exact: true }).fill("SENTINEL cerita privat sintetis.");
  await page.getByText("Pilihan privasi jawaban ini", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Jangan kirim ke AI", exact: true }).check();
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Ceritamu tersimpan sebagai bahan." })).toBeVisible();
  const source = (await state(page)).books[0].sessions[0];
  expect(source.operation).toBeNull(); expect(source.spent).toBe(0);
  await page.getByRole("button", { name: "Menulis manual", exact: true }).click();
  await page.getByRole("textbox", { name: "Isi naskah", exact: true }).fill("SENTINEL cerita privat sintetis.");
  await page.getByRole("button", { name: "Tinjau privasi", exact: true }).click();
  await page.getByRole("button", { name: "Periksa naskah", exact: true }).click();
  await expect(page.getByText("Tidak ada pelanggaran yang diketahui pada teks.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cerita saya", exact: true }).click();
  await page.locator(".source-card").filter({ hasText: "SENTINEL" }).getByRole("checkbox", { name: "Jangan masukkan ke buku", exact: true }).check();
  await page.getByRole("button", { name: "Tinjau privasi buku", exact: true }).click();
  await page.getByRole("button", { name: "Periksa naskah", exact: true }).click();
  await expect(page.locator(".finding")).toContainText("Jangan masukkan ke buku");
  await expect(page.getByRole("button", { name: "Buka pratinjau ekspor contoh" })).toHaveCount(0);
});

test("keyboard, mode baca, keadaan kosong, dan layar tambahan pada lebar sempit", async ({ page }) => {
  await page.keyboard.press("Tab"); await expect(page.getByRole("link", { name: "Lewati navigasi" })).toBeFocused();
  await page.keyboard.press("Enter"); await expect(page.locator("#main")).toBeFocused();
  expect(page.url()).not.toContain("#main");
  await page.getByRole("button", { name: "Naskah", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Isi naskah" })).toBeVisible();
  const revision = (await state(page)).books[0].sections[0].revision;
  await page.getByRole("button", { name: "Mode baca", exact: true }).click();
  await page.getByRole("button", { name: "Kembali mengedit", exact: true }).click();
  expect((await state(page)).books[0].sections[0].revision).toBe(revision);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Buka navigasi", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Navigasi", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Buka navigasi", exact: true })).toBeFocused();
  for (const route of ["books", "book", "start", "characters", "privacy", "sources", "credits"]) {
    await page.goto(`/#${route}`);
    for (const width of [320, 360, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} at ${width}`).toBe(true);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await demo(page); await page.getByRole("button", { name: "Kosongkan data lokal", exact: true }).click();
  await page.getByRole("button", { name: "Kosongkan buku", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Buku pertamamu dimulai dari satu cerita." })).toBeVisible();
  await page.screenshot({ path: "docs/bukti-tahap-1/09-buku-kosong.png", fullPage: true, animations: "disabled" });
});
