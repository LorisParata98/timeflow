import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  RegisteredUser,
  UsersSearchPayload,
  UserType,
} from '../../../models/user.model';
import { UsersService } from '../../../services/api/users.service';
import { OperationStatusHandler } from '../../../services/utils/operation-status.service';
import { EmptyMessageComponent } from '../../shared/components/empty-message/empty-message.component';

interface Column {
  key: string;
  label: string;
  width: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    EmptyMessageComponent,
    ButtonModule,
    CommonModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  public items = signal<RegisteredUser[]>([]);
  public cols = signal<Column[]>([]);
  public searchPayload = signal<UsersSearchPayload>({
    searchText: undefined,
  });

  constructor(
    private _usersService: UsersService,
    private _destroyRef: DestroyRef,
    private _operationStatusHandler: OperationStatusHandler
  ) {
    this.cols.set([
      { key: 'username', label: 'Nome utente', width: '30' },
      { key: 'email', label: 'Email', width: '30' },
      { key: 'userType', label: 'Tipologia utente', width: '30' },
      { key: 'actions', label: 'Azioni', width: '10' },
    ]);
  }
  ngOnInit(): void {
    this.search();
  }

  public search() {
    this._usersService
      .getUsers(this.searchPayload())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.items.set(res);
        },
        error: (err) => {
          this._operationStatusHandler.error(
            'Si è verificato un errore durante la ricerca'
          );
        },
      });
  }

  public getUserType(status: UserType): {
    label: string;
    severity:
      | 'success'
      | 'secondary'
      | 'info'
      | 'warning'
      | 'danger'
      | 'contrast'
      | undefined;
  } {
    switch (status) {
      case UserType.Customer:
        return { label: 'Cliente', severity: 'info' };
      case UserType.Supplier:
        return { label: 'Fornitore', severity: 'secondary' };
    }
  }
  public onAdd() {}
}
