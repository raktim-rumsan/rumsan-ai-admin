"use client";

import ChatWidgetInterface from "@/components/sections/widget/chat/ChatWidgetInterface";
import { v4 as uuidv4 } from "uuid";

export default function ChatWidgetPage() {
  console.log("Rendering ChatWidgetPage");
  const id = uuidv4();
   return (
      <ChatWidgetInterface chatId={id} />
  );
}
