import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order, OrderStatus } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import {
  getGuestOrderBadgeClass,
  getGuestOrderBadgeLabel,
} from '../../../utils/guest-badge.util';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
})
export class OrdersListComponent {
  protected readonly orders = signal<Order[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly error = signal('');

  protected getGuestOrderBadgeLabel = getGuestOrderBadgeLabel;
  protected getGuestOrderBadgeClass = getGuestOrderBadgeClass;

  constructor(private readonly ordersService: OrdersService) {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.ordersService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de pedidos.');
        this.isLoading.set(false);
      },
    });
  }

  getCustomerName(order: Order): string {
    if (order.customer_name || order.customer_lastname) {
      return `${order.customer_name ?? ''} ${order.customer_lastname ?? ''}`.trim();
    }
    if (order.user) {
      return `${order.user.name} ${order.user.lastname}`.trim();
    }
    return '—';
  }

  getDeliveryLabel(order: Order): string {
    if (order.delivery_type === 'pickup') {
      return 'Retiro en tienda';
    }
    if (order.delivery_type === 'delivery') {
      return 'Envío a domicilio';
    }
    return '—';
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      PENDIENTE_PAGO: 'Pendiente de pago',
      PAGADO: 'Pagado',
      CANCELADO: 'Cancelado',
      EXPIRADO: 'Expirado',
      DESPACHADO: 'Despachado',
      REEMBOLSADO: 'Reembolsado',
    };
    return labels[status] ?? status;
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'PAGADO':
        return 'status-paid';
      case 'DESPACHADO':
        return 'status-shipped';
      case 'PENDIENTE_PAGO':
        return 'status-pending';
      case 'CANCELADO':
      case 'EXPIRADO':
      case 'REEMBOLSADO':
        return 'status-cancelled';
      default:
        return '';
    }
  }
}
