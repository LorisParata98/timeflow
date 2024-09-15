import { IdAttribute } from './common.model';

export interface Supplier extends IdAttribute {
  meanValutation: number;
  businessName: string;
}

export interface SupplierReview extends IdAttribute {
  supplierId: number;
  userEmail: string;
  date: string;
  value: number;
  body: string;
}
