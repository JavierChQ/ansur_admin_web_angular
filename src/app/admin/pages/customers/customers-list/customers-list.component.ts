import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  Customer,
  getCustomerAccountStatus,
  getCustomerAccountStatusClass,
  getCustomerAccountStatusLabel,
  getCustomerFullName,
} from '../../../models/customer.model';
import { CustomersService } from '../../../services/customers.service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css'],
})
export class CustomersListComponent {
  protected readonly customers = signal<Customer[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly error = signal('');
  protected readonly migrationMessage = signal('');
  protected readonly migrationError = signal('');
  protected readonly isMigrating = signal(false);

  constructor(private readonly customersService: CustomersService) {
    this.loadCustomers();
  }

  protected getCustomerAccountStatus = getCustomerAccountStatus;
  protected getCustomerAccountStatusLabel = getCustomerAccountStatusLabel;
  protected getCustomerAccountStatusClass = getCustomerAccountStatusClass;
  protected getCustomerFullName = getCustomerFullName;

  protected loadCustomers(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.customersService.getCustomers().subscribe({
      next: (data) => {
        this.customers.set(data ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de clientes.');
        this.isLoading.set(false);
      },
    });
  }

  protected runLegacyMigration(dryRun: boolean): void {
    this.isMigrating.set(true);
    this.migrationMessage.set('');
    this.migrationError.set('');

    this.customersService
      .migrateLegacyGuests({
        dryRun,
        sendActivationEmails: !dryRun,
      })
      .subscribe({
        next: (result) => {
          this.isMigrating.set(false);
          const action = result.dryRun ? 'detectados' : 'migrados';
          this.migrationMessage.set(
            `${result.candidates} usuarios ${action}.` +
              (result.activationEmailsSent
                ? ` ${result.activationEmailsSent} correos de activación enviados.`
                : ''),
          );
          if (!result.dryRun) {
            this.loadCustomers();
          }
        },
        error: (err) => {
          this.isMigrating.set(false);
          this.migrationError.set(
            err?.error?.message ?? 'No se pudo ejecutar la migración legacy.',
          );
        },
      });
  }
}
