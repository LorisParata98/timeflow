import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { SearchPayload } from '../../models/common.model';
import { Supplier, SupplierReview } from '../../models/supplier.model';
import { LoaderStatusService } from '../utils/loader-status.service';
import { StorageService } from '../utils/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  constructor(
    private _storageService: StorageService,
    private _loaderService: LoaderStatusService,
    private http: HttpClient
  ) {}

  public _loadSuppliersInStorage() {
    return this.http
      .get<Supplier[]>('mock_data/suppliers.json')
      .subscribe((res) => {
        this._storageService.set('suppliers', res);
        this._loadReviews();
      });
  }
  private _loadReviews() {
    return this.http
      .get<SupplierReview[]>('mock_data/reviews.json')
      .subscribe((res) => {
        this._storageService.set('reviews', res);
        this._calculateMeanValutation();
      });
  }

  private _calculateMeanValutation(supplierId?: number) {
    const reviews: SupplierReview[] = this._storageService.get('reviews');
    let allSuppliers: Supplier[] = this._storageService.get('suppliers');
    let suppliers: Supplier[] = this._storageService.get('suppliers');

    if (supplierId) suppliers = suppliers.filter((el) => el.id == supplierId);

    suppliers = suppliers.map((el) => {
      const supplierReviews: SupplierReview[] = reviews.filter(
        (review) => review.supplierId === el.id && review.value
      );
      const totalReviews = supplierReviews.length;
      const sum = supplierReviews.reduce(
        (acc, review) => acc + review.value,
        0
      );
      const meanValutation = totalReviews > 0 ? sum / totalReviews : 0;
      return {
        ...el,
        meanValutation,
      };
    });
    if (supplierId) {
      const idx = allSuppliers.findIndex((el) => el.id == supplierId);
      if (idx > -1) {
        allSuppliers.splice(idx, 1, suppliers[0]);
        suppliers = allSuppliers;
      }
    }
    this._storageService.set('suppliers', suppliers);
  }

  public getSuppliers(searchPayload: SearchPayload) {
    this._loaderService.show();
    let suppliers = this._storageService.get('suppliers') || [];

    if (searchPayload.searchText) {
      suppliers = suppliers.filter((supplier: Supplier) =>
        supplier.businessName
          .toLocaleLowerCase()
          .includes(searchPayload.searchText?.toLocaleLowerCase()!)
      );
    }
    this._loaderService.hide();
    return of(suppliers);
  }

  public getSupplierById(supplierId: number) {
    this._loaderService.show();
    let suppliers = this._storageService.get('suppliers') || [];
    const filteredSupplier = suppliers.find(
      (supplier: Supplier) => supplier.id == supplierId
    );
    if (filteredSupplier) {
      this._loaderService.hide();
      return of(filteredSupplier);
    } else {
      this._loaderService.hide();
      return throwError(
        () => new Error('Questo fornitore non è presente nel sistema.')
      );
    }
  }

  public getReviewsBySupplier(supplierId: number) {
    this._loaderService.show();
    let reviews = this._storageService.get('reviews') || [];

    const filteredReviews: SupplierReview[] = reviews.filter(
      (review: SupplierReview) => review.supplierId == supplierId
    );
    this._loaderService.hide();
    return of(
      filteredReviews.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  }

  public update(item: SupplierReview) {
    this._loaderService.show();
    let reviews = this._storageService.get('reviews') || [];
    const foundIndex = reviews.findIndex(
      (el: SupplierReview) => el.id === item.id
    );
    if (foundIndex !== -1) {
      reviews[foundIndex] = { ...reviews[foundIndex], ...item };
      this._storageService.set('reviews', reviews);
      this._calculateMeanValutation(item.supplierId);
      this._loaderService.hide();
      return of(true);
    } else {
      this._loaderService.hide();
      return throwError(
        () =>
          new Error('Operazione fallita, recensione non presente nel sistema.')
      );
    }
  }

  public add(item: SupplierReview) {
    this._loaderService.show();
    let reviews = this._storageService.get('reviews') || [];
    const newReview = {
      ...item,
      id: reviews.length > 0 ? reviews[reviews.length - 1].id + 1 : 0,
    };
    reviews.push(newReview);
    this._storageService.set('reviews', reviews);
    this._calculateMeanValutation(item.supplierId);

    this._loaderService.hide();
    return of(true);
  }

  public delete(user: SupplierReview) {
    this._loaderService.show();
    let reviews = this._storageService.get('reviews') || [];
    const reviewIdx = reviews.findIndex(
      (el: SupplierReview) => el.id === user.id
    );
    if (reviewIdx) {
      reviews.splice(reviewIdx, 1);
      this._storageService.set('reviews', reviews);
      this._loaderService.hide();
      return of(true);
    } else {
      this._loaderService.hide();
      return throwError(
        () =>
          new Error('Operazione fallita, recensione non presente nel sistema')
      );
    }
  }
}
