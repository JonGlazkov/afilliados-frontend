export type Role = {
  1: 'CREATOR';
  2: 'AFFILIATED';
};
export type TransactionType = {
  1: 'CREATOR_SALE';
  2: 'AFFILIATED_SALE';
  3: 'COMMISSION_PAID';
  4: 'COMMISSION_RECEIVED';
};

export interface Seller {
  id: string;
  name: string;
  role: number;
}

export interface Transactions {
  id: string;
  product: string;
  value: number;
  date: string;
  transactionType: number;
  sellerName: string;
  sellerType: number;
  seller: Seller;
}
