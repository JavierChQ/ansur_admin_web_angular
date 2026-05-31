import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthResponse, AuthUser, LoginAuthDto, RegisterAuthDto } from './models/auth.model';
import { AUTH_URL } from '../api.config';

const STORAGE_KEY = 'ansur_admin_token';
const USER_STORAGE_KEY = 'ansur_admin_user';

function getStoredUser(): AuthResponse['user'] | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthResponse['user'];
  } catch {
    return null;
  }
}

function extractStringValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value[0];
  }

  return undefined;
}

function normalizeToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  const trimmed = token.trim();
  return trimmed.toLowerCase().startsWith('bearer ') ? trimmed.slice(7).trim() : trimmed;
}

function normalizeUserPayload(payload: Record<string, unknown> | null): AuthResponse['user'] | null {
  if (!payload) {
    return null;
  }

  const nestedUser = payload['user'];
  const userPayload = nestedUser && typeof nestedUser === 'object' ? (nestedUser as Record<string, unknown>) : payload;
  const role = extractStringValue(
    userPayload['role'] ??
      userPayload['roles'] ??
      userPayload['rol'] ??
      userPayload['userRole'] ??
      userPayload['roleName'] ??
      userPayload['role_id']
  );
  const roles = userPayload['roles'];
  const parsedRoles =
    Array.isArray(roles) && roles.every((item) => typeof item === 'object')
      ? (roles as AuthUser['roles'])
      : Array.isArray(roles)
      ? (roles as string[]).map((id) => ({ id }))
      : undefined;

  return {
    id: extractStringValue(userPayload['id'] ?? userPayload['sub'] ?? userPayload['userId'] ?? userPayload['uid']) ?? '',
    name: extractStringValue(userPayload['name'] ?? userPayload['fullName'] ?? userPayload['displayName'] ?? userPayload['nombre']) ?? '',
    lastname: extractStringValue(userPayload['lastname'] ?? userPayload['surname'] ?? userPayload['apellido']),
    email: extractStringValue(userPayload['email'] ?? userPayload['username'] ?? userPayload['correo'] ?? userPayload['userEmail']) ?? '',
    phone: extractStringValue(userPayload['phone'] ?? userPayload['telefono'] ?? userPayload['celular']),
    image: typeof userPayload['image'] === 'string' ? (userPayload['image'] as string) : null,
    notification_token: typeof userPayload['notification_token'] === 'string' ? (userPayload['notification_token'] as string) : null,
    created_at: extractStringValue(userPayload['created_at'] ?? userPayload['createdAt']),
    updated_at: extractStringValue(userPayload['updated_at'] ?? userPayload['updatedAt']),
    deleted_at: extractStringValue(userPayload['deleted_at'] ?? userPayload['deletedAt']),
    roles: parsedRoles,
    role,
  };
}

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(
      decoded
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    ));
  } catch {
    return null;
  }
}

function getUserFromToken(token: string): AuthResponse['user'] | null {
  const normalizedToken = normalizeToken(token);
  if (!normalizedToken) {
    return null;
  }

  const payload = decodeJwt(normalizedToken);
  if (!payload) {
    return null;
  }

  return normalizeUserPayload(payload);
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly token = signal<string | null>(localStorage.getItem(STORAGE_KEY));
  private readonly currentUser = signal<AuthResponse['user'] | null>(getStoredUser());

  constructor(private readonly http: HttpClient) {}

  get tokenValue(): string | null {
    return this.token();
  }

  get user(): AuthResponse['user'] | null {
    return this.currentUser();
  }

  get userRole(): string | null {
    const user = this.currentUser();
    if (!user) {
      return null;
    }

    if (user.roles?.length) {
      return user.roles[0].id ?? user.roles[0].name ?? null;
    }

    return user.role ?? null;
  }

  get isAuthenticated(): boolean {
    return !!this.token();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    if (!user) {
      return false;
    }

    if (user.roles?.some((item) => item.id?.toLowerCase() === role.toLowerCase() || item.name?.toLowerCase() === role.toLowerCase())) {
      return true;
    }

    return user.role?.toLowerCase() === role.toLowerCase();
  }

  login(credentials: LoginAuthDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${AUTH_URL}/login`, credentials).pipe(
      tap((response) => {
        const token = normalizeToken(
          response.access_token ?? response.accessToken ?? response.token ?? response.jwt ?? null
        );
        const user =
          response.user ??
          normalizeUserPayload(response as unknown as Record<string, unknown>) ??
          (token ? getUserFromToken(token) : null);
        this.storeAuth(token, user);
      }),
      catchError((error) => {
        console.error('Login error', error);
        return throwError(() => error);
      })
    );
  }

  register(payload: RegisterAuthDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${AUTH_URL}/register`, payload).pipe(
      tap((response) => {
        const token = normalizeToken(
          response.access_token ?? response.accessToken ?? response.token ?? response.jwt ?? null
        );
        const user =
          response.user ??
          normalizeUserPayload(response as unknown as Record<string, unknown>) ??
          (token ? getUserFromToken(token) : null);
        this.storeAuth(token, user);
      }),
      catchError((error) => {
        console.error('Register error', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.storeAuth(null, null);
  }

  private storeAuth(token: string | null, user: AuthResponse['user'] | null): void {
    this.token.set(token);
    this.currentUser.set(user);

    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }
}
