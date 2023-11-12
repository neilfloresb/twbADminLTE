import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as GLJVReducer from './gledger.reducer';

export const selectGLJVState = createFeatureSelector<GLJVReducer.GlJVState>(
  //  CustomerReducer.customersFeatureKey
  GLJVReducer.gledgersFeatureKey
);

export const selectGLJV = createSelector(
  selectGLJVState,
  GLJVReducer.adapter.getSelectors().selectAll
);

export const selectedCustomer = createSelector(
  selectGLJVState,
  (state: GLJVReducer.GlJVState) => state.selectedGlJV

);

/** */

export const selectAllEntities = createSelector(
  selectGLJVState,
  GLJVReducer.selectGLJVEntities
  // Customer.selectEntities
);

export const selectError = createSelector(
  selectGLJVState,
  (state: GLJVReducer.GlJVState) => state.error
  //adapter.getSelectors().selectAll
);
/** From OOP CODERS  */
export const entityExists = createSelector(
  selectAllEntities,
  (entities, props): boolean => {
    return entities[props.id] == undefined ? false : true;
  }
);


export const selectEntityById = createSelector(
  selectAllEntities,
  (entites, props) => entites[props.id]
);
/**  END  FROM OOP CODERS */

export const selectCurrentGLJV = createSelector(
  selectGLJVState,
  GLJVReducer.getSelectedGLJVref_no
);

export const selectCurrentUser = createSelector(
  selectGLJVState,
  selectCurrentGLJV,
  (entites, props) => entites[props.ref_no]
);