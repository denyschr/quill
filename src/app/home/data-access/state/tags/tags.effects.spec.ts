import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { tagsActions } from './tags.actions';
import * as tagsEffects from './tags.effects';
import { TagApiClient } from '../../api/tag-api-client';

describe('TagsEffects', () => {
  let mockTagApiClient: jasmine.SpyObj<TagApiClient>;
  let actions$: Observable<unknown>;

  beforeEach(() => {
    mockTagApiClient = jasmine.createSpyObj<TagApiClient>('TagApiClient', ['getAll']);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: TagApiClient, useValue: mockTagApiClient }
      ]
    });
  });

  describe('loadTags$', () => {
    it('should return a loadTagsSuccess action with a list of tags on success', done => {
      const mockTags = ['dragons', 'training'];
      actions$ = of(tagsActions.loadTags);

      mockTagApiClient.getAll.and.returnValue(of(mockTags));

      tagsEffects.loadTags$(actions$, mockTagApiClient).subscribe(action => {
        expect(mockTagApiClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(tagsActions.loadTagsSuccess({ tags: mockTags }));
        done();
      });
    });

    it('should return a loadTagsFailure action on failure', done => {
      actions$ = of(tagsActions.loadTags);

      mockTagApiClient.getAll.and.returnValue(throwError(() => new Error('error')));

      tagsEffects.loadTags$(actions$, mockTagApiClient).subscribe(action => {
        expect(mockTagApiClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(tagsActions.loadTagsFailure());
        done();
      });
    });
  });
});
