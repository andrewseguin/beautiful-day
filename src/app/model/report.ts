import {RequestRendererOptionsState} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';

export interface Report {
  $key?: string;
  name?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  season?: string;
  options?: RequestRendererOptionsState;
}
