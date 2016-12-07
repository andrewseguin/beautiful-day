export interface Project {
  $key?: string;
  $exists?: Function;
  location?: string;
  name?: string;
  description?: string;
  managers?: string;
  director?: string;
  dropoff?: Map<string, string>;
  lastUsedDropoff?: string;
  lastUsedDate?: string;
  auth?: string[];
}
