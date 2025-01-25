import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { tagsActions } from './tags.actions';
import * as tagsEffects from './tags.effects';
import { TagApiClient } from '@app/home/data-access/services';

describe('TagsEffects', () => {
  let tagClient: jasmine.SpyObj<TagApiClient>;
  let actions$: Observable<unknown>;

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
    it('should return a loadTagsSuccess action with a list of tags on success', done => {
      const tags = ['dragons', 'training'];
      actions$ = of(tagsActions.loadTags);

      tagClient.getAll.and.returnValue(of(tags));

      tagsEffects.loadTags$(actions$, tagClient).subscribe(action => {
        expect(tagClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(tagsActions.loadTagsSuccess({ tags }));
        done();
      });
    });

    it('should return a loadTagsFailure action on failure', done => {
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
