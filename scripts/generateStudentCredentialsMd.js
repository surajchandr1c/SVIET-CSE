/* eslint-disable @typescript-eslint/no-require-imports */
const { readFile, writeFile, mkdir } = require("node:fs/promises");
const path = require("node:path");

const normalizeAdmissionNo = (value) => String(value ?? "").trim().toUpperCase();

const normalizeName = (row) =>
  String(row?.name ?? row?.Name ?? "")
    .trim()
    .replace(/\s+/g, " ");

const initialPasswordForAdmission = (admissionNo) => {
  const match = String(admissionNo).match(/(\d{3,4})$/);
  const suffix = String(match?.[1] ?? "0000").padStart(4, "0");
  return `SVIET@${suffix}`;
};

const loadJson = async (filePath) => {
  const raw = await readFile(filePath, "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
};

const buildTable = (title, rows) => {
  const lines = [];
  lines.push(`## ${title}`);
  lines.push("");
  lines.push("| Name | Admission No. | Initial Password |");
  lines.push("| --- | --- | --- |");

  for (const row of rows) {
    const admissionNo = normalizeAdmissionNo(row?.admissionNo);
    const name = normalizeName(row);
    if (!admissionNo || !name) continue;
    const password = initialPasswordForAdmission(admissionNo);
    lines.push(`| ${name} | ${admissionNo} | \`${password}\` |`);
  }

  lines.push("");
  return lines.join("\n");
};

const main = async () => {
  const root = process.cwd();
  const students4Path = path.join(root, "data", "students4thSem.json");
  const students6Path = path.join(root, "data", "students6thSem.json");

  const [students4, students6] = await Promise.all([
    loadJson(students4Path),
    loadJson(students6Path),
  ]);

  const md = [];
  md.push("# Student Login Credentials (Initial)");
  md.push("");
  md.push(
    "These are the **initial** login passwords for students. Students should **change the password after first login**."
  );
  md.push("");
  md.push(
    "Password format: `SVIET@XXXX` where `XXXX` is the last 3–4 digits of the admission number (left-padded to 4)."
  );
  md.push("");
  md.push(buildTable("4th Semester", students4));
  md.push(buildTable("6th Semester", students6));

  const outDir = path.join(root, "docs");
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "student-credentials-4th-6th.md");
  await writeFile(outPath, md.join("\n"), "utf8");

  console.log(`Wrote: ${outPath}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
