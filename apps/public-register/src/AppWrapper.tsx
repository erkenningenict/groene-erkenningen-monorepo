import Certificates from "./Certificates";

export default function AppWrapper() {
  const rootElement = document.getElementById("root");
  const label = rootElement?.dataset.theme;
  console.log("#DH# label", label);
  if (!rootElement) {
    return <div>Root element not found</div>;
  }
  return <Certificates label={label ?? "groenkeur"} />;
}
