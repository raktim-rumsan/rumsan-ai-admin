import { FileText } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import KnowledgebaseStats from "../workspace-management/knowlege-stats";
import { Doc } from "@/types/workspace-types";

interface Props {
  data: Doc[];
  error: unknown;
}

export default function KnowledgebaseData({ data, error }: Props) {
  const isError = Boolean(error);

  return (
    <div className="space-y-6">
      <Card className={isError ? "border-red-300 bg-red-50" : ""}>
        <CardHeader>
          <CardTitle className={isError ? "text-red-600" : ""}>
            {isError
              ? "Failed to Load Knowledgebase"
              : "Industry Knowledgebase"}
          </CardTitle>

          <CardDescription>
            {isError
              ? "There was an error fetching knowledgebase data."
              : "Manage industry knowledge that the AI can reference."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isError ? (
            <p className="text-sm text-red-500 font-medium">
              {(error as Error).message}
            </p>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="rounded-lg bg-muted p-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{doc.fileName}</p>

                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-muted-foreground capitalize">
                          {doc.industry}
                        </p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                          Uploaded{" "}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isError && data.length > 0 && (
        <KnowledgebaseStats knowledgebase={data} />
      )}
    </div>
  );
}
