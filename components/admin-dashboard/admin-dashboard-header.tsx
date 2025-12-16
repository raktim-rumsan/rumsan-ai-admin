import React from "react";

const AdminDashboardHeader = () => {
  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your RUMSAN AI platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
