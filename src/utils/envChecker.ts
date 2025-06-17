import { BASE_URL, BASE_WS, MODE } from '@/constants/globalVariables';

export const getEnvironmentInfo = () => {
  return {
    mode: MODE,
    isDevelopment: MODE === 'development',
    isProduction: MODE === 'production',
    apiBaseUrl: BASE_URL,
    wsBaseUrl: BASE_WS,
    viteMode: import.meta.env.MODE,
    viteDev: import.meta.env.DEV,
    viteProd: import.meta.env.PROD,
  };
};

// Log environment info when imported
console.log('🔧 Environment Info:', getEnvironmentInfo());

export default getEnvironmentInfo; 