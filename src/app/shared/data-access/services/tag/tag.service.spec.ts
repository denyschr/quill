import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TagService } from './tag.service';

describe('TagService', () => {
  let tagService: TagService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    tagService = TestBed.inject(TagService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(tagService).toBeTruthy();
  });

  it('should get a list of tags', () => {
    const hardcodedTags = { tags: ['esse', 'at', 'ipsum', 'sunt', 'maiores'] };

    let actualTags: string[] | undefined;
    tagService.getAll().subscribe(tags => (actualTags = tags));

    http.expectOne({ method: 'GET', url: '/tags' }).flush(hardcodedTags);

    expect(actualTags)
      .withContext('The observable should emit the list of tags')
      .toBe(hardcodedTags.tags);
  });
});
