/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjectsService } from './projects.service';

describe('Service: Projects', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectsService]
    });
  });

  it('should ...', inject([ProjectsService], (service: ProjectsService) => {
    expect(service).toBeTruthy();
  }));
});
