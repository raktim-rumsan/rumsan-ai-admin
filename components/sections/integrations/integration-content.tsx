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
      <CardContent className="p-4 sm:p-6 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={`${item.name} Logo`}
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
              {item.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Type: {item.type}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed flex-grow">
          {item.content}
        </p>

        {/* Footer Section */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
          <Button
            onClick={() => router.push(`integrations/${item.slug}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 text-sm sm:text-base order-2 sm:order-1"
            disabled={!item.isAvailable}
          >
            <Puzzle className="w-4 h-4 mr-2" />
            Integrate
          </Button>

          {/* Coming Soon Badge */}
          {!item.isAvailable && (
            <Badge
              variant="secondary"
              className="gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs font-medium text-amber-700 shadow-sm order-1 sm:order-2"
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
