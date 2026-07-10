import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Intercept global fetch to redirect /api paths to the backend FQDN in production
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === "string" && input.startsWith("/api")) {
    const defaultUrl = "http://m9vtp9i2sl5xk7n28lktek4e.141.148.199.81.sslip.io";
    const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "" : defaultUrl);
    input = `${baseUrl}${input}`;
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
