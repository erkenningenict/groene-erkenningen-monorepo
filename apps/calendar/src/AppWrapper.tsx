import Calendar from "./Calendar";

export default function AppWrapper() {
  const rootElement = document.getElementById("root");
  const label = rootElement?.dataset.theme;
  if (!rootElement) {
    return <div>Root element not found</div>;
  }
  return <Calendar label={label ?? "groenkeur"} />;
}
