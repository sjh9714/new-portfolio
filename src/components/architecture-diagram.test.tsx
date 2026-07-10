import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { diagrams } from "@/content/diagrams";

import { ArchitectureDiagram } from "./architecture-diagram";

describe("ArchitectureDiagram", () => {
  it("gives each SVG instance unique accessible and marker IDs", () => {
    const markup = renderToStaticMarkup(
      <ArchitectureDiagram spec={diagrams[0]} />,
    );
    const ids = Array.from(markup.matchAll(/\sid="([^"]+)"/g), ([, id]) => id);

    expect(ids).toHaveLength(6);
    expect(new Set(ids).size).toBe(ids.length);
    expect(markup.match(/aria-labelledby="[^"]+"/g)).toHaveLength(2);
    expect(markup.match(/marker-end="url\(#[^)]+\)"/g)).toHaveLength(
      diagrams[0].edges.length * 2,
    );
  });

  it("renders the dialog SVG from the explicit compact coordinates", () => {
    const markup = renderToStaticMarkup(
      <ArchitectureDiagram spec={diagrams[0]} />,
    );

    expect(markup).toContain(
      'class="diagram-svg diagram-svg-compact" viewBox="0 0 300 840"',
    );
    expect(markup).toContain('<rect x="24" y="43" width="252"');
  });
});
