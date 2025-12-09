"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen, Bot, Plug, User, Factory } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getBackendFileUrl,
  useOrganizationById,
} from "@/queries/organizationQuery";
import Image from "next/image";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    title: "My Resources",
    icon: FolderOpen,
    slug: "/documents",
  },
  {
    title: "Prompt Management",
    icon: Bot,
    slug: "/agent-preview",
  },
  {
    title: "Team Management",
    icon: User,
    slug: "/team-management",
  },
  {
    title: "Industry Knowledge",
    icon: Factory,
    slug: "/industry-knowledge",
  },
  {
    title: "Integrations",
    icon: Plug,
    slug: "/integrations",
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: organization } = useOrganizationById();
  const orgUrl = organization?.data?.url;
  const pathname = usePathname();

  // Filter navigation items based on workspace type
  const filteredNavigationItems = navigationItems.filter((item) => {
    return true;
  });
  const workspaceSlug = pathname.split("/")[3];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0", // Always visible on desktop
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" // Mobile: show when open, Desktop: always show
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-4 py-4 border-b border-gray-200">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">
                  Rumsan AI
                </h1>
                <p className="text-xs text-gray-500">v1.0.0</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {filteredNavigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={`/dashboard/workspace/${workspaceSlug}/${item.slug}`}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.slug
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="mt-auto w-full px-4 pb-6 flex justify-center">
            {orgUrl ? (
              <Image
                width={500}
                height={500}
                src={getBackendFileUrl(orgUrl)!}
                alt="Organization Logo"
                className="w-full h-auto object-contain rounded-md"
              />
            ) : (
              <span className="text-gray-500 text-sm font-medium">
                No image uploaded
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
