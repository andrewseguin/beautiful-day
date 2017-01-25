export interface Item {
  $key?: string,
  name?: string;
  type?: string;
  categories?: string;
  url?: string;
  cost?: number;
  isApproved?: boolean;
  isRental?: boolean;
  addedBy?: string;
  dateAdded?: number;
  keywords?: string;
  quantityOwned?: number;
}
