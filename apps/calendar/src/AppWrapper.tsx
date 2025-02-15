import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router";
import Calendar from "./Calendar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

export default function AppWrapper() {
  const rootElement = document.getElementById("root");
  const label = rootElement?.dataset.theme;
  if (!rootElement) {
    return <div>Root element not found</div>;
  }
  return (
    <div className="Root" id="fwRoot">
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={<Calendar label={label ?? "groenkeur"} />}
            ></Route>
          </Routes>
        </HashRouter>
      </QueryClientProvider>
    </div>
  );
}
