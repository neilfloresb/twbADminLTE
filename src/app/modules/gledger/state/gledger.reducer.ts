import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// import { Gledger } from './gledger.model';
import * as GledgerActions from './gledger.actions';
import { IGLJVheader } from 'src/app/shared/model/glJVHeader';

export const gledgersFeatureKey = 'GlJVState';

export interface GlJVState extends EntityState<IGLJVheader> {
  // additional entities state properties
  selectedGlJV: IGLJVheader;
  error: any;
}

/** */
export function selectGLJVref_no(a: IGLJVheader): string {
  return a.ref_no;
  //In this case this would be optional since primary key is id
}
// export function sortByName(a: IGLJVheader, b: IGLJVheader): number {
//   return a.custname.localeCompare(b.custname);
// }
export const adapter: EntityAdapter<IGLJVheader> = createEntityAdapter<IGLJVheader>(
  {
    selectId: selectGLJVref_no,
    // sortComparer: sortByName,
  }
);
/** */

export const initialState = adapter.getInitialState({
  //customers: null,
  selectedGlJV: null,
  error: undefined
  // additional entity state properties
});


export const gljvreducer = createReducer(
  initialState,
  on(GledgerActions.loadGledgersSucess,
    (state, action) => {
      return adapter.setAll(action.gledgers, state)
    }
  ),
  on(GledgerActions.addJVHeaderSuccess, (state, action) =>
    adapter.addOne(action.gledgers, state)
  ),
  on(GledgerActions.upsertJVHeaderSuccess,
    (state, action) =>
      adapter.upsertOne(action.gledgers, state)
  ),
  on(GledgerActions.deleteJVHeaderSuccess,
    (state, action) =>
      adapter.removeOne(action.id, state)
  ),
  on(GledgerActions.loadGledgersFailure,
    GledgerActions.addJVHeaderFailure,
    GledgerActions.upsertJVHeaderFailure,
    GledgerActions.deleteJVHeaderFailure,
    (state, action) => {
      return {
        ...state,
        error: action.error
      };
    }),

  // on(GledgerActions.addGledger,
  //   (state, action) => adapter.addOne(action.gledger, state)
  // ),
  // on(GledgerActions.upsertGledger,
  //   (state, action) => adapter.upsertOne(action.gledger, state)
  // ),
  // on(GledgerActions.addGledgers,
  //   (state, action) => adapter.addMany(action.gledgers, state)
  // ),
  // on(GledgerActions.upsertGledgers,
  //   (state, action) => adapter.upsertMany(action.gledgers, state)
  // ),
  // on(GledgerActions.updateGledger,
  //   (state, action) => adapter.updateOne(action.gledger, state)
  // ),
  // on(GledgerActions.updateGledgers,
  //   (state, action) => adapter.updateMany(action.gledgers, state)
  // ),
  // on(GledgerActions.deleteGledger,
  //   (state, action) => adapter.removeOne(action.id, state)
  // ),
  // on(GledgerActions.deleteGledgers,
  //   (state, action) => adapter.removeMany(action.ids, state)
  // ),

  on(GledgerActions.clearJVHeaderr,
    state => adapter.removeAll(state)
  ),
);
export function reducer(state: GlJVState | undefined, action: Action) {
  return gljvreducer(state, action);
}
export const getSelectedGLJVref_no = (state: GlJVState) => state.selectedGlJV;
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// select the dictionary of user entities
export const selectGLJVEntities = selectEntities;