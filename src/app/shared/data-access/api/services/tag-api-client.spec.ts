import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TagApiClient } from './tag-api-client';

describe('TagApiClient', () => {
  let tagClient: TagApiClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    tagClient = TestBed.inject(TagApiClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should return a list of tags', () => {
    const expectedTags = ['dragons', 'training'];

    let actualTags: string[] | undefined;
    tagClient.getAll().subscribe(tags => (actualTags = tags));

    httpController.expectOne('/tags').flush({ tags: expectedTags });

    expect(actualTags)
      .withContext('The observable should emit the list of tags')
      .toBe(expectedTags);
  });
});
