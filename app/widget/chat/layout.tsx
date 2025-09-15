import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";

export default function ChatWidgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <CardHeader className="flex flex-row items-center justify-between space-y-0  p-4 z-10 border-b  bg-emerald-400 sticky top-0">
        <div className="flex justify-center items-center font-semibold text-white">
          Rumsan AI
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Button
            variant="ghost"
            size="icon"
            className="  text-black bg-muted rounded-full  h-8 w-8 "
          >
            <Avatar>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </CardHeader>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
