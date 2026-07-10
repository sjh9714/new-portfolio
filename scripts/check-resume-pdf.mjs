import { readFile } from "node:fs/promises";

const pdfPath = process.argv[2] ?? "public/resume-sung-jinhyuk-backend.pdf";
const pdf = (await readFile(pdfPath)).toString("latin1");
const pagesMatch = pdf.match(/\/Type \/Pages\s*\/Count (\d+)/);
const mediaBoxMatch = pdf.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
const sourceFingerprint = pdf.match(
  /% RESUME_SOURCE_SHA256 ([0-9a-f]{64})/,
)?.[1];

if (!pagesMatch || Number(pagesMatch[1]) !== 1) {
  throw new Error(
    `Expected one PDF page, found ${pagesMatch?.[1] ?? "unknown"}`,
  );
}

if (!mediaBoxMatch) {
  throw new Error("Could not find the PDF MediaBox");
}

if (!sourceFingerprint) {
  throw new Error("Resume PDF has no source fingerprint");
}

const width = Number(mediaBoxMatch[1]);
const height = Number(mediaBoxMatch[2]);
if (Math.abs(width - 595.28) > 1 || Math.abs(height - 841.89) > 1.5) {
  throw new Error(`Expected A4 MediaBox, found ${width}×${height}`);
}

console.log(
  `Resume PDF: 1 page, A4 (${width}×${height}pt), source ${sourceFingerprint.slice(0, 12)}`,
);
