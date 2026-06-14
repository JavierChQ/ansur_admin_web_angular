import { Order } from '../models/order.model';

export function isGuestOrder(order: Pick<Order, 'is_guest_order' | 'id_client'>): boolean {
  return !!order.is_guest_order || order.id_client == null;
}

export function getGuestOrderBadgeLabel(order: Pick<Order, 'is_guest_order' | 'id_client' | 'status'>): string | null {
  if (!isGuestOrder(order)) {
    return null;
  }

  if (order.id_client == null) {
    return 'Invitado · sin cuenta';
  }

  return 'Checkout invitado';
}

export function getGuestOrderBadgeClass(order: Pick<Order, 'id_client'>): string {
  return order.id_client == null ? 'badge-guest-pending' : 'badge-guest-active';
}

export function getUserGuestBadgeLabel(user?: {
  is_guest?: boolean;
  password_not_set?: boolean;
} | null): string | null {
  if (!user?.is_guest) {
    return null;
  }

  return user.password_not_set ? 'Sin contraseña' : 'Cuenta guest activa';
}

export function getUserGuestBadgeClass(user?: {
  password_not_set?: boolean;
} | null): string {
  return user?.password_not_set ? 'badge-guest-pending' : 'badge-guest-active';
}
