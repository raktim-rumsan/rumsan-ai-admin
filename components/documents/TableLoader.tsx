"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DocumentsTable() {
  return (
    <div className="mt-6 animate-pulse">
      {/* Header */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>DATE</TableHead>
            <TableHead>FILE NAME</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>

        {/* Skeleton Rows */}
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </TableCell>

              <TableCell>
                <div className="h-4 w-64 bg-gray-200 rounded"></div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="h-6 w-10 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
