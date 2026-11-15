import { newId } from "./id";
import type { FormDef } from "./types";

/** A new, unsaved form. It only reaches the server when the person presses Save. */
export function blankForm(id: string = newId()): FormDef {
  const now = new Date().toISOString();
  return {
    id,
    title: "نموذج جديد",
    description: "",
    version: "1",
    deployed: false,
    createdAt: now,
    updatedAt: now,
    questions: [
      {
        id: newId(),
        type: "note",
        name: "intro",
        label: "تعليمات قصيرة لجامع البيانات قبل بدء الأسئلة.",
      },
      {
        id: newId(),
        type: "text",
        name: "respondent_name",
        label: "الاسم",
        required: true,
      },
    ],
  };
}
