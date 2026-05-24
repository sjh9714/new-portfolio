import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { renderDiagram } from "./render-svg.ts";
import { architectureSpecs } from "./specs/index.ts";

const isCheck = process.argv.includes("--check");
const projectRoot = process.cwd();
const mismatches: string[] = [];

for (const spec of architectureSpecs) {
  const outputPath = join(projectRoot, spec.outputFile);
  const svg = renderDiagram(spec);

  if (isCheck) {
    const current = existsSync(outputPath)
      ? readFileSync(outputPath, "utf8")
      : "";

    if (current !== svg) {
      mismatches.push(spec.outputFile);
    }
    continue;
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, svg);
}

if (mismatches.length) {
  throw new Error(
    [
      "Architecture SVG artifacts are out of date.",
      "Run `npm run generate:architecture` and commit the generated files.",
      ...mismatches.map((file) => `- ${file}`),
    ].join("\n"),
  );
}
