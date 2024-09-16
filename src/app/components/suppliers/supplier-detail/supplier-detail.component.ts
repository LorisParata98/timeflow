import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { SupplierReview } from '../../../models/supplier.model';
import { RegisteredUser } from '../../../models/user.model';
import { AuthService } from '../../../services/api/auth.service';
import { SuppliersService } from '../../../services/api/suppliers.service';
import { OperationStatusHandler } from '../../../services/utils/operation-status.service';
import { RootRoutes } from '../../../utils/root-routes';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { AddReviewFormComponent } from '../add-review-form/add-review-form.component';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    AddReviewFormComponent,
    AlertDialogComponent,
    RatingModule,
    BreadcrumbModule,
  ],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss',
})
export class SupplierDetailComponent implements OnInit {
  public reviewForm = viewChild<AddReviewFormComponent>('reviewForm');
  public deleteDialog = viewChild<AlertDialogComponent>('deleteDialog');
  public supplierId: number | undefined;
  public businessName = signal<string | undefined>(undefined);
  public deleteItem = signal<SupplierReview | undefined>(undefined);
  public items = signal<SupplierReview[]>([]);

  public authData: WritableSignal<RegisteredUser | undefined>;
  public breadcrumbs = signal<MenuItem[] | undefined>(undefined);

  constructor(
    private _suppliersService: SuppliersService,
    private _authService: AuthService,
    private _destroyRef: DestroyRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private _operationStatusHandler: OperationStatusHandler
  ) {
    this.breadcrumbs.set([
      { icon: 'pi pi-home', route: RootRoutes.DASHBOARD },
      { label: 'Lista fornitori', route: RootRoutes.SUPPLIERS },
    ]);
    this.authData = signal<RegisteredUser | undefined>(
      this._authService.authData
    );
  }

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
              this.breadcrumbs.update((oldValue) => [
                ...oldValue!,
                { label: res.businessName },
              ]);
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

  public onEdit(item: SupplierReview) {
    this.reviewForm()?.buildForm(item);
  }
  public onDelete(item: SupplierReview) {
    this.deleteItem.set(item);
    this.deleteDialog()?.show();
  }

  public onSave(item: SupplierReview) {
    const review: SupplierReview = {
      ...item,
      supplierId: this.supplierId!,
      date: new Date().toISOString(),
      userEmail: this._authService.authData!.email,
    };
    if (item.id) {
      this._suppliersService
        .update(review)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this._operationStatusHandler.success(
              'Recensione aggiornata con successo'
            );
            this.reviewForm()?.resetForm();
            this.search();
          },
          error: (ex) => this._operationStatusHandler.error(ex.message),
        });
    } else {
      this._suppliersService
        .add(review)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this._operationStatusHandler.success(
              'Recensione aggiunta con successo'
            );
            this.reviewForm()?.resetForm();
            this.search();
          },
          error: (ex) => this._operationStatusHandler.error(ex.message),
        });
    }
  }

  public onDeleteConfirm() {
    this._suppliersService
      .delete(this.deleteItem()!)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._operationStatusHandler.success(
            'Recensione eliminata con successo'
          );
          this.deleteItem.set(undefined);
          this.deleteDialog()?.close();
          this.search();
        },
        error: (ex) => this._operationStatusHandler.error(ex.message),
      });
  }

  public goBack() {
    this._router.navigate([RootRoutes.SUPPLIERS]);
  }
}
