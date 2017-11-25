export interface Item {
  $key?: string;
  name?: string;
  categories?: string;
  url?: string;
  cost?: number;
  isApproved?: boolean;
  isRental?: boolean;
  addedBy?: string;
  dateAdded?: number;
  keywords?: string;
  quantityOwned?: string;
}
