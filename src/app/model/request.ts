export interface Request {
  id?: string;
  project?: string;
  item?: string;
  dropoff?: string;
  quantity?: number;
  note?: string;
  date?: string;
  tags?: string[];
  purchaser?: string;
  isPurchased?: boolean;
  isApproved?: boolean;
  allocation?: number;
  distributionDate?: string;
  isDistributed?: boolean;
}
