import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Quotation } from './quotation.model';

export const loadQuotations = createAction(
  '[Quotation/API] Load Quotations', 
  props<{ quotations: Quotation[] }>()
);

export const addQuotation = createAction(
  '[Quotation/API] Add Quotation',
  props<{ quotation: Quotation }>()
);

export const upsertQuotation = createAction(
  '[Quotation/API] Upsert Quotation',
  props<{ quotation: Quotation }>()
);

export const addQuotations = createAction(
  '[Quotation/API] Add Quotations',
  props<{ quotations: Quotation[] }>()
);

export const upsertQuotations = createAction(
  '[Quotation/API] Upsert Quotations',
  props<{ quotations: Quotation[] }>()
);

export const updateQuotation = createAction(
  '[Quotation/API] Update Quotation',
  props<{ quotation: Update<Quotation> }>()
);

export const updateQuotations = createAction(
  '[Quotation/API] Update Quotations',
  props<{ quotations: Update<Quotation>[] }>()
);

export const deleteQuotation = createAction(
  '[Quotation/API] Delete Quotation',
  props<{ id: string }>()
);

export const deleteQuotations = createAction(
  '[Quotation/API] Delete Quotations',
  props<{ ids: string[] }>()
);

export const clearQuotations = createAction(
  '[Quotation/API] Clear Quotations'
);
