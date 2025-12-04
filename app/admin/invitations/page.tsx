import NotificationPage from "@/components/accept-invitation/invitation-notification";
import { Suspense } from "react";

function page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          Loading...
        </div>
      }
    >
      <NotificationPage />;
    </Suspense>
  );
}

export default page;
