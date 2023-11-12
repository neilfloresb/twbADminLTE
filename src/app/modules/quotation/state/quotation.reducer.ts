import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Quotation } from './quotation.model';
import * as QuotationActions from './quotation.actions';

export const quotationsFeatureKey = 'quotations';

export interface State extends EntityState<Quotation> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Quotation> = createEntityAdapter<Quotation>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});


export const reducer = createReducer(
  initialState,
  on(QuotationActions.addQuotation,
    (state, action) => adapter.addOne(action.quotation, state)
  ),
  on(QuotationActions.upsertQuotation,
    (state, action) => adapter.upsertOne(action.quotation, state)
  ),
  on(QuotationActions.addQuotations,
    (state, action) => adapter.addMany(action.quotations, state)
  ),
  on(QuotationActions.upsertQuotations,
    (state, action) => adapter.upsertMany(action.quotations, state)
  ),
  on(QuotationActions.updateQuotation,
    (state, action) => adapter.updateOne(action.quotation, state)
  ),
  on(QuotationActions.updateQuotations,
    (state, action) => adapter.updateMany(action.quotations, state)
  ),
  on(QuotationActions.deleteQuotation,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(QuotationActions.deleteQuotations,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(QuotationActions.loadQuotations,
    (state, action) => adapter.setAll(action.quotations, state)
  ),
  on(QuotationActions.clearQuotations,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
