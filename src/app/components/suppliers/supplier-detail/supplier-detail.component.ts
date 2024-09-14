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
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SupplierReview } from '../../../models/supplier.model';
import { SuppliersService } from '../../../services/api/suppliers.service';
import { OperationStatusHandler } from '../../../services/utils/operation-status.service';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { EmptyMessageComponent } from '../../shared/components/empty-message/empty-message.component';
import { AddReviewDialogComponent } from '../add-review-dialog/add-review-dialog.component';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    EmptyMessageComponent,
    ButtonModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    AddReviewDialogComponent,
    AlertDialogComponent,
    RatingModule,
  ],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss',
})
export class SupplierDetailComponent implements OnInit {
  public addEditUserDialog =
    viewChild<AddReviewDialogComponent>('addEditUserDialog');
  public deleteDialog = viewChild<AlertDialogComponent>('deleteDialog');
  public supplierId: number | undefined;
  public businessName = signal<string | undefined>(undefined);
  public deleteItem = signal<SupplierReview | undefined>(undefined);
  public items = signal<SupplierReview[]>([]);

  constructor(
    private _suppliersService: SuppliersService,
    private _destroyRef: DestroyRef,
    private _route: ActivatedRoute,
    private _operationStatusHandler: OperationStatusHandler
  ) {}
  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      if (params['id'] != (null || undefined)) {
        this.supplierId = parseInt(params['id']);
        this._suppliersService
          .getSupplierById(this.supplierId!)
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe({
            next: (res) => {
              this.businessName.set(res.businessName);
              this.search();
            },
            error: (err) => this._operationStatusHandler.error(err.message),
          });
      }
    });
  }

  public search() {
    this._suppliersService
      .getReviewsBySupplier(this.supplierId!)
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

  public onAdd() {
    this.addEditUserDialog()?.show();
  }

  public onEdit(item: SupplierReview) {
    // this.addEditUserDialog()?.show(item);
  }
  public onDelete(item: SupplierReview) {
    this.deleteItem.set(item);
    this.deleteDialog()?.show();
  }

  public onSave(item: SupplierReview) {
    if (item.id) {
      // this._suppliersService
      //   .update(item)
      //   .pipe(takeUntilDestroyed(this._destroyRef))
      //   .subscribe({
      //     next: () => {
      //       this._operationStatusHandler.success(
      //         'Utente aggiornato con successo'
      //       );
      //       this.addEditUserDialog()?.close();
      //       this.search();
      //     },
      //     error: (ex) => this._operationStatusHandler.error(ex.message),
      //   });
    } else {
      // this._suppliersService
      //   .add(item)
      //   .pipe(takeUntilDestroyed(this._destroyRef))
      //   .subscribe({
      //     next: () => {
      //       this._operationStatusHandler.success(
      //         'Utente aggiunto con successo'
      //       );
      //       this.addEditUserDialog()?.close();
      //       this.search();
      //     },
      //     error: (ex) => this._operationStatusHandler.error(ex.message),
      //   });
    }
  }

  public onDeleteConfirm() {
    // this._suppliersService
    //   .delete(this.deleteItem()!)
    //   .pipe(takeUntilDestroyed(this._destroyRef))
    //   .subscribe({
    //     next: () => {
    //       this._operationStatusHandler.success('Utente eliminato con successo');
    //       this.deleteItem.set(undefined);
    //       this.deleteDialog()?.close();
    //       this.search();
    //     },
    //     error: (ex) => this._operationStatusHandler.error(ex.message),
    //   });
  }
}
