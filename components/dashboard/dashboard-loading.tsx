import React from "react";

const DashboardLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="h-7 w-44 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-72 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Content Area with 2 Column Grid */}
      <div className="p-8 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px] mx-auto">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLoader;
