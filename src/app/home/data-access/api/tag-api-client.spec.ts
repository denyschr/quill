import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { TagApiClient } from './tag-api-client';

describe('TagApiClient', () => {
  let httpController: HttpTestingController;
  let tagApiClient: TagApiClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    tagApiClient = TestBed.inject(TagApiClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should return a list of tags', () => {
    const mockTags = ['dragons', 'training'];

    let actualTags: string[] | undefined;
    tagApiClient.getAll().subscribe(fetchedTags => (actualTags = fetchedTags));

    httpController.expectOne('/tags').flush({ tags: mockTags });

    expect(actualTags).withContext('The observable should emit the list of tags').toBe(mockTags);
  });
});
