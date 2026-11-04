import { BookOpen, Skull, Lightbulb, CircleHelp } from "lucide-react";

export const NAVIGATION_CONFIG = [
  { key: "guides", path: "/guide", icon: BookOpen, isContentType: true },
  { key: "killers", path: "/killers", icon: Skull, isContentType: true },
  { key: "tips", path: "/tips", icon: Lightbulb, isContentType: true },
  { key: "faq", path: "/faq", icon: CircleHelp, isContentType: true },
] as const;

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) => item.path.replace(/^\//, ""));
