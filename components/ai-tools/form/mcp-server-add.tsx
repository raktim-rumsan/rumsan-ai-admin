"use client";

import { useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CommonMcpServerForm } from "./common-mcp-server-form";
import { encryptWithPublicKey } from "@/lib/encrypt";
import {
  useCreateMcpServerMutation,
  useWorkspaceQuery,
  Workspace,
} from "@/queries/workspaceQuery";
import { useParams } from "next/navigation";

export function McpServerAdd({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const { workSpaceSlug } = useParams();
  const { data: workspaceData } = useWorkspaceQuery();
  const currentWorkspace = workspaceData?.data?.myWorkspaces?.find(
    (w: Workspace) => w.slug === workSpaceSlug
  );
  const createMutation = useCreateMcpServerMutation(
    currentWorkspace?.id as string,
    workSpaceSlug as string
  );

  const onSubmit = async (data: any) => {
    const publicKeyPem = process.env.NEXT_PUBLIC_ENCRYPT_KEY;

    // Encrypt each auth value
    const authentication: Record<string, string> = {};
    for (const entry of data.authentication ?? []) {
      if (entry?.key?.trim()) {
        const encryptedValue = await encryptWithPublicKey(
          publicKeyPem!,
          (entry.value ?? "").toString().trim()
        );
        authentication[entry.key.trim()] = encryptedValue;
      }
    }

    const payload = {
      mcpServerId: data.server?.id,
      authentication,
    };

    createMutation.mutate(payload, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add MCP Server To your Workspace</DialogTitle>
          <DialogDescription>
            Select an MCP server to add to your workspace.
          </DialogDescription>
        </DialogHeader>
        <CommonMcpServerForm
          mode="create"
          onSubmit={onSubmit}
          defaultValues={{
            authentication: [],
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
