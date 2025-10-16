import { Bot, Building2, CreditCard, FolderKanban } from "lucide-react";
import WorkspacesPage from "./workspace";
import AIManagementPage from "./ai-management";
import BillingPage from "./billing";
import OrganizationPage from "./organization";

export const managementCardItem = [
  {
    title: "Organization Management",
    description:
      "Manage your organization settings, branding, and general configuration",
    icon: Building2,
    href: "/dashboard/admin/organization",
    slug: "organization",
    stats: "1 Organization",
    color: "text-primary",
    isAvailable: true,
    component: <OrganizationPage />,
  },
  {
    title: "Workspace Management",
    description:
      "Create and manage workspaces for different teams and projects",
    icon: FolderKanban,
    href: "/admin/workspaces",
    slug: "workspaces",
    stats: "3 Active Workspaces",
    color: "text-accent",
    isAvailable: true,
    component: <WorkspacesPage />,
  },
  {
    title: "Billing & Subscription",
    description:
      "View your subscription plan, usage, and manage payment methods",
    icon: CreditCard,
    href: "/dashboard/admin/billing",
    slug: "ai",
    stats: "Pro Plan Active",
    color: "text-secondary",
    isAvailable: false,
    component: <BillingPage />,
  },
  {
    title: "AI Management",
    description: "Configure AI models, training data, and chatbot behavior",
    icon: Bot,
    href: "/dashboard/admin/ai",
    slug: "billing",
    stats: "2 Models Active",
    color: "text-chart-3",
    isAvailable: false,
    component: <AIManagementPage />,
  },
];
