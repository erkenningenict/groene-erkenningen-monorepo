// import { StrictMode } from "react";G

// import { createRoot } from "react-dom/client";
// // import "./tailwind.css";
// import styles from "./tailwind.css?inline";
// import AppWrapper from "./AppWrapper.tsx";

// console.log("#DH# ", styles);
// const host = document.createElement("my-app");
// const shadow = host.attachShadow({ mode: "open" });

// const sheet = new CSSStyleSheet();
// sheet.replaceSync(styles);
// shadow.adoptedStyleSheets = [sheet];

// document.body.appendChild(host);
// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <AppWrapper />
//   </StrictMode>,
// );
import ReactDOM from "react-dom/client";
import AppWrapper from "./AppWrapper";
import styles from "./tailwind.css?inline";

// Create a custom element
class MyApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Create a style element
    const style = document.createElement("style");
    style.textContent = styles; // Assume 'styles' is imported or defined

    // Append style to shadow DOM
    this.shadowRoot!.appendChild(style);

    // Create a div for React to render into
    const appRoot = document.createElement("div");
    appRoot.id = "root";
    // const appRoot = document.getElementById("root")!;
    this.shadowRoot!.appendChild(appRoot);

    // Render React app
    const root = ReactDOM.createRoot(appRoot);
    root.render(<AppWrapper />);
  }
}

// Define the custom element
customElements.define("my-app", MyApp);

const theme = document.getElementById("root")!.dataset.theme;

const ceApp = document.createElement("my-app");
ceApp.dataset.theme = theme;

// Add the custom element to the body
document.getElementById("root")!.appendChild(ceApp);
