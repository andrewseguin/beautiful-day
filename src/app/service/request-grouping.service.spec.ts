/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RequestGroupingService } from './request-grouping.service';

describe('Service: RequestGrouping', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestGroupingService]
    });
  });

  it('should ...', inject([RequestGroupingService], (service: RequestGroupingService) => {
    expect(service).toBeTruthy();
  }));
});
