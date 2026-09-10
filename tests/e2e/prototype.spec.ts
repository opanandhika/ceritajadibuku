import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const story = "Aku menemukan sebuah buku tentang Jepang di perpustakaan sekolah. Sepulang sekolah, aku menuliskan keinginan untuk belajar di sana. Saat itu aku belum tahu caranya. Aku lalu mulai mencari informasi dan belajar bahasa sedikit demi sedikit.";
const evidence = "docs/bukti-tahap-1";
const browserErrors = new WeakMap<Page, string[]>();
async function openDemo(page: Page, scenario?: string) {
  await page.getByRole("button", { name: "Pengaturan demo", exact: true }).click();
  if (scenario) await page.getByLabel("Skenario provider").selectOption(scenario);
}
async function closeDialog(page: Page) { await page.getByRole("button", { name: "Dialog tutup" }).click(); }
async function begin(page: Page, free = false) {
  await page.getByRole("button", { name: "Buka buku", exact: true }).click();
  await page.getByRole("button", { name: "Tambahkan cerita", exact: true }).click();
  if (free) await page.getByRole("button", { name: "Langsung bercerita", exact: true }).click();
  await page.getByRole("button", { name: "Mulai sesi — maks. 5 kredit", exact: true }).click();
}
test.beforeEach(async ({ page }) => {
  await mkdir(evidence, { recursive: true });
  const errors: string[] = []; browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && /Maximum update depth|hydration/i.test(message.text())) errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Buku saya", exact: true })).toBeVisible();
});
test.afterEach(async ({ page }) => { expect(browserErrors.get(page)).toEqual([]); });

test("cerita cukup → usulan → naskah → refresh, dengan bukti tiga layar desktop", async ({ page }) => {
  await mkdir(evidence, { recursive: true });
  await page.screenshot({ path: `${evidence}/01-buku-desktop.png`, fullPage: true, animations: "disabled" });
  await begin(page, true);
  await page.getByLabel("Jawabanmu", { exact: true }).fill(story);
  await page.screenshot({ path: `${evidence}/02-sesi-desktop.png`, fullPage: true, animations: "disabled" });
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).dblclick();
  await expect(page.getByText("Drafmu sudah tersedia", { exact: true })).toBeVisible();
  await expect(page.getByText("4 kredit contoh terpakai", { exact: true })).toBeVisible();
  const beforeApply = await page.evaluate(() => JSON.parse(localStorage.getItem("ceritajadibuku:demo:v1")!));
  expect(beforeApply.books[0].sections[0].text).not.toContain("Aku menemukan sebuah buku");
  expect(beforeApply.books[0].sessions[0].answers).toHaveLength(1);
  expect(beforeApply.events).toHaveLength(1);
  await page.getByRole("button", { name: "Gunakan di naskah", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Isi naskah", exact: true })).toContainText("Aku menemukan sebuah buku");
  await page.screenshot({ path: `${evidence}/03-editor-desktop.png`, fullPage: true, animations: "disabled" });
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Isi naskah", exact: true })).toContainText("Aku menemukan sebuah buku");
});

test("pertanyaan keempat menunggu; dua skip kosong berhenti tanpa biaya", async ({ page }) => {
  await openDemo(page, "short"); await closeDialog(page); await begin(page);
  for (let i = 0; i < 3; i++) {
    await page.getByLabel("Jawabanmu", { exact: true }).fill("Aku mulai belajar.");
    await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
    await expect(page.getByText(`Pertanyaan ${i + 2} · maksimal 4`, { exact: true })).toBeVisible();
  }
  await expect(page.getByRole("button", { name: "Kirim jawaban", exact: true })).toBeVisible();
  await expect(page.getByText("Drafmu sudah tersedia")).toHaveCount(0);
  await page.getByRole("button", { name: "Lewati", exact: true }).click();
  await expect(page.getByText("Drafmu sudah tersedia", { exact: true })).toBeVisible();
  await expect(page.getByText("5 kredit contoh terpakai", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Ceritakan momen lain", exact: true }).click();
  await page.getByRole("button", { name: "Mulai sesi — maks. 5 kredit", exact: true }).click();
  await page.getByRole("button", { name: "Lewati", exact: true }).click();
  await expect(page.getByText("Pertanyaan 2 · maksimal 4", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Lewati", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Ceritamu tersimpan sebagai bahan." })).toBeVisible();
  await expect(page.getByText("0 kredit contoh terpakai", { exact: true })).toBeVisible();
});

test("respons bertumpuk tidak tampil; skip dengan buffer memerlukan pilihan", async ({ page }) => {
  await openDemo(page, "stacked"); await closeDialog(page); await begin(page);
  await page.getByLabel("Jawabanmu", { exact: true }).fill("Aku mulai belajar.");
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Apa langkah pertama yang kamu lakukan?" })).toBeVisible();
  await expect(page.getByText("Apa yang terjadi dan siapa yang menemanimu?", { exact: true })).toHaveCount(0);
  await page.getByLabel("Jawabanmu", { exact: true }).fill("Tulisan yang belum dikirim");
  await page.getByRole("button", { name: "Lewati", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Lanjutkan tanpa mengirim", exact: true }).click();
  await expect(page.getByLabel("Jawabanmu", { exact: true })).toHaveValue("Tulisan yang belum dikirim");
});

test("respons terlambat setelah jeda/refresh tidak menghidupkan sesi", async ({ page }) => {
  await openDemo(page, "late"); await closeDialog(page); await begin(page);
  await page.getByLabel("Jawabanmu", { exact: true }).fill(story);
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await page.screenshot({ path: `${evidence}/10-proses-berjalan.png`, fullPage: true, animations: "disabled" });
  await page.getByRole("button", { name: "Simpan dan jeda", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Kita lanjutkan saat kamu siap." })).toBeVisible();
  await page.waitForTimeout(5300); // Explicitly cross the synthetic late-response boundary.
  await expect(page.getByRole("heading", { name: "Kita lanjutkan saat kamu siap." })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Kita lanjutkan saat kamu siap." })).toBeVisible();
  await expect(page.getByText("0 kredit contoh terpakai", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Lanjutkan sesi", exact: true }).click();
  await expect(page.getByRole("button", { name: "Lanjutkan proses", exact: true })).toBeVisible();
});

test("provider gagal mempertahankan jawaban dan pulih melalui tindakan pengguna", async ({ page }) => {
  await openDemo(page, "failure"); await closeDialog(page); await begin(page);
  await page.getByLabel("Jawabanmu", { exact: true }).fill(story);
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Proses belum dapat dilanjutkan." })).toBeVisible();
  await page.screenshot({ path: `${evidence}/08-respons-gagal.png`, fullPage: true, animations: "disabled" });
  await expect(page.getByText("0 kredit contoh terpakai", { exact: true })).toBeVisible();
  await openDemo(page, "normal"); await closeDialog(page);
  await page.getByRole("button", { name: "Lanjutkan proses", exact: true }).click();
  await expect(page.getByText("Drafmu sudah tersedia", { exact: true })).toBeVisible();
});

test("usulan lama tidak menimpa revisi manual", async ({ page }) => {
  await begin(page, true); await page.getByLabel("Jawabanmu", { exact: true }).fill(story);
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await expect(page.getByText("Drafmu sudah tersedia", { exact: true })).toBeVisible();
  const sessionUrl = page.url();
  await page.getByRole("button", { name: "Naskah", exact: true }).click();
  await page.getByRole("textbox", { name: "Isi naskah", exact: true }).fill("Tulisan terbaru yang harus tetap utuh.");
  await page.goto(sessionUrl);
  await page.getByRole("button", { name: "Gunakan di naskah", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("sudah berubah");
  await expect(page.getByRole("textbox", { name: "Isi naskah", exact: true })).toContainText("Tulisan terbaru yang harus tetap utuh.");
  await page.getByRole("button", { name: "Simpan usulan terpisah", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Isi naskah", exact: true })).toContainText("Aku menemukan sebuah buku");
  await page.getByRole("button", { name: /01 Sebuah mimpi/ }).click();
  await expect(page.getByRole("textbox", { name: "Isi naskah", exact: true })).toContainText("Tulisan terbaru yang harus tetap utuh.");

});

test("tokoh diri, pending, nama pena dan tinjauan privasi contoh", async ({ page }) => {
  await page.getByRole("button", { name: "Tokoh & privasi", exact: true }).click();
  await page.getByRole("button", { name: /Nara Tokoh saya/ }).click();
  await page.getByRole("button", { name: "Atur nanti", exact: true }).click();
  await expect(page.getByRole("button", { name: /\[Penulis\] Tokoh saya/ })).toBeVisible();
  await page.getByRole("button", { name: "Lihat pratinjau", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("tokoh saya");
  await page.screenshot({ path: `${evidence}/07-privasi-preview.png`, fullPage: false, animations: "disabled" });
  await page.getByRole("button", { name: "Terapkan penyamaran — 0 kredit", exact: true }).click();
  await page.getByRole("button", { name: "Naskah", exact: true }).click();
  await page.getByRole("textbox", { name: "Isi naskah", exact: true }).fill("Nadia bertemu Ayu di perpustakaan.");
  await page.getByRole("button", { name: "Tinjau privasi", exact: true }).click();
  await page.getByRole("button", { name: "Periksa naskah contoh", exact: true }).click();
  await expect(page.getByText("2 hal perlu diselesaikan", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Buka pratinjau ekspor contoh" })).toHaveCount(0);
  await page.getByRole("button", { name: "Gunakan nama pilihan untuk ekspor contoh", exact: true }).click();
  await page.getByRole("checkbox", { name: /Saya sudah meninjau/ }).check();
  await page.getByRole("button", { name: "Buka pratinjau ekspor contoh", exact: true }).click();
  await expect(page.locator(".export-preview")).toContainText("Nara bertemu Lila");
  await expect(page.locator(".export-preview")).toContainText("Citra Senja");
});

test("saldo nol tetap bisa menulis, tambahan saldo tidak otomatis memproses", async ({ page }) => {
  await openDemo(page); await page.getByRole("button", { name: "Jadikan nol", exact: true }).click(); await closeDialog(page);
  await page.getByRole("button", { name: "Naskah", exact: true }).click();
  await page.getByRole("textbox", { name: "Isi naskah", exact: true }).fill("Tulisan manual pada saldo nol.");
  await expect(page.getByRole("button", { name: "0 kredit contoh", exact: true })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Isi naskah", exact: true })).toContainText("Tulisan manual pada saldo nol.");
  await page.getByRole("button", { name: "Buku saya", exact: true }).click();
  await begin(page); await page.getByLabel("Jawabanmu", { exact: true }).fill(story);
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Proses belum dapat dilanjutkan." })).toBeVisible();
  await openDemo(page); await page.getByRole("button", { name: "Tambah 50 contoh", exact: true }).click(); await closeDialog(page);
  await expect(page.getByRole("heading", { name: "Proses belum dapat dilanjutkan." })).toBeVisible();
  await page.getByRole("button", { name: "Menulis manual", exact: true }).click();
  await page.getByRole("textbox", { name: "Isi naskah", exact: true }).fill("Menulis manual masih tersedia.");
  await expect(page.getByRole("textbox", { name: "Isi naskah", exact: true })).toContainText("Menulis manual masih tersedia.");
});

test("gagal simpan memperlihatkan pemulihan teks tanpa klaim tersimpan", async ({ page }) => {
  await begin(page); await page.getByLabel("Jawabanmu", { exact: true }).fill("Teks dalam memori.");
  await openDemo(page); await page.getByRole("checkbox", { name: "Simulasikan penyimpanan gagal" }).check(); await closeDialog(page);
  await expect(page.locator(".save-alert")).toContainText("belum tersimpan");
  await expect(page.getByText("Tersimpan di perangkat · Data contoh", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Selamatkan tulisan", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Salinan tulisan", exact: true })).toHaveValue(/Teks dalam memori/);
});

test("tiga layar HP dan semua lebar tidak meluber", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${evidence}/04-buku-hp.png`, fullPage: true, animations: "disabled" });
  await begin(page); await page.getByLabel("Jawabanmu", { exact: true }).fill(story);
  await page.screenshot({ path: `${evidence}/05-sesi-hp.png`, fullPage: true, animations: "disabled" });
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole("button", { name: "Lewati", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Kirim jawaban", exact: true })).toBeVisible();
  }
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await expect(page.getByText("Drafmu sudah tersedia", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Gunakan di naskah", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${evidence}/06-editor-hp.png`, fullPage: true, animations: "disabled" });
  for (const width of [320, 360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole("textbox", { name: "Isi naskah", exact: true })).toBeVisible();
  }
});
