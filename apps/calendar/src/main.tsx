import ReactDOM from "react-dom/client";
import AppWrapper from "./AppWrapper";
import styles from "./tailwind.css?inline";
import { StrictMode } from "react";

// Create a custom element
class Calendar extends HTMLElement {
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
    root.render(
      <StrictMode>
        <AppWrapper />
      </StrictMode>,
    );
  }
}

// Define the custom element
const appName = "fw-calendar";
customElements.define(appName, Calendar);

const theme = document.getElementById("root")!.dataset.theme;

const fwCalendar = document.createElement(appName);
fwCalendar.dataset.theme = theme;
fwCalendar.id = "root";
const htmlElement = document.querySelector("html");
if (htmlElement) {
  htmlElement.dataset.theme = theme;
}

// Add the custom element to the root node
document.getElementById("root")!.replaceWith(fwCalendar);

// None custom element rendering:
// import "./tailwind.css";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <AppWrapper />
//   </StrictMode>,
// );
