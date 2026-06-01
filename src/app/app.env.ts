export interface AppEnv {
  apiBaseUrl: string;
  appTitle: string;
  environmentName: string;
}

const envValues = window.__env || {};

export const appEnv: AppEnv = {
  apiBaseUrl: envValues.API_BASE_URL || 'http://localhost:3000/api',
  appTitle: envValues.APP_TITLE || 'AnsurAdminWebAngular',
  environmentName: envValues.ENVIRONMENT_NAME || 'development',
};
