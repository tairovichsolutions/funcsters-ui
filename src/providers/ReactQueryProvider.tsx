"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";
import { registerQueryClient } from "@/lib/logout";
import "@/lib/axiosInterceptors";
interface ReactQueryProvider {
  children: React.ReactNode;
}
export default function ReactQueryProvider({ children }: ReactQueryProvider) {
  const [queryClient] = useState(() => {
    const qc = new QueryClient();
    // Register the QueryClient so the non-hook logout() function can
    // cancel all queries and clear the cache before removing cookies.
    registerQueryClient(qc);
    return qc;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
