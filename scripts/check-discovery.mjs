import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Read-only discovery helper: no subprocess, network call, dotenv loading, or writes.
const root = fileURLToPath(new URL("../", import.meta.url));
let failures = 0;

function report(ok, message) {
  console.log(`${ok ? "OK" : "GAGAL"} ${message}`);
  if (!ok) failures += 1;
}

function nonemptyFile(path) {
  return existsSync(path) && statSync(path).isFile() && statSync(path).size > 0;
}

const documentation = [
  "README.md",
  "docs/discovery.md",
  "docs/keputusan-teknis.md",
  "docs/progres-implementasi.md",
  "docs/hasil-verifikasi.md",
  "docs/panduan-operasional.md",
  "docs/peta-privasi.md",
  "docs/laporan-tahap-1.md",
  "docs/panduan-pilot-tahap-1.md",
  "docs/penyesuaian-onboarding.md",
];
const inputs = [
  "blueprint(3).md",
  "langkah-implementasi(1).md",
  "ui-ux-spec (1).md",
  "kajian-harga-dan-penulisan.md",
];

console.log("CeritaJadiBuku — pemeriksaan discovery, bukan tes aplikasi");
report(Number(process.versions.node.split(".")[0]) >= 24, "Node.js >=24 untuk baseline proyek");
console.log(`INFO Runtime aktual: ${process.version}`);

for (const name of [...inputs, ...documentation, ".gitignore", ".editorconfig", ".node-version", ".env.example"]) {
  report(nonemptyFile(resolve(root, name)), `Berkas tersedia: ${name}`);
}

let links = 0;
for (const name of documentation) {
  const path = resolve(root, name);
  if (!nonemptyFile(path)) continue;
  const markdown = readFileSync(path, "utf8");
  // Documentation uses percent-encoded paths for spaces and parentheses.
  const matches = markdown.matchAll(/\[[^\]\n]+\]\((?:<([^>]+)>|([^\s)]+))\)/g);
  for (const match of matches) {
    const target = match[1] ?? match[2];
    if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
    let decoded;
    try {
      decoded = decodeURIComponent(target.split("#")[0]);
    } catch {
      report(false, `Tautan tidak valid di ${name}`);
      continue;
    }
    const destination = resolve(dirname(path), decoded);
    const withinRoot = relative(root, destination);
    if (withinRoot === ".." || withinRoot.startsWith("../") || withinRoot.startsWith("..\\") || isAbsolute(withinRoot)) {
      report(false, `Tautan keluar workspace di ${name}`);
      continue;
    }
    if (!existsSync(destination)) report(false, `Target tautan tidak ditemukan di ${name}`);
    links += 1;
  }
}
console.log(`INFO ${links} tautan lokal diperiksa (tujuan berkas; tidak memverifikasi anchor).`);

const templatePath = resolve(root, ".env.example");
if (nonemptyFile(templatePath)) {
  const entries = readFileSync(templatePath, "utf8").split(/\r?\n/)
    .map((line) => line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/))
    .filter(Boolean);
  const emptyRequired = /(?:KEY|SECRET|PASSWORD|DATABASE_URL)$/;
  const unexpectedValues = entries.filter(([, name, value]) => emptyRequired.test(name) && value.trim() !== "");
  report(unexpectedValues.length === 0, "Placeholder kunci/secret/password/database di contoh kosong");
  const names = new Set(entries.map(([, name]) => name));
  report(names.size === entries.length, "Nama konfigurasi contoh tidak duplikat");
  const processConfigured = [...names].filter((name) => (process.env[name] ?? "").trim() !== "");
  console.log(`INFO Nama konfigurasi terisi pada environment proses: ${processConfigured.join(", ") || "tidak ditemukan"}`);
  console.log("INFO Validator Tahap 1 membaca APP_ENV, empat *_PROVIDER dan ENABLE_TESTER_GRANTS; variabel layanan nyata masih rencana.");
}

const envFiles = readdirSync(root).filter((name) => /^\.env(?:\.|$)/.test(name) && name !== ".env.example");
console.log(`INFO Berkas environment lokal: ${envFiles.join(", ") || "tidak ditemukan"}; isi tidak dibaca.`);
console.log(`INFO Metadata Git lokal: ${existsSync(resolve(root, ".git")) ? "tersedia" : "tidak ditemukan"}.`);
console.log(`INFO Konfigurasi Sites: ${existsSync(resolve(root, ".openai/hosting.json")) ? "tersedia; ikuti alur Sites" : "tidak ditemukan"}.`);
console.log(`INFO Manifest aplikasi: ${existsSync(resolve(root, "package.json")) ? "tersedia; pemeriksaan ini tidak menguji aplikasi" : "belum tersedia (Tahap 1)"}.`);
console.log(failures === 0
  ? "LULUS pemeriksaan discovery. Integrasi provider dan perilaku aplikasi belum dibuktikan."
  : `GAGAL ${failures} pemeriksaan discovery.`);
process.exitCode = failures === 0 ? 0 : 1;
