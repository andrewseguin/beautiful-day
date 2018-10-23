export interface Request {
  id?: string;
  project?: string;
  item?: string;
  dropoff?: string;
  quantity?: number;
  note?: string;
  date?: number;
  tags?: string;
  purchaser?: string;
  isPurchased?: boolean;
  isApproved?: boolean;
  allocation?: number;
  distributionDate?: number;
  isDistributed?: boolean;
}
