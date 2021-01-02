import { TestBed } from '@angular/core/testing';

import { GithubAccessService } from './github-access.service';

describe('GithubAccessService', () => {
  let service: GithubAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
