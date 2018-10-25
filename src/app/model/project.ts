export interface Project {
  id?: string;
  location?: string;
  name?: string;
  season?: string;
  budget?: number;
  description?: string;
  leads?: string[];
  directors?: string[];
  acquisitions?: string[];
  lastUsedDropoff?: string;
  lastUsedDate?: string;
  receiptsFolder?: string;
  whitelist?: string[];
}
