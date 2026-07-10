import { readFile } from "node:fs/promises";

const [trackedPath, generatedPath] = process.argv.slice(2);
if (!trackedPath || !generatedPath) {
  throw new Error("Usage: compare-resume-pdfs <tracked.pdf> <generated.pdf>");
}

const fingerprintPattern = /% RESUME_SOURCE_SHA256 ([0-9a-f]{64})/;
const fingerprint = async (path) =>
  (await readFile(path)).toString("latin1").match(fingerprintPattern)?.[1];

const [tracked, generated] = await Promise.all([
  fingerprint(trackedPath),
  fingerprint(generatedPath),
]);

if (!tracked || !generated) {
  throw new Error("Both resume PDFs must contain a source fingerprint");
}
if (tracked !== generated) {
  throw new Error(
    `Tracked resume is stale: ${tracked.slice(0, 12)} != ${generated.slice(0, 12)}`,
  );
}

console.log(`Resume source fingerprints match: ${tracked.slice(0, 12)}`);
