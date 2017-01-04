import {Note} from "./note";

export interface Project {
  $key?: string;
  $exists?: Function;
  location?: string;
  name?: string;
  budget?: number;
  description?: string;
  leads?: string;
  director?: string;
  acquisitions?: string;
  dropoff?: Map<string, string>;
  lastUsedDropoff?: string;
  lastUsedDate?: string;
  auth?: string[];
  notes?: Note[];
}
