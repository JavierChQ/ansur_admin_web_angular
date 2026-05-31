import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [AdminNavComponent, RouterOutlet],
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.css'],
  host: {
    class: 'admin-shell',
  },
})
export class AdminShellComponent {
  constructor(public authService: AuthService) {}
}
