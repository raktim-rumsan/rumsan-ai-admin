import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/types/workspace-types";

interface Props {
  knowledgebase: Doc[];
}

export default function KnowledgebaseStats({ knowledgebase }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Total Documents</CardDescription>
          <CardTitle>{knowledgebase.length}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Active Documents</CardDescription>
          <CardTitle>{knowledgebase.filter((d) => d.enabled).length}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Total Size</CardDescription>
          <CardTitle>16.8 MB</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
