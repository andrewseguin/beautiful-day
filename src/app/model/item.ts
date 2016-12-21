export interface Item {
  $key?: string,
  name?: string;
  type?: string;
  category?: string;
  url?: string;
  cost?: number;
  isApproved?: boolean;
  isRental?: boolean;
  addedBy?: string;
  dateAdded?: number;
}
