"use client";

import {
  HelpCircle,
  BookOpen,
  Settings,
  Users,
  Globe,
  MessageSquare,
  Slack,
  CreditCard,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SupportPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="mx-auto px-6 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <HelpCircle className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Rumsan Chatty Support
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Welcome to the Rumsan Chatty Support Center.
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mt-4 leading-relaxed">
              This page provides guides, documentation, and answers to help you
              set up, manage, and use Rumsan Chatty effectively.
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mt-2 leading-relaxed">
              Whether you are launching your first AI chatbot or managing
              multiple workspaces, you&apos;ll find everything you need here.
            </p>
          </div>

          {/* Support Content */}
          <Card className="mb-8">
            <CardContent className="pt-6 space-y-8">
              {/* Getting Started Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Getting Started</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      What is Rumsan Chatty?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Rumsan Chatty is an AI-powered chatbot and agent platform
                      that helps organizations provide accurate, consistent, and
                      secure responses using their documents and knowledge
                      sources.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Chatty can be deployed across websites and communication
                      channels such as Slack, WhatsApp and Messenger, enabling
                      teams to automate support, internal knowledge access, and
                      customer engagement.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Quick Start Guide
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Create your workspace</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Upload documents to build your resources</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Customize your chatbot</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Deploy Chatty on your preferred channel</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Monitor usage and improve responses over time
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Using Rumsan Chatty Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    Using Rumsan Chatty
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      Managing Workspaces
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Create workspaces for teams or departments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Invite members and assign roles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Maintain separate resources per workspace</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Manage multiple chatbots independently</span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      Uploading & Managing Knowledge
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Upload PDFs, documents, and text files</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Update or replace documents anytime</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Reupload or retrain the chatbot when content changes
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Ensure responses stay accurate and up to date
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      Chatbot Customization
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Customize chatbot name and branding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Adjust widget colors and layout</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Add organization and workspace logos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Configure chatbot behavior and tone</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Roles & Access Control Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    Roles & Access Control
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Rumsan Chatty supports role-based access to ensure data
                  security and accountability.
                </p>
                <div className="space-y-3 mt-4">
                  <div>
                    <h4 className="font-semibold mb-1">Admins:</h4>
                    <p className="text-muted-foreground">
                      Manage workspaces, users, and settings
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Members:</h4>
                    <p className="text-muted-foreground">
                      Upload documents and manage chatbot content
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Viewers:</h4>
                    <p className="text-muted-foreground">
                      Interact with the chatbot without editing access
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Integrations & Deployment Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    Integrations & Deployment
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        Website Integration
                      </h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Embed Chatty using a simple script</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Customize widget appearance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Works with modern websites and web apps</span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        WhatsApp Integration
                      </h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Deploy Chatty on WhatsApp for customer or community
                          support
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Enable automated responses using your knowledge base
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Ideal for enterprises, NGOs, and service-oriented
                          organizations
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Slack className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        Slack Integration
                      </h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Add Chatty to Slack for internal knowledge access
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Enable teams to query documents directly in Slack
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Improve productivity and reduce internal support
                          requests
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Billing & Plans Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Billing & Plans</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Rumsan Chatty is available in multiple plans designed for
                  organizations of different sizes.
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Starter:</h4>
                    <p className="text-muted-foreground">
                      Single chatbot for a team or department
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Professional:</h4>
                    <p className="text-muted-foreground">
                      Multiple chatbots for different teams
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Enterprise:</h4>
                    <p className="text-muted-foreground">
                      Organization-wide deployment with governance controls
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">
                    For detailed pricing or custom requirements, please contact
                    our sales team at{" "}
                    <a
                      href="mailto:team@rumsan.com"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <Mail className="w-4 h-4" />
                      team@rumsan.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
