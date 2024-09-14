import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { SearchPayload } from '../../models/common.model';
import { Supplier, SupplierReview } from '../../models/supplier.model';
import { RegisteredUser } from '../../models/user.model';
import { LoaderStatusService } from '../utils/loader-status.service';
import { StorageService } from '../utils/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  private suppliers: Supplier[] = [];
  private reviews: SupplierReview[] = [];

  constructor(
    private _storageService: StorageService,
    private _loaderService: LoaderStatusService
  ) {
    this._loadSuppliersInStorage();
  }

  private _loadSuppliersInStorage() {
    this._storageService.set('suppliers', [
      { id: 1, meanValutation: 0, businessName: 'Tech Solutions SRL' },
      { id: 2, meanValutation: 0, businessName: 'Innovative Hardware SPA' },
      { id: 3, meanValutation: 0, businessName: 'Smart Systems SRL' },
      { id: 4, meanValutation: 0, businessName: 'Green Energy SPA' },
      { id: 5, meanValutation: 0, businessName: 'Digital Future SRL' },
      { id: 6, meanValutation: 0, businessName: 'SecureTech SRL' },
      { id: 7, meanValutation: 0, businessName: 'Global Trading SPA' },
      { id: 8, meanValutation: 0, businessName: 'CloudNet Solutions SRL' },
      { id: 9, meanValutation: 0, businessName: 'EcoBuilders SPA' },
      { id: 10, meanValutation: 0, businessName: 'IT Powerhouse SRL' },
    ]);
    this._loadReviews();
  }

  private _loadReviews() {
    this._storageService.set('reviews', [
      {
        id: 1,
        supplierId: 1,
        value: 5,
        body: 'Ottimo servizio, sempre puntuali e disponibili a risolvere qualsiasi problema.',
      },
      {
        id: 2,
        supplierId: 1,
        value: 4,
        body: 'Molto competenti, ma ci sono stati alcuni piccoli ritardi nelle consegne.',
      },

      {
        id: 3,
        supplierId: 2,
        value: 4,
        body: 'Buona esperienza complessiva, ma potrebbe migliorare il supporto tecnico.',
      },
      {
        id: 4,
        supplierId: 2,
        value: 3,
        body: 'Qualche disguido iniziale, ma alla fine il prodotto è di qualità.',
      },

      {
        id: 5,
        supplierId: 3,
        value: 5,
        body: "Eccellente. Servizio impeccabile e tecnologie all'avanguardia.",
      },
      {
        id: 6,
        supplierId: 3,
        value: 5,
        body: 'Non avrei potuto chiedere di meglio. Supporto e consegne rapidissime!',
      },

      {
        id: 7,
        supplierId: 4,
        value: 3,
        body: 'Alcune difficoltà con il servizio clienti, ma la qualità dei prodotti è buona.',
      },
      {
        id: 8,
        supplierId: 4,
        value: 2,
        body: 'Ritardi costanti e poca chiarezza nelle comunicazioni.',
      },

      {
        id: 9,
        supplierId: 5,
        value: 4,
        body: 'Soluzioni innovative, ma i prezzi potrebbero essere più competitivi.',
      },
      {
        id: 10,
        supplierId: 5,
        value: 4,
        body: 'Molto soddisfatto del prodotto finale, ma i tempi di risposta sono lenti.',
      },

      {
        id: 11,
        supplierId: 6,
        value: 4,
        body: "Buon fornitore, specialmente per la sicurezza. Un po' caro ma vale la pena.",
      },
      {
        id: 12,
        supplierId: 6,
        value: 5,
        body: 'Assistenza impeccabile e prodotti di qualità. Consigliato!',
      },

      {
        id: 13,
        supplierId: 7,
        value: 3,
        body: 'Servizio nella media. Hanno bisogno di migliorare la comunicazione.',
      },
      {
        id: 14,
        supplierId: 7,
        value: 4,
        body: 'Buona qualità, ma il supporto tecnico a volte è lento a rispondere.',
      },

      {
        id: 15,
        supplierId: 8,
        value: 5,
        body: 'Assolutamente il miglior fornitore. Professionalità e innovazione garantiti.',
      },
      {
        id: 16,
        supplierId: 8,
        value: 4,
        body: 'Buon servizio, anche se potrebbero ottimizzare i tempi di consegna.',
      },

      {
        id: 17,
        supplierId: 9,
        value: 4,
        body: 'Soluzioni ecologiche interessanti, ma alcune implementazioni richiedono più tempo.',
      },
      {
        id: 18,
        supplierId: 9,
        value: 3,
        body: 'Servizio clienti da migliorare, ma i prodotti sono validi.',
      },

      {
        id: 19,
        supplierId: 10,
        value: 4,
        body: "Competenti e disponibili, un buon partner per l'informatica.",
      },
      {
        id: 20,
        supplierId: 10,
        value: 4,
        body: 'Hanno risolto tutti i problemi in tempo utile. Molto soddisfatto.',
      },
    ]);

    this._calculateMeanValutation();
  }

  private _calculateMeanValutation() {
    const reviews: SupplierReview[] = this._storageService.get('reviews');
    let suppliers: Supplier[] = this._storageService.get('suppliers');

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
    this._storageService.set('suppliers', suppliers);
  }

  public getSuppliers(searchPayload: SearchPayload) {
    this._loaderService.show();
    this.suppliers = this._storageService.get('suppliers') || [];

    if (searchPayload.searchText) {
      this.suppliers = this.suppliers.filter((supplier) =>
        supplier.businessName
          .toLocaleLowerCase()
          .includes(searchPayload.searchText?.toLocaleLowerCase()!)
      );
    }
    this._loaderService.hide();
    return of(this.suppliers);
  }

  public getSupplierById(supplierId: number) {
    this._loaderService.show();

    this.suppliers = this._storageService.get('suppliers') || [];
    const filteredSupplier = this.suppliers.find(
      (supplier) => supplier.id == supplierId
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
    this.reviews = this._storageService.get('reviews') || [];

    const filteredReviews = this.reviews.filter(
      (review) => review.supplierId == supplierId
    );
    this._loaderService.hide();
    return of(filteredReviews);
  }

  public update(user: RegisteredUser) {
    this._loaderService.show();
    this.reviews = this._storageService.get('reviews') || [];
    const foundIndex = this.reviews.findIndex((el) => el.id === user.id);
    if (foundIndex !== -1) {
      this.reviews[foundIndex] = { ...this.reviews[foundIndex], ...user };
      this._storageService.set('reviews', this.reviews);
      this._loaderService.hide();
      return of(true);
    } else {
      this._loaderService.hide();
      return throwError(
        () =>
          new Error(
            'Operazione fallita, la recensione inserita non è presente nel sistema.'
          )
      );
    }
  }

  public add(item: SupplierReview) {
    this._loaderService.show();
    this.reviews = this._storageService.get('reviews') || [];
    const newReview = {
      ...item,
      id:
        this.reviews.length > 0
          ? this.reviews[this.reviews.length - 1].id + 1
          : 0,
    };
    this.reviews.push(newReview);
    this._storageService.set('reviews', this.reviews);
    this._loaderService.hide();
    return of(true);
  }

  public delete(user: RegisteredUser) {
    this._loaderService.show();
    this.reviews = this._storageService.get('reviews') || [];
    const reviewIdx = this.reviews.findIndex((el) => el.id === user.id);
    if (reviewIdx) {
      this.reviews.splice(reviewIdx, 1);
      this._storageService.set('reviews', this.reviews);
      this._loaderService.hide();
      return of(true);
    } else {
      this._loaderService.hide();
      return throwError(
        () =>
          new Error(
            'Operazione fallita, la recensione non è presente nel sistema'
          )
      );
    }
  }
}
