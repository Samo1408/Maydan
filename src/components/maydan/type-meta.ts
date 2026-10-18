import {
  AlignLeft,
  CalendarDays,
  Camera,
  CheckSquare,
  Clock,
  Hash,
  List,
  ListChecks,
  MapPin,
  Sigma,
  Star,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import type { QuestionType } from "@/lib/maydan/types";

export const TYPE_META: Record<QuestionType, { label: string; icon: LucideIcon }> = {
  text: { label: "نص", icon: AlignLeft },
  integer: { label: "عدد صحيح", icon: Hash },
  decimal: { label: "عدد عشري", icon: Sigma },
  select_one: { label: "اختيار واحد", icon: List },
  select_multiple: { label: "اختيار متعدد", icon: ListChecks },
  note: { label: "ملاحظة", icon: StickyNote },
  date: { label: "تاريخ", icon: CalendarDays },
  time: { label: "وقت", icon: Clock },
  geopoint: { label: "موقع", icon: MapPin },
  image: { label: "صورة", icon: Camera },
  acknowledge: { label: "إقرار", icon: CheckSquare },
  rating: { label: "تقييم", icon: Star },
};
