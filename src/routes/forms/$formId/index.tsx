import { createFileRoute } from "@tanstack/react-router";
import { Builder } from "@/components/maydan/builder";

export const Route = createFileRoute("/forms/$formId/")({
  validateSearch: (search: Record<string, unknown>): { new?: boolean } =>
    search.new === true || search.new === "true" || search.new === 1 || search.new === "1" ? { new: true } : {},
  component: FormPage,
});

function FormPage() {
  const { formId } = Route.useParams();
  const { new: isNew } = Route.useSearch();
  return <Builder formId={formId} isNew={Boolean(isNew)} />;
}
