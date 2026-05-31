import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="auth-page">
      <section class="auth-card">
        <h1>Acceso denegado</h1>
        <p>No tienes permisos para acceder a esta sección.</p>

        <div style="display:flex;gap:8px;margin-top:16px;">
          <a routerLink="/auth/login" class="btn">Volver al login</a>
          <button (click)="logout()" class="btn secondary" *ngIf="authService.isAuthenticated">Cerrar sesión</button>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      .auth-page { display:flex; align-items:center; justify-content:center; min-height:80vh; }
      .auth-card { background:#fff; padding:24px; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.08); max-width:420px; }
      h1 { margin:0 0 8px 0; }
      .btn { padding:10px 16px; background:#5b8def; color:#fff; border-radius:8px; text-decoration:none; }
      .btn.secondary { background:#f3f3f3; color:#222; border:none; }
    `,
  ],
})
export class AccessDeniedComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
