"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function SlackIntegrationGuide() {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<"channel" | "events">("channel");

  return (
    // <div>
    //   {/* Main Content */}
    //   <div className="flex items-start gap-8">
    //     {/* Slack Logo Card */}
    //     <Card className="flex h-[200px] w-[200px] shrink-0 items-center justify-center border border-border bg-white shadow-sm">
    //       <Image
    //         src={"/logos/slack_icon.png"}
    //         alt={`Slack Logo`}
    //         width={100}
    //         height={100}
    //         className="w-24 h-24 sm:w-32 sm:h-32"
    //       />
    //     </Card>

    //     {/* Content Section */}
    //     <div className="flex flex-col gap-6">
    //       <div>
    //         <h1 className="mb-3 text-3xl font-semibold text-foreground">
    //           Slack
    //         </h1>
    //         <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
    //           Connect your Slack account with Kommunicate to receive updates
    //           about your messages
    //         </p>
    //       </div>

    //       <Button
    //         className="w-fit bg-[#5b47db] px-6 py-2.5 text-white hover:bg-[#4c3bc2]"
    //         size="lg"
    //         onClick={() => setIsConnected(true)}
    //       >
    //         Connect to Slack
    //       </Button>
    //     </div>
    //     {isConnected && (
    //       <div className="flex flex-col gap-6">
    //         {/* Tabs */}
    //         <div className="flex gap-8 border-b border-gray-200">
    //           <button
    //             onClick={() => setActiveTab("channel")}
    //             className={`relative pb-3 text-sm font-medium transition-colors ${
    //               activeTab === "channel"
    //                 ? "text-[#5b47db]"
    //                 : "text-muted-foreground hover:text-foreground"
    //             }`}
    //           >
    //             Channel
    //             {activeTab === "channel" && (
    //               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5b47db]" />
    //             )}
    //           </button>
    //           <button
    //             onClick={() => setActiveTab("events")}
    //             className={`relative pb-3 text-sm font-medium transition-colors ${
    //               activeTab === "events"
    //                 ? "text-[#5b47db]"
    //                 : "text-muted-foreground hover:text-foreground"
    //             }`}
    //           >
    //             Events
    //             {activeTab === "events" && (
    //               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5b47db]" />
    //             )}
    //           </button>
    //         </div>

    //         {/* Channel Tab Content */}
    //         {activeTab === "channel" && (
    //           <div className="flex flex-col gap-6">
    //             <h2 className="text-lg font-semibold text-foreground">
    //               Add Kommunicate to Slack Public Channels
    //             </h2>

    //             {/* Search Input */}
    //             <div className="relative max-w-md">
    //               <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
    //               <Input
    //                 placeholder="Search channel"
    //                 className="pl-10 text-base"
    //               />
    //             </div>

    //             {/* Selected Channels */}
    //             <div className="flex flex-col gap-4">
    //               <h3 className="text-base font-semibold text-foreground">
    //                 Selected Channels
    //               </h3>
    //               <p className="text-sm text-muted-foreground">
    //                 No Channel Selected
    //               </p>
    //             </div>
    //           </div>
    //         )}

    //         {/* Events Tab Content */}
    //         {activeTab === "events" && (
    //           <div className="flex flex-col gap-6">
    //             <p className="text-muted-foreground">
    //               Events configuration will appear here
    //             </p>
    //           </div>
    //         )}
    //       </div>
    //     )}
    //   </div>
    // </div>

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

        {isConnected && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Integrated
              </span>
              <Switch
                checked={true}
                className="data-[state=checked]:bg-[#5b47db]"
              />
            </div>

            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <h1 className="mb-3 text-3xl font-semibold text-foreground">Slack</h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Connect your Slack account with Kommunicate to receive updates about
            your messages
          </p>
        </div>

        <Button
          className="w-fit bg-[#5b47db] px-6 py-2.5 text-white hover:bg-[#4c3bc2] disabled:bg-gray-300 disabled:text-gray-500"
          size="lg"
          onClick={() => setIsConnected(true)}
          disabled={isConnected}
        >
          Connect to Slack
        </Button>

        {isConnected && (
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
              <button
                onClick={() => setActiveTab("events")}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  activeTab === "events"
                    ? "text-[#5b47db]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Events
                {activeTab === "events" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5b47db]" />
                )}
              </button>
            </div>

            {/* Channel Tab Content */}
            {activeTab === "channel" && (
              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Add Kommunicate to Slack Public Channels
                </h2>

                {/* Search Input */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search channel"
                    className="pl-10 text-base"
                  />
                </div>

                {/* Selected Channels */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold text-foreground">
                    Selected Channels
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No Channel Selected
                  </p>
                </div>
              </div>
            )}

            {/* Events Tab Content */}
            {activeTab === "events" && (
              <div className="flex flex-col gap-6">
                <p className="text-muted-foreground">
                  Events configuration will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
