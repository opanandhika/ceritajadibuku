import { captureEvidence } from "../fixtures/evidence";
import { expect, test, type Page } from "../fixtures/test";
import { exampleDemo } from "../fixtures/demo";
import { newBook } from "../../src/demo/seed";
import { STORAGE_KEY, PREVIOUS_STORAGE_KEY } from "../../src/demo/storage";

const evidence = "docs/bukti-onboarding";
async function state(page: Page) { return page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY); }
async function createBook(page: Page, title = "") {
  await page.getByRole("button", { name: "Buat buku", exact: true }).click();
  await page.getByLabel("Judul buku", { exact: true }).fill(title);
  await page.getByRole("dialog").getByRole("button", { name: "Buat buku", exact: true }).click();
}
async function openSettings(page: Page) { await page.getByRole("button", { name: "Pengaturan demo", exact: true }).click(); }
async function closeDialog(page: Page) { await page.getByRole("button", { name: "Dialog tutup" }).click(); }

test("ruang baru kosong, judul dapat menyusul, nama mengikuti pilihan pengguna", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Buku pertamamu dimulai dari satu cerita." })).toBeVisible();
  expect(await state(page)).toMatchObject({ books: [], credits: 150, events: [] });
  await expect(page.getByRole("button", { name: "Buat buku", exact: true })).toHaveCount(1);
  await expect(page.getByText(/Langkah Menuju Jepang|Nara|Citra Senja|Buku contoh|Lihat contoh/)).toHaveCount(0);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await captureEvidence(page, `${evidence}/kosong-${width}.png`, true);
  }
  await createBook(page);
  await expect(page.getByRole("heading", { name: "Buku tanpa judul", exact: true })).toBeVisible();
  let book = (await state(page)).books[0];
  expect(book).toMatchObject({ authorName: "", sources: [], sessions: [] });
  expect(book.characters[0]).toMatchObject({ alias: "", displayName: "[Penulis]", mode: "pending" });
  expect(book.sections[0].text).toBe("");
  await page.getByRole("button", { name: "Tokoh & privasi", exact: true }).click();
  await page.getByRole("button", { name: "Lihat pratinjau", exact: true }).click();
  await expect(page.getByLabel("Nama di sampul yang akan dipakai")).toHaveValue("");
  await expect(page.getByRole("dialog")).not.toContainText(/Nara|Citra Senja/);
  await page.getByRole("button", { name: "Terapkan penyamaran — 0 kredit", exact: true }).click();
  await page.getByRole("button", { name: /\[Penulis\] Tokoh saya/ }).click();
  await page.getByRole("combobox", { name: "Pilihan nama", exact: true }).selectOption("pseudonym");
  await page.getByLabel("Nama yang tampil", { exact: true }).fill("Pelangi");
  await page.getByRole("button", { name: "Simpan pilihan", exact: true }).click();
  await page.getByLabel("Nama pena di sampul", { exact: true }).fill("Senja Pagi");
  await page.getByRole("button", { name: "Simpan nama pena", exact: true }).click();
  await page.getByRole("button", { name: "Ringkasan buku", exact: true }).click();
  await page.getByRole("button", { name: "Ubah judul", exact: true }).click();
  await page.getByLabel("Judul buku", { exact: true }).fill("Cerita pilihanku");
  await page.getByRole("button", { name: "Simpan judul", exact: true }).click();
  await page.getByRole("button", { name: "Tambahkan cerita", exact: true }).click();
  for (const label of ["Awal sebuah mimpi", "Pengalaman yang membekas", "Seseorang yang penting"]) await expect(page.getByRole("radio", { name: new RegExp(label) })).toBeVisible();
  for (const label of ["Tulis topik sendiri", "Langsung bercerita"]) await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
  await captureEvidence(page, `${evidence}/saran-umum.png`, true);
  await page.reload(); book = (await state(page)).books[0];
  expect(book).toMatchObject({ title: "Cerita pilihanku", authorName: "Senja Pagi" });
  expect(book.characters[0]).toMatchObject({ alias: "Pelangi", displayName: "Pelangi" });
});

for (const [theme, opening, question] of [
  ["Keluarga", "Aku memasak bersama keluarga.", "Apa yang kamu lakukan dalam pengalaman keluarga itu?"],
  ["Karier", "Aku memulai karier baru.", "Apa langkah yang kamu ambil dalam perjalanan karier itu?"],
  ["Usaha", "Aku membuka usaha kecil.", "Apa yang kamu lakukan dalam pengalaman usaha itu?"],
]) test(`cerita ${theme} menghasilkan pertanyaan dan draf sesuai bahan`, async ({ page }) => {
  await page.goto("/"); await createBook(page, `Catatan ${theme}`);
  await page.getByRole("button", { name: "Tambahkan cerita", exact: true }).click();
  await page.getByRole("button", { name: "Tulis topik sendiri", exact: true }).click();
  await page.getByLabel("Topik ceritamu", { exact: true }).fill(theme);
  await page.getByRole("button", { name: "Mulai sesi — maks. 5 kredit", exact: true }).click();
  await page.getByLabel("Jawabanmu", { exact: true }).fill(opening);
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await expect(page.locator(".active-question")).toHaveText(question);
  const detail = "Aku mencatat hal yang perlu disiapkan di buku kecil. Keesokan harinya aku mencoba langkah sederhana itu dan melihat hasilnya perlahan. Pengalaman tersebut masih kuingat karena aku belajar untuk lebih sabar dalam menjalani proses.";
  await page.getByLabel("Jawabanmu", { exact: true }).fill(detail);
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await expect(page.getByText("Drafmu sudah tersedia", { exact: true })).toBeVisible();
  await expect(page.locator(".draft-paper .prose")).toContainText(opening);
  await expect(page.locator(".draft-paper .prose")).toContainText(detail);
  await expect(page.locator(".draft-paper .prose")).not.toContainText(/Jepang|Nara|Citra Senja/);
  await page.getByRole("button", { name: "Gunakan di naskah", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Isi naskah", exact: true })).toContainText(opening);
  const value = await state(page);
  expect(value.books).toHaveLength(1); expect(value.books[0].sources).toEqual([]);
  expect(value.books[0].sections[0].text).toBe(`${opening}\n\n${detail}`);
  expect(value.credits).toBe(145); expect(value.events).toHaveLength(2);
});

test("seed legacy utuh tidak tampil, buku pengguna dan salinan tulisan lama tetap utuh", async ({ page }) => {
  const old = exampleDemo();
  const own = newBook("mine", "Catatan keluargaku");
  own.characters[0].alias = "Nara"; // Unchosen default in the previous implementation.
  old.books.push(own); old.credits = 80; old.events.push({ id: "old", label: "Simulasi lama", amount: -70 });
  const raw = JSON.stringify(old);
  await page.addInitScript(({ key, raw }) => { localStorage.setItem(key, raw); }, { key: PREVIOUS_STORAGE_KEY, raw });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Catatan keluargaku", exact: true })).toBeVisible();
  await expect(page.getByText("Langkah Menuju Jepang", { exact: true })).toHaveCount(0);
  const value = await state(page);
  expect(value.books).toHaveLength(1); expect(value.books[0].id).toBe("mine");
  expect(value.books[0].characters[0].alias).toBe("");
  expect(value.credits).toBe(150); expect(value.events).toEqual([]);
  await openSettings(page);
  await page.getByRole("button", { name: "Salin tulisan dari prototipe sebelumnya", exact: true }).click();
  await expect(page.getByLabel("Salinan tulisan", { exact: true })).toHaveValue(/Keinginan sekolah di Jepang/);
  await closeDialog(page); await page.reload();
  await expect(page.getByText("Langkah Menuju Jepang", { exact: true })).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), PREVIOUS_STORAGE_KEY)).toBe(raw);
});

test("snapshot lama rusak tidak mengisi atau menghalangi ruang baru", async ({ page }) => {
  await page.addInitScript((key) => { localStorage.setItem(key, "{rusak"); }, PREVIOUS_STORAGE_KEY);
  await page.goto("/"); await createBook(page, "Masih bisa menulis");
  expect((await state(page)).books).toHaveLength(1);
  expect(await page.evaluate((key) => localStorage.getItem(key), PREVIOUS_STORAGE_KEY)).toBe("{rusak");
});

test("tiga slot seluruhnya tersedia untuk buku pengguna", async ({ page }) => {
  await page.goto("/");
  for (const title of ["Keluarga", "Karier", "Usaha"]) {
    await createBook(page, title);
    await page.getByRole("button", { name: "Buku saya", exact: true }).click();
  }
  await expect(page.getByRole("button", { name: "Buat buku", exact: true })).toBeDisabled();
  expect((await state(page)).books.map((book: { title: string }) => book.title)).toEqual(["Keluarga", "Karier", "Usaha"]);
  expect((await state(page)).events).toEqual([]);
});

test("reset saat respons terlambat tetap kosong setelah respons dan refresh", async ({ page }) => {
  const old = exampleDemo(); old.books = [newBook("old-user-book", "Buku lama pengguna")];
  await page.addInitScript(({ key, value }) => { localStorage.setItem(key, value); }, { key: PREVIOUS_STORAGE_KEY, value: JSON.stringify(old) });
  await page.goto("/"); await createBook(page);
  await openSettings(page); await page.getByLabel("Skenario provider").selectOption("late"); await closeDialog(page);
  await page.getByRole("button", { name: "Tambahkan cerita", exact: true }).click();
  await page.getByRole("button", { name: "Mulai sesi — maks. 5 kredit", exact: true }).click();
  await page.getByLabel("Jawabanmu", { exact: true }).fill("Aku sedang menceritakan pengalaman keluarga.");
  await page.getByRole("button", { name: "Kirim jawaban", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sedang membaca ceritamu…", exact: true })).toBeVisible();
  await openSettings(page); await page.getByRole("button", { name: "Kosongkan data lokal", exact: true }).click();
  await expect(page.getByRole("button", { name: /Pulihkan contoh/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Kosongkan buku", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Buku pertamamu dimulai dari satu cerita." })).toBeVisible();
  await page.waitForTimeout(5300); // Cross the synthetic response boundary after reset.
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buku pertamamu dimulai dari satu cerita." })).toBeVisible();
  expect(await state(page)).toMatchObject({ books: [], activeBookId: "", credits: 150, events: [] });
});

test("seed yang sudah diedit tetap menjadi buku pengguna dan semua tulisan dapat disalin", async ({ page }) => {
  const old = exampleDemo(); const book = old.books[0];
  book.sections[0].text = "Catatan sintetis tentang awal karier yang ditulis pengguna.";
  book.authorName = "Pena Pilihan";
  Object.assign(book.characters[0], { displayName: "Awan", alias: "Awan", mode: "pseudonym", knownNames: ["Awan"] });
  const raw = JSON.stringify(old);
  await page.addInitScript(({ key, raw }) => { localStorage.setItem(key, raw); }, { key: PREVIOUS_STORAGE_KEY, raw });
  await page.goto("/");
  await page.getByRole("button", { name: "Buka buku", exact: true }).click();
  await page.getByRole("button", { name: "Naskah", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Isi naskah", exact: true })).toContainText(book.sections[0].text);
  const migrated = (await state(page)).books[0];
  expect(migrated.authorName).toBe("Pena Pilihan");
  expect(migrated.characters[0].alias).toBe("Awan");
  await openSettings(page);
  await page.getByRole("button", { name: "Salin tulisan dari prototipe sebelumnya", exact: true }).click();
  await expect(page.getByLabel("Salinan tulisan", { exact: true })).toHaveValue(/awal karier yang ditulis pengguna/);
  expect(await page.evaluate((key) => localStorage.getItem(key), PREVIOUS_STORAGE_KEY)).toBe(raw);
});

test("ID sama tidak menghapus buku non-demo dan alias pending tidak dikonfirmasi otomatis", async ({ page }) => {
  const old = exampleDemo(); const book = newBook("jepang", "Pengalaman membangun usaha");
  book.authorName = "Pena Usaha"; book.characters[0].alias = "Samaran dari versi lama";
  book.sections[0].text = "Tulisan sintetis dari buku buatan pengguna.";
  old.books = [book];
  await page.addInitScript(({ key, value }) => { localStorage.setItem(key, value); }, { key: PREVIOUS_STORAGE_KEY, value: JSON.stringify(old) });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: book.title, exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Tokoh & privasi", exact: true }).click();
  await page.getByRole("button", { name: "Lihat pratinjau", exact: true }).click();
  await expect(page.getByLabel("Nama di sampul yang akan dipakai")).toHaveValue("Pena Usaha");
  await expect(page.getByRole("dialog")).not.toContainText("Samaran dari versi lama");
  expect((await state(page)).books[0].sections).toEqual(book.sections);
});

for (const raw of ["", "{rusak"]) test(`snapshot aktif rusak dipertahankan tanpa migrasi: ${raw || "kosong"}`, async ({ page }) => {
  await page.addInitScript(({ key, raw }) => { localStorage.setItem(key, raw); }, { key: STORAGE_KEY, raw });
  await page.goto("/");
  await expect(page.locator(".save-alert")).toContainText("Data lama belum ditimpa");
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(raw);
});

test("kredit menjelaskan aturan simulasi tanpa tanggal akun tetap", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Kredit & langganan", exact: true }).click();
  await expect(page.locator(".plan-card")).toContainText("satu bulan kalender sejak pembayaran terverifikasi");
  await expect(page.locator(".topup-section")).toContainText("30 hari sejak pembayaran terverifikasi");
  await expect(page.locator("#main")).not.toContainText(/September|Oktober|2026|09.00/);
});
