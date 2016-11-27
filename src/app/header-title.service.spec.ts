/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HeaderTitleService } from './header-title.service';

describe('Service: HeaderTitle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderTitleService]
    });
  });

  it('should ...', inject([HeaderTitleService], (service: HeaderTitleService) => {
    expect(service).toBeTruthy();
  }));
});
