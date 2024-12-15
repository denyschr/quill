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

  it('should be created', () => {
    expect(tagClient).toBeTruthy();
  });

  it('should return a list of tags', () => {
    const expectedTags = ['tag one', 'tag two', 'tag three'];

    let actualTags: string[] | undefined;
    tagClient.getAll().subscribe(tags => (actualTags = tags));

    httpController.expectOne('/tags').flush({ tags: expectedTags });

    expect(actualTags)
      .withContext('The `getAll` method should return an array of strings wrapped in an Observable')
      .toBe(expectedTags);
  });
});
