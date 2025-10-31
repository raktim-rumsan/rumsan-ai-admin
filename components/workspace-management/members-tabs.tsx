"use client";

import { useState } from "react";
import { Plus, Trash2, Mail, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Member } from "@/types/workspace-types";

interface Props {
  members?: Member[];
  setMembers?: (members: Member[]) => void;
}

export default function MembersTab({
  members: initialMembers,
  setMembers: externalSetMembers,
}: Props) {
  const [members, setMembers] = useState<Member[]>(
    initialMembers && initialMembers.length > 0
      ? initialMembers
      : [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "Admin",
            avatar: "/placeholder-user.jpg",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "Member",
            avatar: "/placeholder-user.jpg",
          },
          {
            id: "3",
            name: "Mike Johnson",
            email: "mike@example.com",
            role: "Member",
            avatar: "/placeholder-user.jpg",
          },
          {
            id: "4",
            name: "Sarah Williams",
            email: "sarah@example.com",
            role: "Viewer",
            avatar: "/placeholder-user.jpg",
          },
        ]
  );

  const removeMember = (id: string) => {
    const updatedMembers = members.filter((m) => m.id !== id);
    setMembers(updatedMembers);
    externalSetMembers?.(updatedMembers);
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Workspace Members</CardTitle>
                <CardDescription className="mt-2">
                  Manage who has access to this workspace
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{member.role}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invite Form */}
        <Card>
          <CardHeader>
            <CardTitle>Invite New Member</CardTitle>
            <CardDescription>
              Send an invitation to join this workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="member@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="member">
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-fit">
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
