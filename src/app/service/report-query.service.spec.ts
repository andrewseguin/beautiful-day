/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReportQueryService } from './report-query.service';

describe('ReportQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportQueryService]
    });
  });

  it('should ...', inject([ReportQueryService], (service: ReportQueryService) => {
    expect(service).toBeTruthy();
  }));
});
