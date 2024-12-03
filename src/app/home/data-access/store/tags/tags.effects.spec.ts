import { TagApiClient } from '@shared/data-access/api';
import { Observable, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { tagsActions } from './tags.actions';
import * as tagsEffects from './tags.effects';

describe('TagsEffects', () => {
  let tagApiClient: jasmine.SpyObj<TagApiClient>;
  let actions$: Observable<unknown>;

  const tags = ['tag one', 'tag two'];

  beforeEach(() => {
    tagApiClient = jasmine.createSpyObj<TagApiClient>('TagApiClient', ['getAll']);

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: TagApiClient, useValue: tagApiClient }
      ]
    });
  });

  describe('loadTags', () => {
    it('should return a getTagsSuccess action with an array of tags if success', done => {
      actions$ = of(tagsActions.loadTags);

      tagApiClient.getAll.and.returnValue(of(tags));

      tagsEffects.getTags(actions$, tagApiClient).subscribe(action => {
        expect(tagApiClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(tagsActions.loadTagsSuccess({ tags }));
        done();
      });
    });
  });
});
