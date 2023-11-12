import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Gledger } from './gledger.model';
import { IGLJVheader } from 'src/app/shared/model/glJVHeader';


/**  LOAD LIST OF JOURNAL VOUCHERS*/

export const loadGledgers = createAction(
  '[GLJV List Component] Load GLJV'
);
export const loadGledgersSucess = createAction(
  '[GLJV Effect] Load Gledgers',
  props<{ gledgers: IGLJVheader[] }>()
);

export const loadGledgersFailure = createAction(
  '[GLJV Effect] Load Gledgers Failure',
  props<{ error: any }>()
);
/*** */
/*
 ADD INDIVIDUAL PRODUCT *****
*/
export const addJVHeader = createAction(
  '[Glheader Add Component] Add GlHeader',
  props<{ gledgers: IGLJVheader }>()
);

export const addJVHeaderSuccess = createAction(
  '[GlHeader Effect] Add GlHeader Success',
  props<{ gledgers: IGLJVheader }>()
);

export const addJVHeaderFailure = createAction(
  '[GlHeader Effect] Add GlHeader Failure',
  props<{ error: any }>()
);
/** end of add gljvheader */

///* UPDATE INDIVIDUAL JVHeader
export const upsertJVHeader = createAction(
  '[GlJVHeader/API ] Upsert JVHeader',
  props<{ gledgers: IGLJVheader }>()
);

export const upsertJVHeaderSuccess = createAction(
  '[GlJVHeader Effect] Upsert Customer Success',
  props<{ gledgers: IGLJVheader }>()
);

export const upsertJVHeaderFailure = createAction(
  '[GlJVHeader Effect] Upsert Customer failure',
  props<{ error: any }>()
);
/** end of Update gljvheader */

//Delete JVHeader
export const deleteJVHeader = createAction(
  "[JVHeader Components] Delete JVHeader",
  props<{ id: string }>()
);

export const deleteJVHeaderSuccess = createAction(
  "[JVHeader Delete Effect] Delete JVHeader Success",
  props<{ id: string }>()
);

export const deleteJVHeaderFailure = createAction(
  "[JVHeader Delete Effect] Delete JVHeader Failure",
  props<{ error: any }>()
);

export const clearJVHeaderr = createAction(
  '[JVHeader/API] Clear JVHeader'
);



// End of Delete JVHeader

// export const addGledger = createAction(
//   '[Gledger/API] Add Gledger',
//   props<{ gledger: Gledger }>()
// );

// export const upsertGledger = createAction(
//   '[Gledger/API] Upsert Gledger',
//   props<{ gledger: Gledger }>()
// );

// export const addGledgers = createAction(
//   '[Gledger/API] Add Gledgers',
//   props<{ gledgers: Gledger[] }>()
// );

// export const upsertGledgers = createAction(
//   '[Gledger/API] Upsert Gledgers',
//   props<{ gledgers: Gledger[] }>()
// );

// export const updateGledger = createAction(
//   '[Gledger/API] Update Gledger',
//   props<{ gledger: Update<Gledger> }>()
// );

// export const updateGledgers = createAction(
//   '[Gledger/API] Update Gledgers',
//   props<{ gledgers: Update<Gledger>[] }>()
// );

// export const deleteGledger = createAction(
//   '[Gledger/API] Delete Gledger',
//   props<{ id: string }>()
// );

// export const deleteGledgers = createAction(
//   '[Gledger/API] Delete Gledgers',
//   props<{ ids: string[] }>()
// );

// export const clearGledgers = createAction(
//   '[Gledger/API] Clear Gledgers'
// );
