export interface Project {
  id?: string;
  location?: string;
  name?: string;
  season?: string;
  budget?: number;
  description?: string;
  leads?: string;
  directors?: string;
  acquisitions?: string;
  dropoff?: Map<string, string>;
  lastUsedDropoff?: string;
  lastUsedDate?: string;
  auth?: string[];
  receiptsFolder?: string;
  whitelist?: string;
}
