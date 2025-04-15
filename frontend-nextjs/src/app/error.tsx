"use client";

import React from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorComponent: React.FC<ErrorProps> = ({ error, reset }) => {
  console.error(error);

  return (
    <div className="container mx-auto my-10 px-6 text-red-500">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()} className="text-blue-500">
        Try again
      </button>
    </div>
  );
};

export default ErrorComponent;
