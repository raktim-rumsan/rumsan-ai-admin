"use client";

import {
  Shield,
  FileText,
  Eye,
  CheckCircle,
  Database,
  Clock,
  Key,
  Users,
  AlertTriangle,
  Scale,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="mx-auto px-6 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <h1 className="text-xl md:text-3xl font-bold text-foreground">
                Rumsan Chatty – Privacy & Data Protection Policy
              </h1>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Version: 1.0</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Effective Date: 20-12-2025</span>
              </div>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mt-6 leading-relaxed">
              Applies To: Rumsan Chatty (AI Chatbot & AI Agent Platform)
            </p>
          </div>

          {/* All Content in Single Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">
                  Privacy & Data Protection Policy
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Overview Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Overview</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  The purpose of this policy is to maintain the privacy of and
                  protect personal and organizational information processed
                  through Rumsan Chatty, an AI-powered knowledge assistant
                  developed and operated by Rumsan Associates Private Limited
                  (hereafter referred to as &quot;Rumsan&quot; or &quot;the
                  organization&quot;).
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Rumsan Chatty is designed to help organizations securely
                  access and use their own knowledge. This policy ensures that
                  information processed through Chatty is handled responsibly,
                  transparently, and in alignment with legal, contractual, and
                  business requirements.
                </p>
              </div>

              <Separator />

              {/* Scope Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Scope</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  This policy applies to:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>All organizations using Rumsan Chatty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>All end users interacting with Chatty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      All Rumsan employees, contractors, vendors, interns,
                      associates, and partners who may access or manage Chatty
                      data
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      This policy applies regardless of geographic location
                    </span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  All Rumsan personnel and Third Parties are expected to
                  understand and comply with this policy when collecting,
                  accessing, processing, storing, or disposing of personal
                  information through Rumsan Chatty.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  No Third Party may access personal information processed
                  through Chatty without first entering into an appropriate
                  confidentiality or data protection agreement.
                </p>
              </div>

              <Separator />

              {/* Data Privacy Principles Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    Data Privacy Principles
                  </h2>
                </div>
                <div className="space-y-6">
                  {/* Notice */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">Notice</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Rumsan shall provide clear and accessible notice to data
                      subjects regarding how personal information is collected,
                      used, retained, and disclosed through Rumsan Chatty.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Privacy notices shall be:
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-3">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Available before or at the time of data collection
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Clearly displayed on websites, applications, or
                          platforms where Chatty is deployed
                        </span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Privacy notices may include:
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-3">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Types of personal information processed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Purpose of processing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Data retention practices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Disclosure to Third Parties (if any)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Security measures in place</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Contact details for privacy inquiries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Consequences of not providing requested information
                        </span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      In cases of cross-border data transfer, data subjects
                      shall be informed in advance.
                    </p>
                  </div>

                  <Separator />

                  {/* Choice and Consent */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        Choice and Consent
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Rumsan shall provide data subjects with appropriate
                      choices and obtain consent where required for the
                      collection and use of personal information through Rumsan
                      Chatty.
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Consent may be obtained through user interaction,
                          contractual agreements, or written/electronic consent
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Consent and withdrawal of consent shall be documented
                          where applicable
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Personal information shall not be used for purposes
                          beyond those identified without obtaining additional
                          consent
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Personal information shall not be used for marketing
                          or profiling unless explicitly agreed
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  {/* Collection of Personal Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        Collection of Personal Information
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Rumsan Chatty shall collect personal information only:
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          For purposes identified in the privacy notice or
                          contractual agreements
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          To provide the intended Chatty functionality
                        </span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Personal information shall be collected only when:
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Valid consent has been provided; or</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Processing is necessary for contractual performance;
                          or
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Processing is required by legal obligation; or
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Processing is necessary to protect vital interests; or
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Processing is required in the public interest
                        </span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Rumsan Chatty does not intentionally collect sensitive
                      personal information and does not require personal data to
                      function.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Any new electronic data collection method shall be
                      reviewed and approved by the IT Security team.
                    </p>
                  </div>

                  <Separator />

                  {/* Use, Retention, and Disposal */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        Use, Retention, and Disposal
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Personal information processed through Rumsan Chatty
                      shall:
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Be used only for the purpose for which it was
                          collected
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Be retained only as long as necessary to meet
                          business, legal, or contractual requirements
                        </span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Once no longer required, personal information shall be:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Securely deleted</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Anonymized</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Or returned to the client organization, as applicable
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  {/* Access */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Key className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">Access</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Rumsan shall provide mechanisms that allow data subjects
                      to:
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-3">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Access their personal information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Request correction or updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Request deletion or restriction, where legally
                          permitted
                        </span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      Personal information shall be provided in a clear and
                      understandable format upon written request.
                    </p>
                  </div>

                  <Separator />

                  {/* Disclosure to Third Parties */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        Disclosure to Third Parties
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Rumsan shall disclose personal information to Third
                      Parties only:
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-3">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          For purposes identified in the privacy notice or
                          contract
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          With appropriate contractual, confidentiality, and
                          data protection safeguards in place
                        </span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Third Parties must sign a Non-Disclosure Agreement (NDA)
                      or equivalent agreement before accessing personal
                      information processed through Chatty.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Rumsan does not sell or reuse personal information across
                      clients.
                    </p>
                  </div>

                  <Separator />

                  {/* Security for Privacy */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        Security for Privacy
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Rumsan shall protect personal information processed
                      through Chatty against unauthorized access, misuse, loss,
                      or disclosure by implementing appropriate technical and
                      organizational safeguards.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Any individual becoming aware of a privacy or data
                      security incident shall notify us immediately at:{" "}
                      <a
                        href="mailto:team@rumsan.com"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4" />
                        team@rumsan.com
                      </a>
                    </p>
                  </div>

                  <Separator />

                  {/* Monitoring and Enforcement */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        Monitoring and Enforcement
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Rumsan shall monitor compliance with this policy
                      internally and with Third Parties.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Any violations may result in corrective action, including
                      access revocation, contractual remedies, or disciplinary
                      action, in line with Rumsan Incident Reporting Guidelines.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dispute Resolution Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Dispute Resolution</h2>
                </div>
                <div className="space-y-6">
                  {/* For Employees */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      Dispute Resolution and Escalation Process for Employees
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Employees with inquiries or complaints regarding personal
                      information processed through Chatty shall:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Raise the matter with their immediate supervisor
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  {/* For Customers/Third Parties */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      Dispute Resolution & Escalation Process for Customer/Third
                      Parties
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Customers or Third Parties with privacy-related inquiries
                      or complaints shall submit them in writing to the
                      designated Point of Contact and copy at{" "}
                      <a
                        href="mailto:team@rumsan.com"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4" />
                        team@rumsan.com
                      </a>
                      .
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Disputes involving non-employees may be resolved through
                      arbitration, as agreed contractually.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Glossary Section */}
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">Glossary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Data Subject:</h4>
                  <p className="text-muted-foreground">
                    An individual whose personal information is processed.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Personal Data / PII:</h4>
                  <p className="text-muted-foreground">
                    Any information that can identify or reasonably be linked to
                    an individual.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    Sensitive Personal Information:
                  </h4>
                  <p className="text-muted-foreground">
                    Includes financial, health, biometric, political, or similar
                    sensitive data.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Third Party:</h4>
                  <p className="text-muted-foreground">
                    Any external entity with access to Rumsan systems or
                    information.
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
