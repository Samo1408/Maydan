import { createFileRoute } from "@tanstack/react-router";
import { DataView } from "@/components/maydan/data-view";

export const Route = createFileRoute("/forms/$formId/data")({
  component: DataPage,
});

function DataPage() {
  const { formId } = Route.useParams();
  return <DataView formId={formId} />;
}
