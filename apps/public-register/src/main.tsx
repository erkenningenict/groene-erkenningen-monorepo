import ReactDOM from "react-dom/client";
import AppWrapper from "./AppWrapper";
import styles from "./tailwind.css?inline";

// Create a custom element
class PublicRegister extends HTMLElement {
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

    this.shadowRoot!.appendChild(appRoot);

    // Render React app
    const root = ReactDOM.createRoot(appRoot);
    root.render(<AppWrapper />);
  }
}

// Define the custom element
const appName = "fw-public-register";
customElements.define(appName, PublicRegister);

const theme = document.getElementById("root")!.dataset.theme;

const fwPublicRegister = document.createElement(appName);
fwPublicRegister.dataset.theme = theme;
fwPublicRegister.id = "root";

// Add the custom element to the root node
document.getElementById("root")!.replaceWith(fwPublicRegister);
