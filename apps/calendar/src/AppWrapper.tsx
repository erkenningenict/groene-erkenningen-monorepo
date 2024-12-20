import Calendar from "./Calendar";
import { BrowserRouter, Route, Routes } from "react-router";

export default function AppWrapper() {
  const rootElement = document.getElementById("root");
  const label = rootElement?.dataset.theme;
  if (!rootElement) {
    return <div>Root element not found</div>;
  }
  return (
    <div className="Root">
      <div id="selectRoot"></div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Calendar label={label ?? "groenkeur"} />} />
          <Route path="/:id" element={<div> Details</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
