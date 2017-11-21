import {RequestViewOptions} from './request-view-options';
import {Sort} from '../ui/shared/requests-list/requests-group/requests-group.component';
import {Group} from '../service/request-grouping.service';

export interface DisplayOptions {
  filter?: string;
  grouping?: Group;
  sorting?: Sort;
  reverseSort?: boolean;
  viewing?: RequestViewOptions;
}
