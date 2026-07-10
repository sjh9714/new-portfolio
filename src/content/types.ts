export type SourceVerification = "public" | "owner-confirmed";

export type SourceKind =
  | "repository"
  | "commit"
  | "pull-request"
  | "test"
  | "workflow"
  | "release"
  | "deployment"
  | "owner-attestation";

export type SourceRef = {
  id: string;
  kind: SourceKind;
  verification: SourceVerification;
  label: string;
  url?: string;
  repository?: string;
  sha?: string;
  observedAt?: string;
};

type ProjectMediaBase = {
  title: string;
  description: string;
  accent: "blue" | "green" | "rose" | "amber";
};

type ProductPreviewMedia = ProjectMediaBase & {
  kind: "product-preview";
  imageSrc: string;
  imageAlt: string;
};

type StoryTimelineMedia = ProjectMediaBase & {
  kind: "story-timeline";
  eyebrow: string;
  milestones: [
    { label: string; title: string; detail: string },
    { label: string; title: string; detail: string },
  ];
};

type ScopeMapMedia = ProjectMediaBase & {
  kind: "scope-map";
  eyebrow: string;
  stages: { index: string; label: string }[];
  note: string;
};

export type ProjectMedia =
  ProductPreviewMedia | StoryTimelineMedia | ScopeMapMedia;

export type ProjectTimelineItem = {
  label: string;
  title: string;
  body: string;
  sourceIds: string[];
};

export type ProjectStory = {
  slug: string;
  title: string;
  kind:
    "team-product" | "independent-product" | "systems-product" | "public-tool";
  featured: boolean;
  oneLiner: string;
  origin: string;
  audience: string;
  setting: string;
  role: string;
  contributions: string[];
  userJourney: string[];
  timeline: ProjectTimelineItem[];
  turningPoint: string;
  outcomes: string[];
  currentState: string;
  limitations: string[];
  tech: string[];
  sourceIds: string[];
  caseSlugs: string[];
  flowSlugs: string[];
  repoUrl: string;
  demoUrl?: string;
  media: [ProjectMedia, ...ProjectMedia[]];
};

export type EngineeringCase = {
  slug: string;
  projectSlug: string;
  title: string;
  summary: string;
  userImpact: string;
  failureMode: string[];
  constraints: string[];
  decisions: string[];
  tradeoffs: string[];
  verification: string[];
  sourceIds: string[];
  diagramId: string;
  flowSlugs: string[];
  limitations: string[];
};

export type FlowActor = {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  sourceIds: string[];
};

export type FlowStep = {
  id: string;
  title: string;
  narrative: string;
  activeNodeIds: string[];
  activeEdgeIds: string[];
  visibleState: Record<string, string>;
  sourceIds: string[];
};

export type FlowVariant = {
  id: string;
  label: string;
  actors: FlowActor[];
  edges: {
    id: string;
    from: string;
    to: string;
    label: string;
    sourceIds: string[];
  }[];
  steps: FlowStep[];
};

export type FlowPlayback = {
  slug: string;
  projectSlug: string;
  caseSlug: string;
  title: string;
  summary: string;
  initialVariant: string;
  sourceIds: string[];
  variants: FlowVariant[];
};

export type DiagramSpec = {
  id: string;
  title: string;
  caption: string;
  sourceIds: string[];
  nodes: {
    id: string;
    label: string;
    detail: string;
    x: number;
    y: number;
    width: number;
    compact: { x: number; y: number; width: number };
    sourceIds: string[];
    tone?: "default" | "accent" | "success" | "danger";
  }[];
  edges: {
    id: string;
    from: string;
    to: string;
    label: string;
    sourceIds: string[];
  }[];
  mobileSteps: {
    text: string;
    sourceIds: string[];
  }[];
};
