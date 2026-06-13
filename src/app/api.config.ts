import { appEnv } from './app.env';

export const API_BASE_URL = appEnv.apiBaseUrl;
export const AUTH_URL = `${API_BASE_URL}/auth`;
export const CATEGORY_URL = `${API_BASE_URL}/categories`;
export const PRODUCT_URL = `${API_BASE_URL}/products`;
export const ADMIN_INVENTORY_URL = `${API_BASE_URL}/admin/inventory`;
export const ORDERS_URL = `${API_BASE_URL}/orders`;
