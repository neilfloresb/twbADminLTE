import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GlJVState } from './gledger.reducer';
import { GljvService } from '../../../service/gljv.service';
import * as fromGlJVActions from '../state/gledger.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';



@Injectable()
export class GledgerEffects {

  loadGLjv$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromGlJVActions.loadGledgers),
      mergeMap(() =>
        this.glJVservice.getglJVHeader().pipe(
          map(gledgers =>
            fromGlJVActions.loadGledgersSucess({ gledgers }),
          ),
          catchError(error =>
            of(fromGlJVActions.loadGledgersFailure({ error }))
          )
        )
      )
    )
  );

  createGlJv$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromGlJVActions.addJVHeader),
      mergeMap(action =>
        this.glJVservice.InsertJVHeader(action.gledgers).pipe(
          map(gledgers => fromGlJVActions.addJVHeaderSuccess({ gledgers: gledgers })),
          catchError(error =>
            of(fromGlJVActions.addJVHeaderFailure({ error }))
          )
        )
      ),
      //    tap(() => this.router.navigate(["/product/list"]))
    )
  );

  updateJVHeader$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromGlJVActions.upsertJVHeader),
      mergeMap((action) =>
        this.glJVservice.UpdateJVHeader(action.gledgers).pipe(
          map((gledgers) =>
            fromGlJVActions.upsertJVHeaderSuccess({ gledgers })
          ),
          catchError((error) =>
            of(fromGlJVActions.upsertJVHeaderFailure({ error }))
          )
        )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromGlJVActions.deleteJVHeader),
      mergeMap(action =>
        this.glJVservice.deleteJVHeader(action.id).pipe(
          map(() => fromGlJVActions.deleteJVHeaderSuccess({ id: action.id })),
          catchError(error =>
            of(fromGlJVActions.deleteJVHeaderFailure({ error }))
          )
        )
      ),
      // tap(() => this.router.navigate(["/product/list"])) // Not in Video 12
    )
  );


  constructor(private actions$: Actions, private glJVservice: GljvService) { }

}
