"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  useInstallSlackChannel,
  useSlackChannels,
  useSlackOAuthInstall,
  useSlackWorkspaceByIdentifier,
  useToggleSlackWorkspace,
  useUninstallSlackWorkspace,
} from "@/queries/slackQuery";
import { useParams } from "next/navigation";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SlackIntegrationGuide() {
  const [activeTab, setActiveTab] = useState<"channel" | "events">("channel");
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");

  const { workSpaceSlug }: { workSpaceSlug: string } = useParams();

  const { data: workspaceData } = useWorkspaceQuery();

  const currentWorkspace = workspaceData?.data?.myWorkspaces?.find(
    (w) => w.slug === workSpaceSlug
  );
  const { data: slackChannels } = useSlackChannels(
    currentWorkspace?.id as string,
    workSpaceSlug!
  );
  const { data: workspaceStatus } = useSlackWorkspaceByIdentifier(
    currentWorkspace?.id as string
  );

  const { mutate: installSlackOAuth } = useSlackOAuthInstall(workSpaceSlug);

  const { mutate: toggleSlackWorkspace } =
    useToggleSlackWorkspace(workSpaceSlug);

  const { mutate: removeSlackWorkspace } =
    useUninstallSlackWorkspace(workSpaceSlug);

  const { mutate: installSlackChannel, isPending } =
    useInstallSlackChannel(workSpaceSlug);

  const connectedChannels = slackChannels?.filter((ch) => ch.is_member);
  const availableChannels = slackChannels?.filter((ch) => !ch.is_member);

  const handleInstallSlack = () => {
    installSlackOAuth(currentWorkspace?.id, {
      onSuccess: (data) => {
        if (data && data.installUrl) {
          window.location.href = data.installUrl;
          // window.open(data.installUrl, "_blank", "noopener,noreferrer");
        }
      },
    });
  };
  const handleConnectChannel = () => {
    installSlackChannel(
      {
        workspaceId: currentWorkspace?.id!,
        channelId: selectedChannelId,
      },
      {
        onSuccess: () => {
          setSelectedChannelId("");
        },
      }
    );
  };

  return (
    <div className="flex items-start gap-8">
      {/* Left Sidebar */}
      <div className="flex w-[200px] shrink-0 flex-col gap-6">
        {/* Slack Logo Card */}
        <Card className="flex h-[200px] w-[200px] items-center justify-center border border-border bg-white shadow-sm">
          <Image
            src="/logos/slack_icon.png"
            alt="Slack Logo"
            width={100}
            height={100}
            className="h-24 w-24 sm:h-32 sm:w-32"
          />
        </Card>

        <>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Integrated
            </span>
            <Switch
              onCheckedChange={() =>
                toggleSlackWorkspace(currentWorkspace?.id!)
              }
              checked={workspaceStatus?.status}
              className="data-[state=checked]:bg-[#5b47db] cursor-pointer"
            />
          </div>

          <Button
            onClick={() => removeSlackWorkspace(currentWorkspace?.id!)}
            variant="outline"
            className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <h1 className="mb-3 text-3xl font-semibold text-foreground">Slack</h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Connect your Slack account with Bot to receive updates about your
            messages
          </p>
        </div>

        <Button
          className="w-fit bg-[#5b47db] px-6 py-2.5 text-white hover:bg-[#4c3bc2] disabled:bg-gray-300 disabled:text-gray-500"
          size="lg"
          onClick={() => {
            handleInstallSlack();
          }}
        >
          Connect to Slack
        </Button>

        <div className="flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("channel")}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                activeTab === "channel"
                  ? "text-[#5b47db]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Channel
              {activeTab === "channel" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5b47db]" />
              )}
            </button>
          </div>

          {/* Channel Tab Content */}
          {activeTab === "channel" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-0">
                <h2 className="text-lg font-semibold text-foreground">
                  Add Bot to Slack Public Channels
                </h2>
                <div className="text-sm text-muted-foreground">
                  For private channels, please invite the bot manually.
                </div>
              </div>
              {/* Connected Channels */}
              {connectedChannels && connectedChannels.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2">
                  {connectedChannels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5"
                    >
                      <span className="text-sm font-medium text-foreground">
                        # {channel.name}
                      </span>
                      <button
                        // onClick={() => handleDisconnectChannel(channel.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Channel Select and Connect Button */}
              <div className="flex items-center gap-3 max-w-md">
                <Select
                  value={selectedChannelId}
                  onValueChange={setSelectedChannelId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableChannels?.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        # {channel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleConnectChannel}
                  disabled={!selectedChannelId}
                  className="bg-[#5b47db] text-white hover:bg-[#4c3bc2] disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Connecting
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
