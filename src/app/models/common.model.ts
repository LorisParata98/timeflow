export interface ApiResponse<T> {
  error: any | null;
  result: T;
}
export interface IdAttribute {
  id: number;
}

export interface ApiPaginatedItems<T> {
  items: T[];
  totalItems: number;
}
export interface Environment {
  production: boolean;
  publicKey: string;
}
