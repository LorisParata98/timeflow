import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  RegisteredUser,
  UsersSearchPayload,
  UserType,
} from '../../../models/user.model';
import { AuthService } from '../../../services/api/auth.service';
import { UsersService } from '../../../services/api/users.service';
import { OperationStatusHandler } from '../../../services/utils/operation-status.service';
import { UserUtils } from '../../../utils/UserUtils';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { EmptyMessageComponent } from '../../shared/components/empty-message/empty-message.component';
import { DropdownComponent } from '../../shared/components/input/dropdown/dropdown.component';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

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
    EditUserDialogComponent,
    AlertDialogComponent,
    DropdownComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  public addEditUserDialog =
    viewChild<EditUserDialogComponent>('addEditUserDialog');
  public deleteDialog = viewChild<AlertDialogComponent>('deleteDialog');

  public deleteItem = signal<RegisteredUser | undefined>(undefined);
  public loggedUserData = signal<RegisteredUser | undefined>(undefined);

  public items = signal<RegisteredUser[]>([]);
  public cols = signal<Column[]>([]);
  public searchPayload = signal<UsersSearchPayload>({
    searchText: undefined,
  });

  public userTypes = signal<SelectItem[]>([]);

  constructor(
    private _usersService: UsersService,
    private _destroyRef: DestroyRef,
    private _authService: AuthService,
    private _operationStatusHandler: OperationStatusHandler
  ) {
    this.loggedUserData.set(this._authService.authData);
    this.cols.set([
      { key: 'username', label: 'Nome utente', width: '30' },
      { key: 'email', label: 'Email', width: '30' },
      { key: 'userType', label: 'Tipologia utente', width: '30' },
      { key: 'actions', label: 'Azioni', width: '10' },
    ]);

    this.userTypes.set(UserUtils.userRoles);
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
  public onAdd() {
    this.addEditUserDialog()?.show();
  }

  public onEdit(user: RegisteredUser) {
    this.addEditUserDialog()?.show(user);
  }
  public onDelete(user: RegisteredUser) {
    this.deleteItem.set(user);
    this.deleteDialog()?.show();
  }

  public onSave(item: RegisteredUser) {
    if (item.id) {
      this._usersService
        .update(item)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this._operationStatusHandler.success(
              'Utente aggiornato con successo'
            );
            this.addEditUserDialog()?.close();
            this.search();
          },
          error: (ex) => this._operationStatusHandler.error(ex.message),
        });
    } else {
      this._usersService
        .add(item)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this._operationStatusHandler.success(
              'Utente aggiunto con successo'
            );
            this.addEditUserDialog()?.close();

            this.search();
          },
          error: (ex) => this._operationStatusHandler.error(ex.message),
        });
    }
  }

  public onDeleteConfirm() {
    this._usersService
      .delete(this.deleteItem()!)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._operationStatusHandler.success('Utente eliminato con successo');
          this.deleteItem.set(undefined);
          this.deleteDialog()?.close();
          this.search();
        },
        error: (ex) => this._operationStatusHandler.error(ex.message),
      });
  }
}
