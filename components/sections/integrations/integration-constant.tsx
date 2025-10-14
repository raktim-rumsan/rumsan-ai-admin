import { EmbedWidget } from "../widget-integration/embed-widget";
import SlackIntegrationGuide from "./slack-instruction-guide";

export const integrationItem = {
  slugsItems: [
    {
      name: "Chat Widget",
      slug: "chat-widget",
      type: "AI Assistant",
      image: "/logos/chat_widget_5.png",
      category: "widget",
      content:
        "Bring intelligent, real-time assistance to your website with the Rumsan AI Chat Widget.",
      isAvailable: true,
      component: <EmbedWidget />,
    },
    {
      name: "Slack",
      slug: "slack",
      type: "Communication",
      image: "/logos/slack_icon.png",
      category: "service",
      content:
        "Keep your team connected with real-time messaging, notifications, and seamless collaboration across all your tools.",
      isAvailable: false,
      component: <SlackIntegrationGuide />,
    },
    {
      name: "WhatsApp",
      slug: "whatsapp",
      type: "Messaging",
      image: "/logos/whatsapp_logo.png",
      category: "service",

      content:
        "Connect your WhatsApp account to enable real-time conversations with customers directly through Rumsan AI.",
      isAvailable: false,
    },
    {
      name: "Messenger",
      slug: "messenger",
      type: "Messaging",
      image: "/logos/messenger_logo.png",
      category: "service",
      content:
        "Integrate your Facebook Messenger to engage users, respond automatically with AI.",
      isAvailable: false,
    },
  ],
};
