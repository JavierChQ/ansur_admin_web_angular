import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  login() {
    return Promise.resolve(true);
  }

  logout() {
    return Promise.resolve();
  }
}
