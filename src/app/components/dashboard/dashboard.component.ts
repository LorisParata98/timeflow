import { Component } from '@angular/core';
import { UserListComponent } from '../users/user-list/user-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
