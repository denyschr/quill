import { TagApiClient } from '@shared/data-access/api';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { tagsActions } from './tags.actions';
import * as tagsEffects from './tags.effects';

describe('TagsEffects', () => {
  let tagClient: jasmine.SpyObj<TagApiClient>;
  let actions$: Observable<unknown>;

  const tags = ['tag one', 'tag two'];

  beforeEach(() => {
    tagClient = jasmine.createSpyObj<TagApiClient>('TagApiClient', ['getAll']);

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: TagApiClient, useValue: tagClient }
      ]
    });
  });

  describe('loadTags$', () => {
    it('should return a `loadTagsSuccess` action with an array of tags on success', done => {
      actions$ = of(tagsActions.loadTags);

      tagClient.getAll.and.returnValue(of(tags));

      tagsEffects.loadTags$(actions$, tagClient).subscribe(action => {
        expect(tagClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(tagsActions.loadTagsSuccess({ tags }));
        done();
      });
    });

    it('should return a `loadTagsFailure` action on failure', done => {
      actions$ = of(tagsActions.loadTags);

      tagClient.getAll.and.returnValue(throwError(() => new Error('error')));

      tagsEffects.loadTags$(actions$, tagClient).subscribe(action => {
        expect(tagClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(tagsActions.loadTagsFailure());
        done();
      });
    });
  });
});
