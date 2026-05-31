import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  protected readonly email = new FormControl('', { nonNullable: true });
  protected readonly password = new FormControl('', { nonNullable: true });
  protected readonly form = new FormGroup({
    email: this.email,
    password: this.password,
  });
  protected readonly error = signal('');
  protected readonly saving = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  protected login(): void {
    if (this.form.invalid) {
      this.error.set('Completa todos los campos.');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.authService
      .login({
        email: this.email.value,
        password: this.password.value,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          const message = err?.error?.message ?? err?.error?.detail ?? 'Usuario o contraseña incorrectos.';
          this.error.set(message);
        },
      });
  }
}
