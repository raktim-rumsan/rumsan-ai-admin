import React from "react";
import { integrationItem } from "@/components/sections/integrations/integration-constant";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

function AdminIntegrations() {
  const { item, workSpaceSlug } = useParams();
  const selectedItem = integrationItem.slugsItems.find(
    (itm) => itm.slug === item
  );
  return (
    <div className="mb-6 text-sm container mx-auto px-6 mt-4">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/admin/workspaces/${workSpaceSlug}`}>
                  Integrations
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="">
                  <div className="flex items-center gap-2">
                    <Image
                      src={`${selectedItem?.image || "/placeholder.svg"}`}
                      alt={`Slack Logo`}
                      width={20}
                      height={20}
                    />
                    <span className="font-medium text-foreground">
                      {selectedItem?.name}
                    </span>
                  </div>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>{selectedItem?.component}</div>
    </div>
  );
}

export default AdminIntegrations;
