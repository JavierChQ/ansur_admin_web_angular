export {};

declare global {
  interface Window {
    __env?: {
      API_BASE_URL?: string;
      APP_TITLE?: string;
      ENVIRONMENT_NAME?: string;
    };
  }
}
