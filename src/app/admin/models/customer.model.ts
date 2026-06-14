export interface CustomerRole {
  id: string;
  name?: string;
}

export interface Customer {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone?: string;
  is_guest: boolean;
  password_not_set: boolean;
  created_at: string;
  updated_at?: string;
  roles?: CustomerRole[];
}

export type CustomerAccountStatus = 'registered' | 'guest_pending' | 'guest_active';

export function getCustomerAccountStatus(customer: {
  is_guest?: boolean;
  password_not_set?: boolean;
}): CustomerAccountStatus {
  if (customer.is_guest && customer.password_not_set) {
    return 'guest_pending';
  }
  if (customer.is_guest) {
    return 'guest_active';
  }
  return 'registered';
}

export function getCustomerAccountStatusLabel(status: CustomerAccountStatus): string {
  switch (status) {
    case 'guest_pending':
      return 'Invitado · sin contraseña';
    case 'guest_active':
      return 'Invitado · activo';
    default:
      return 'Registrado';
  }
}

export function getCustomerAccountStatusClass(status: CustomerAccountStatus): string {
  switch (status) {
    case 'guest_pending':
      return 'badge-guest-pending';
    case 'guest_active':
      return 'badge-guest-active';
    default:
      return 'badge-registered';
  }
}

export function getCustomerFullName(customer: {
  name?: string;
  lastname?: string;
}): string {
  return `${customer.name ?? ''} ${customer.lastname ?? ''}`.trim() || '—';
}
