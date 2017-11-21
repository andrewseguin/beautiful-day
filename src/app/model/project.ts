import {Note} from './note';

export interface Project {
  $key?: string;
  location?: string;
  name?: string;
  budget?: number;
  description?: string;
  leads?: string;
  directors?: string;
  acquisitions?: string;
  dropoff?: Map<string, string>;
  lastUsedDropoff?: string;
  lastUsedDate?: string;
  auth?: string[];
  notes?: Note[];
  receiptsFolder?: string;
}
