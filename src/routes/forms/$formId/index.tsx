import { createFileRoute } from "@tanstack/react-router";
import { Builder } from "@/components/maydan/builder";

export const Route = createFileRoute("/forms/$formId/")({
  component: FormPage,
});

function FormPage() {
  const { formId } = Route.useParams();
  return <Builder formId={formId} />;
}
