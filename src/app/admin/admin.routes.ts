import { Route } from '@angular/router';

export const adminRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/admin-shell/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders-list/orders-list.component').then((m) => m.OrdersListComponent),
      },
      {
        path: 'orders/:id',
        loadComponent: () => import('./pages/orders/order-detail/order-detail.component').then((m) => m.OrderDetailComponent),
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/product-list/product-list.component').then((m) => m.ProductListComponent),
      },
      {
        path: 'products/new',
        loadComponent: () => import('./pages/products/product-edit/product-edit.component').then((m) => m.ProductEditComponent),
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./pages/products/product-edit/product-edit.component').then((m) => m.ProductEditComponent),
      },
      {
        path: 'categories',
        pathMatch: 'full',
        loadComponent: () => import('./pages/categories/categories-list/categories-list.component').then((m) => m.CategoriesListComponent),
      },
      {
        path: 'categories/new',
        loadComponent: () => import('./pages/categories/category-edit/category-edit.component').then((m) => m.CategoryEditComponent),
      },
      {
        path: 'categories/:id',
        loadComponent: () => import('./pages/categories/category-edit/category-edit.component').then((m) => m.CategoryEditComponent),
      },
      {
        path: 'customers',
        loadComponent: () => import('./pages/customers/customers-list/customers-list.component').then((m) => m.CustomersListComponent),
      },
    ],
  },
];
