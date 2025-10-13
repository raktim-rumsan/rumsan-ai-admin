import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Puzzle, Settings, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function IntegrationsContent({
  item,
  onRemoveConnection,
}: Readonly<any>) {
  const router = useRouter();
return (
   <Card className="relative">
      <CardContent className="p-6">
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
              <p className="text-sm text-gray-500">Type: Communication</p>
            </div>
          </div>
          <Link href="https://api.slack.com/apps" target="_blank">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Keep your team connected with real-time messaging, notifications, and seamless collaboration across all your
          tools.
        </p>

        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push(`integration-services/${item.slug}?isCreate=true`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            <Puzzle className="w-4 h-4 mr-2" />
            Integrate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
