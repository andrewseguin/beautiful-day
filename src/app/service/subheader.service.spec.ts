/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SubheaderService } from './subheader.service';

describe('Service: Subheader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubheaderService]
    });
  });

  it('should ...', inject([SubheaderService], (service: SubheaderService) => {
    expect(service).toBeTruthy();
  }));
});
