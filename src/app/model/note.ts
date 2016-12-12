export interface Note {
  $key?: string;
  $exists?: Function;
  title?: string;
  text?: string;
  project?: string;
}
