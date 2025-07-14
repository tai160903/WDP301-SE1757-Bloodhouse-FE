// Get environment variables from Vite
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api/v1";
const BASE_WS = import.meta.env.VITE_WS_BASE_URL || "http://localhost:3000";
const MODE = import.meta.env.VITE_MODE || import.meta.env.MODE || "development";

// Log current environment for debugging
console.log("🌍 Environment:", {
  MODE,
  BASE_URL,
  BASE_WS,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
}); 

export { BASE_URL, BASE_WS, MODE };
