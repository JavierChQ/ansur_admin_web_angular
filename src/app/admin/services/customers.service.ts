import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../api.config';
import { Customer } from '../models/customer.model';

export interface LegacyGuestMigrationResult {
  dryRun: boolean;
  candidates: number;
  updated: number;
  userIds: number[];
  activationEmailsSent: number;
}

export interface LegacyGuestMigrationPayload {
  dryRun?: boolean;
  sendActivationEmails?: boolean;
  proximitySeconds?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly usersUrl = `${API_BASE_URL}/users`;

  constructor(private readonly http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.usersUrl);
  }

  migrateLegacyGuests(payload: LegacyGuestMigrationPayload): Observable<LegacyGuestMigrationResult> {
    return this.http.post<LegacyGuestMigrationResult>(
      `${this.usersUrl}/migrate-legacy-guests`,
      payload,
    );
  }
}
