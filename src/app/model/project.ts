export interface Project {
  $key?: string;
  location?: string;
  name?: string;
  description?: string;
  dropoff?: Map<string, string>;
  lastUsedDropoff?: string;
  lastUsedDate?: string;
}
