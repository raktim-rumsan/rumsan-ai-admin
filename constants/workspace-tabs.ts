import { Bot, ExternalLink, FileText, Settings, Users } from "lucide-react";

export const tablist = [
  { name: "General", value: "general", icons: Settings },
  { name: "Members", value: "members", icons: Users },
  { name: "LLM Settings", value: "llm", icons: Bot },
  { name: "Industry Knowledge", value: "knowledgebase", icons: FileText },
  { name: "Integrations", value: "integrations", icons: ExternalLink },
];
