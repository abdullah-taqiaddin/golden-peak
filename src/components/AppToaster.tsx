"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#0f1c30",
          color: "#eef2f8",
          border: "1px solid rgba(233, 195, 73, 0.55)"
        }
      }}
    />
  );
}
