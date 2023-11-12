import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCustomer from '../customer/state/customer.reducer';
import * as fromGledger from '../modules/gledger/state/gledger.reducer';
import * as fromQuotation from '../modules/quotation/state/quotation.reducer';



export interface AppState {


  [fromCustomer.customersFeatureKey]: fromCustomer.CustomerState;
  [fromGledger.gledgersFeatureKey]: fromGledger.GlJVState;
  [fromQuotation.quotationsFeatureKey]: fromQuotation.State;
}

export const reducers: ActionReducerMap<AppState> = {


  [fromCustomer.customersFeatureKey]: fromCustomer.reducer,
  [fromGledger.gledgersFeatureKey]: fromGledger.reducer,
  [fromQuotation.quotationsFeatureKey]: fromQuotation.reducer,
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
