"use client";
import Prerequisites from "./prerequisite";
import SlackAppSetup from "./slackapp-setup";
import EventSubscription from "./event-subscription";
import BotConfiguration from "./bot-configuration";

export default function SlackIntegrationGuide() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 w-full">
      <div className=" space-y-8">
        <Prerequisites />
        <SlackAppSetup />
        <BotConfiguration />
        <EventSubscription />
      </div>
    </div>
  );
}
