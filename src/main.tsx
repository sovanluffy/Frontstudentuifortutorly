import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Added for the useNavigate error
import App from "./app/App"; // Removed .tsx
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);