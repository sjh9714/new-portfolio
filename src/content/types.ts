export type SourceVerification = "public" | "owner-confirmed";

export type SourceUsage = "context" | "technical-proof";

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
  usage: SourceUsage;
  label: string;
  url?: string;
  repository?: string;
  sha?: string;
  observedAt?: string;
};

export type VisualAsset = {
  id: string;
  kind: "product-screen" | "storyboard" | "decision-map" | "deployment-map";
  src: string;
  alt: string;
  caption: string;
  transcript: string[];
  sourceIds: string[];
  width: number;
  height: number;
};

export type StoryChapter = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  body: string[];
  sourceIds: string[];
  visualIds?: string[];
  proofId?: string;
};

export type GuidedFlowStep = {
  id: string;
  title: string;
  body: string;
  state: string;
  visualId?: string;
  sourceIds: string[];
};

export type GuidedFlowVariant = {
  id: string;
  label: string;
  steps: GuidedFlowStep[];
};

export type GuidedFlow = {
  id: string;
  title: string;
  summary: string;
  initialVariant: string;
  variants: GuidedFlowVariant[];
};

type ProjectOverview = {
  context: string;
  role: string;
  turningPoint: string;
  proof: string;
  primaryProofId: string;
};

type ProjectStoryBase = {
  slug: string;
  title: string;
  featuredOrder: number;
  oneLiner: string;
  period: string;
  overview: ProjectOverview;
  visualIds: string[];
  tech: string[];
  sourceIds: string[];
  limitations: string[];
  repoUrl: string;
};

export type TeamProjectStory = ProjectStoryBase & {
  kind: "team-product";
  context: string;
  duration: string;
  team: string;
  role: string;
  collaboration: string[];
  shippedOutcome: string[];
  chapters: StoryChapter[];
  revisit?: StoryChapter[];
  guidedFlows?: GuidedFlow[];
};

export type ProductizedSystemStory = ProjectStoryBase & {
  kind: "productized-system";
  hypothesis: string;
  acceptanceCriteria: string[];
  userJourney: string[];
  milestones: StoryChapter[];
  guidedFlows: GuidedFlow[];
};

export type ProjectStory = TeamProjectStory | ProductizedSystemStory;
