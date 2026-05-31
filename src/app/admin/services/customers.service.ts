import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  getCustomers(): Promise<Customer[]> {
    return Promise.resolve([]);
  }
}
