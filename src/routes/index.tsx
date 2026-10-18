import { createFileRoute } from "@tanstack/react-router";
import { Library } from "@/components/maydan/library";

export const Route = createFileRoute("/")({
  component: Library,
});
