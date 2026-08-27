import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import WikiApp from "./WikiApp";
import { LanguageProvider } from "./i18n";
import "./styles.css";

const path = window.location.pathname.replace(/\/+$/, "");
const isWiki = path.endsWith("/wiki");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      {isWiki ? <WikiApp /> : <App />}
    </LanguageProvider>
  </StrictMode>,
);
