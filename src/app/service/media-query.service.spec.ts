/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MediaQueryService } from './media-query.service';

describe('Service: MediaQuery', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaQueryService]
    });
  });

  it('should ...', inject([MediaQueryService], (service: MediaQueryService) => {
    expect(service).toBeTruthy();
  }));
});
