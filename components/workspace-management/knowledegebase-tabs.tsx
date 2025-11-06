// "use client";

// import { Plus, FileText, ChevronsUpDown, Check } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Doc } from "@/types/workspace-types";
// import KnowledgebaseStats from "./knowlege-stats";
// import { useState } from "react";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Command, CommandGroup, CommandItem } from "../ui/command";
// import { INDUSTRY_OPTIONS } from "@/constants/industry";
// import { cn } from "@/lib/utils";
// import { useKnowledgebaseQuery } from "@/queries/documentsQuery";

// interface Props {
//   knowledgebase?: Doc[];
//   setKnowledgebase?: (docs: Doc[]) => void;
// }

// export default function KnowledgebaseTab({
//   knowledgebase: initialKnowledgebase,
//   setKnowledgebase: externalSetKnowledgebase,
// }: Props) {
//   const [knowledgebase, setKnowledgebase] = useState<Doc[]>(
//     initialKnowledgebase && initialKnowledgebase.length > 0
//       ? initialKnowledgebase
//       : [
//           {
//             id: "1",
//             name: "Product Guide 2024",
//             size: "2.4 MB",
//             uploadedAt: "2024-01-15",
//             enabled: true,
//           },
//           {
//             id: "2",
//             name: "Customer FAQ",
//             size: "1.8 MB",
//             uploadedAt: "2024-01-20",
//             enabled: true,
//           },
//           {
//             id: "3",
//             name: "Banking Policies",
//             size: "3.2 MB",
//             uploadedAt: "2024-02-01",
//             enabled: false,
//           },
//           {
//             id: "4",
//             name: "Compliance Guidelines",
//             size: "4.1 MB",
//             uploadedAt: "2024-02-10",
//             enabled: true,
//           },
//           {
//             id: "5",
//             name: "Training Manual",
//             size: "5.3 MB",
//             uploadedAt: "2024-02-15",
//             enabled: false,
//           },
//         ]
//   );
//   const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
//   const { data: fetchedDocs = [], isLoading, error } = useKnowledgebaseQuery(selectedIndustries);



//   const toggleKnowledgebase = (id: string) => {
//     const updatedDocs = knowledgebase.map((doc) =>
//       doc.id === id ? { ...doc, enabled: !doc.enabled } : doc
//     );
//     setKnowledgebase(updatedDocs);
//     externalSetKnowledgebase?.(updatedDocs);
//   };
// const toggleIndustry = (industry: string) => {
//   setSelectedIndustries((prev) =>
//     prev.includes(industry)
//       ? prev.filter((i) => i !== industry)
//       : [...prev, industry]
//   );
// };

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Industry Knowledgebase</CardTitle>
//               <CardDescription className="mt-2">
//                 Manage industry knowledge that the AI can reference.
//               </CardDescription>
//             </div>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     role="combobox"
//                     className="w-[240px] justify-between"
//                   >
//                     {selectedIndustries.length > 0
//                       ? `${selectedIndustries.length} selected`
//                       : "Select industries..."}
//                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[240px] p-0">
//                   <Command>
//                     <CommandGroup>
//                       {INDUSTRY_OPTIONS.map(({ label, value }) => (
//                 <CommandItem
//                   key={value}
//                   onSelect={() => toggleIndustry(value)}
//                 >
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       selectedIndustries.includes(value)
//                         ? "opacity-100"
//                         : "opacity-0"
//                     )}
//                   />
//                   {label}
//                 </CommandItem>
//               ))}
//                     </CommandGroup>
//                   </Command>
//                 </PopoverContent>
//               </Popover>

//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {knowledgebase.map((doc) => (
//               <div
//                 key={doc.id}
//                 className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
//               >
//                 <div className="flex items-center gap-4 flex-1">
//                   <div className="rounded-lg bg-muted p-3">
//                     <FileText className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium">{doc.name}</p>
//                     <div className="flex items-center gap-3 mt-1">
//                       <p className="text-sm text-muted-foreground">
//                         {doc.size}
//                       </p>
//                       <span className="text-muted-foreground">•</span>
//                       <p className="text-sm text-muted-foreground">
//                         Uploaded {doc.uploadedAt}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <Switch
//                       checked={doc.enabled}
//                       onCheckedChange={() => toggleKnowledgebase(doc.id)}
//                     />
//                     <Label className="text-sm">
//                       {doc.enabled ? "Active" : "Inactive"}
//                     </Label>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {knowledgebase.length === 0 && (
//             <div className="text-center py-12 text-muted-foreground">
//               <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
//               <p>No documents uploaded yet</p>
//               <p className="text-sm mt-1">
//                 Upload PDF documents to build your AI knowledgebase
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//       <KnowledgebaseStats knowledgebase={knowledgebase} />
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { FileText, ChevronsUpDown, Check } from "lucide-react";
import { useKnowledgebaseQuery } from "@/queries/documentsQuery";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { INDUSTRY_OPTIONS } from "@/constants/industry";
import { cn } from "@/lib/utils";
import KnowledgebaseStats from "./knowlege-stats";
import { Doc } from "@/types/workspace-types";

interface Props {
  knowledgebase?: Doc[];
  setKnowledgebase?: (docs: Doc[]) => void;
}

export default function KnowledgebaseTab({
  knowledgebase: initialKnowledgebase,
  setKnowledgebase: externalSetKnowledgebase,
}: Props) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const { data: fetchedDocs = [], isLoading, error } = useKnowledgebaseQuery(selectedIndustries);
  console.log("Fetched Docs:", fetchedDocs);
  const [knowledgebase, setKnowledgebase] = useState<Doc[]>([]);
  console.log("Knowledgebase State:", knowledgebase.map(doc => doc.createdAt));

  useEffect(() => {
    setKnowledgebase(fetchedDocs);
    externalSetKnowledgebase?.(fetchedDocs);
  }, [fetchedDocs, externalSetKnowledgebase]);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  if (isLoading) {
    return <p>Loading documents...</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load documents: {(error as Error).message}</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Industry Knowledgebase</CardTitle>
              <CardDescription className="mt-2">
                Manage industry knowledge that the AI can reference.
              </CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[240px] justify-between"
                >
                  {selectedIndustries.length > 0
                    ? `${selectedIndustries.length} selected`
                    : "Select industries"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px] p-0">
                <Command>
                  <CommandGroup>
                    {INDUSTRY_OPTIONS.map(({ label, value }) => (
                      <CommandItem key={value} onSelect={() => toggleIndustry(value)}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedIndustries.includes(value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {knowledgebase.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet</p>
                <p className="text-sm mt-1">
                  Upload PDF documents to build your AI knowledgebase
                </p>
              </div>
            ) : (
              knowledgebase.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="rounded-lg bg-muted p-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{doc.fileName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-muted-foreground">
                            {doc.industry.charAt(0).toUpperCase() + doc.industry.slice(1)}
                          </p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                         Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch />
                      
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <KnowledgebaseStats knowledgebase={knowledgebase} />
    </div>
  );
}

