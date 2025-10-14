import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Puzzle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IntegrationContentProps } from "@/types/integration-types";
import { Badge } from "@/components/ui/badge";

export default function IntegrationsContent({
  item,
}: Readonly<IntegrationContentProps>) {
  const router = useRouter();
  return (
    <Card className="relative flex flex-col h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={`${item.name} Logo`}
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
              </div>
              <p className="text-sm text-gray-500">Type: {item.type}</p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
          {item.content}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <Button
            onClick={() => router.push(`integrations/${item.slug}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            disabled={!item.isAvailable}
          >
            <Puzzle className="w-4 h-4 mr-2" />
            Integrate
          </Button>
          {!item.isAvailable && (
            <Badge
              variant="secondary"
              className="gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs font-medium text-amber-700 shadow-sm"
            >
              <Clock className="w-3 h-3" />
              Coming Soon
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
