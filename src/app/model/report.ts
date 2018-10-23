import {RequestRendererOptionsState} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';

export interface Report {
  id?: string;
  name?: string;
  group?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  season?: string;
  options?: RequestRendererOptionsState;
}
