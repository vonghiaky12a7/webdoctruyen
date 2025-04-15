"use client";

import React from "react";

const LoadingComponent = () => {
  return (
    <div className="container mx-auto my-10 px-6 flex flex-col items-center justify-center min-h-[50vh]">
      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute w-12 h-12 border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full animate-spin animation-delay-200"></div>
      </div>
      {/* Thông điệp Loading */}
      <p className="mt-4 text-lg text-gray-600 font-medium animate-pulse">
        Đang tải, vui lòng chờ...
      </p>
    </div>
  );
};

export default LoadingComponent;
