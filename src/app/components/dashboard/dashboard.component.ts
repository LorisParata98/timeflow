import { Component } from '@angular/core';
import { SupplierListComponent } from '../suppliers/supplier-list/supplier-list.component';
import { UserListComponent } from '../users/user-list/user-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserListComponent, SupplierListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
