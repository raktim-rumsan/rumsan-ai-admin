// Example of how to use Sonner toasts throughout the application

import { toast } from "sonner";

export function ExampleToastUsage() {
  const showSuccessToast = () => {
    toast.success("Operation completed!", {
      description: "Your action was completed successfully.",
      duration: 4000,
    });
  };

  const showErrorToast = () => {
    toast.error("Operation failed", {
      description: "Something went wrong. Please try again.",
      duration: 5000,
    });
  };

  const showLoadingToast = () => {
    const loadingToast = toast.loading("Processing...", {
      description: "Please wait while we process your request.",
    });

    // Simulate async operation
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Done!", {
        description: "Operation completed successfully.",
      });
    }, 3000);
  };

  const showInfoToast = () => {
    toast.info("Information", {
      description: "This is an informational message.",
      duration: 3000,
    });
  };

  const showWarningToast = () => {
    toast.warning("Warning", {
      description: "Please be careful with this action.",
      duration: 4000,
    });
  };

  const showCustomToast = () => {
    toast("Custom message", {
      description: "This is a custom toast with action",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo clicked"),
      },
      duration: 5000,
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Toast Examples</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={showSuccessToast}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Success Toast
        </button>
        <button
          onClick={showErrorToast}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Error Toast
        </button>
        <button
          onClick={showLoadingToast}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Loading Toast
        </button>
        <button
          onClick={showInfoToast}
          className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
        >
          Info Toast
        </button>
        <button
          onClick={showWarningToast}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Warning Toast
        </button>
        <button
          onClick={showCustomToast}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Custom Toast
        </button>
      </div>
    </div>
  );
}
