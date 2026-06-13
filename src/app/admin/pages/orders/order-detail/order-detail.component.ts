import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order, OrderProductLine, OrderStatus } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { getOrderDisplayFields } from '../../../utils/order-display.util';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent {
  protected readonly order = signal<Order | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly error = signal('');
  protected readonly isUpdating = signal(false);
  protected readonly actionMessage = signal('');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ordersService: OrdersService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(id);
    } else {
      this.error.set('Pedido no encontrado.');
      this.isLoading.set(false);
    }
  }

  private loadOrder(id: string): void {
    this.ordersService.getOrderById(id).subscribe({
      next: (data) => {
        this.order.set(getOrderDisplayFields(data));
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el detalle del pedido.');
        this.isLoading.set(false);
      },
    });
  }

  markDispatched(): void {
    const current = this.order();
    if (!current || current.status !== 'PAGADO') {
      return;
    }

    this.isUpdating.set(true);
    this.actionMessage.set('');

    this.ordersService.markDispatched(current.id).subscribe({
      next: (updated) => {
        this.order.set(getOrderDisplayFields(updated));
        this.isUpdating.set(false);
        this.actionMessage.set('Pedido marcado como despachado.');
      },
      error: () => {
        this.isUpdating.set(false);
        this.actionMessage.set('No se pudo actualizar el estado del pedido.');
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

  getReceptorName(order: Order): string {
    return `${order.receptor_nombres ?? ''} ${order.receptor_apellidos ?? ''}`.trim() || '—';
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

  getDeliveryTypeLabel(order: Order): string {
    if (order.delivery_type === 'pickup') {
      return 'Retiro en tienda';
    }
    if (order.delivery_type === 'delivery') {
      return 'Envío a domicilio';
    }
    return '—';
  }

  getProductsSubtotal(order: Order): number {
    return (order.orderHasProducts ?? []).reduce(
      (sum, line) => sum + this.getLineSubtotal(line),
      0,
    );
  }

  getLineSubtotal(line: OrderProductLine): number {
    return this.getLineUnitPrice(line) * line.quantity;
  }

  getLineUnitPrice(line: OrderProductLine): number {
    return Number(line.unit_price ?? line.product?.sale_price ?? 0);
  }
}
