import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Supplier } from '../../../models/supplier.model';
import { UsersSearchPayload } from '../../../models/user.model';
import { SuppliersService } from '../../../services/api/suppliers.service';
import { OperationStatusHandler } from '../../../services/utils/operation-status.service';
import { RootRoutes } from '../../../utils/root-routes';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { EmptyMessageComponent } from '../../shared/components/empty-message/empty-message.component';
import { DropdownComponent } from '../../shared/components/input/dropdown/dropdown.component';
interface Column {
  key: string;
  label: string;
  width: string;
}

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    EmptyMessageComponent,
    ButtonModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    AlertDialogComponent,
    DropdownComponent,
  ],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss',
})
export class SupplierListComponent implements OnInit {
  public items = signal<Supplier[]>([]);
  public cols = signal<Column[]>([]);
  public searchPayload = signal<UsersSearchPayload>({
    searchText: undefined,
  });

  constructor(
    private _suppliersService: SuppliersService,
    private _destroyRef: DestroyRef,
    private _router: Router,
    private _operationStatusHandler: OperationStatusHandler
  ) {
    this.cols.set([
      { key: 'businessName', label: 'Ragione sociale', width: '30' },
      { key: 'meanValutation', label: 'Valutazione', width: '30' },
      { key: 'actions', label: '', width: '60' },
    ]);
  }
  ngOnInit(): void {
    this.search();
  }

  public search() {
    this._suppliersService
      .getSuppliers(this.searchPayload())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.items.set(
            res.map((el) => ({
              ...el,
              meanValutation: Math.round(el.meanValutation),
            }))
          );
        },
        error: (err) => {
          this._operationStatusHandler.error(
            'Si è verificato un errore durante la ricerca'
          );
        },
      });
  }

  public goToDetail(item: Supplier) {
    this._router.navigate([RootRoutes.SUPPLIERS, item.id]);
  }
}
