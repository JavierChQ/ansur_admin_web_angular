import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  protected readonly name = new FormControl('', { nonNullable: true });
  protected readonly lastname = new FormControl('', { nonNullable: true });
  protected readonly phone = new FormControl('', { nonNullable: true });
  protected readonly email = new FormControl('', { nonNullable: true });
  protected readonly password = new FormControl('', { nonNullable: true });
  protected readonly confirmPassword = new FormControl('', { nonNullable: true });
  protected readonly form = new FormGroup({
    name: this.name,
    lastname: this.lastname,
    phone: this.phone,
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword,
  });
  protected readonly error = signal('');
  protected readonly saving = signal(false);
  protected readonly passwordsMatch = computed(
    () => this.password.value === this.confirmPassword.value
  );

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  protected register(): void {
    if (this.form.invalid || !this.passwordsMatch()) {
      this.error.set('Verifica que los campos estén completos y que las contraseñas coincidan.');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.authService
      .register({
        name: this.name.value,
        lastname: this.lastname.value,
        phone: this.phone.value,
        email: this.email.value,
        password: this.password.value,
        rolesIds: ['ADMIN'],
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          const message = err?.error?.message ?? err?.error?.detail ?? 'No se pudo completar el registro.';
          this.error.set(message);
          this.saving.set(false);
        },
      });
  }
}
