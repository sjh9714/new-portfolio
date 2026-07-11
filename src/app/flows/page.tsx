import { permanentRedirect } from "next/navigation";

export default function LegacyFlowsPage() {
  permanentRedirect("/projects");
}
