import { IdAttribute } from './common.model';

export interface Supplier extends IdAttribute {
  meanValutation: number;
  businessName: string;
}

export interface SupplierReview extends IdAttribute {
  supplierId: number;
  value: number;
  body: number;
}
