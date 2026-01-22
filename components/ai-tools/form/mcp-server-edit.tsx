"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CommonMcpServerForm } from "./common-mcp-server-form";
import { encryptWithPublicKey } from "@/lib/encrypt";
import { toastUtils } from "@/lib/toast-utils";
import {
  useUpdateMcpServerMutation,
  useWorkspaceQuery,
  Workspace,
} from "@/queries/workspaceQuery";
import { WorkspaceMcpServer } from "@/types/ai";
import { useParams } from "next/navigation";

interface EditProps {
  server: WorkspaceMcpServer;
  isOpen: boolean;
  onClose: () => void;
}

export function McpServerEdit({ server, isOpen, onClose }: EditProps) {
  const { workSpaceSlug } = useParams();
  const { data: workspaceData } = useWorkspaceQuery();
  const currentWorkspace = workspaceData?.data?.myWorkspaces?.find(
    (w: Workspace) => w.slug === workSpaceSlug,
  );
  const updateMutation = useUpdateMcpServerMutation(
    currentWorkspace?.id as string,
    currentWorkspace?.slug as string,
  );
  const onSubmit = async (data: any) => {
    const publicKeyPem = process.env.NEXT_PUBLIC_ENCRYPT_KEY;

    const authentication: Record<string, string> = {};

    for (const entry of data.authentication ?? []) {
      if (!entry?.key?.trim()) continue;

      const key = entry.key.trim();
      const value = String(entry.value ?? "").trim();

      if (entry.isEncrypted) {
        authentication[key] = value;
      } else {
        try {
          authentication[key] = await encryptWithPublicKey(
            publicKeyPem!,
            value,
          );
        } catch (error) {
          // Only show encryption errors
          toastUtils.generic.error(
            `Failed to encrypt "${key}". Please check the value.`,
          );
          return;
        }
      }
    }

    updateMutation.mutate(
      {
        serverId: server.id,
        authentication, //encrypted-only payload
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl flex flex-col max-h-[85vh] min-h-0">
        <DialogHeader>
          <DialogTitle>Edit MCP Server Authentication</DialogTitle>
          <DialogDescription>
            Update the authentication credentials for KYC Verification API. As a
            workspace admin, you can provide your own API keys.
          </DialogDescription>
        </DialogHeader>

        <CommonMcpServerForm
          mode="edit-auth"
          onSubmit={onSubmit}
          onCancel={onClose}
          defaultValues={{
            server: server.mcpServer,
            authentication: server.authentication
              ? Object.entries(server.authentication).map(([key, value]) => ({
                  key,
                  value: String(value),
                  show: false,
                  isEncrypted: true,
                }))
              : [],
          }}
          isPending={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
