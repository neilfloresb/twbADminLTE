
import { createFeatureSelector, createSelector } from "@ngrx/store";
//import {CustomerState,customersFeatureKey, adapter} from './customer.reducer';
import * as fromCustomerReducer from './customer.reducer';

import * as CustomerReducer from './customer.reducer';

export const selectCustomersState = createFeatureSelector<CustomerReducer.CustomerState>(
  CustomerReducer.customersFeatureKey
);

export const selectCustomers = createSelector(
  selectCustomersState,
  // (state: CustomerState) => state.customers
  CustomerReducer.adapter.getSelectors().selectAll
);

export const selectedCustomer = createSelector(
  selectCustomersState,
  (state: CustomerReducer.CustomerState) => state.selectedCustomer
  //CustomerReducer.selectCustIds
);


export const selectAllEntities = createSelector(
  selectCustomersState,
  CustomerReducer.selectCustomerEntities
  // Customer.selectEntities
);

export const selectError = createSelector(
  selectCustomersState,
  (state: CustomerReducer.CustomerState) => state.error
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

export const selectCurrentCustomer = createSelector(
  selectCustomersState,
  CustomerReducer.getSelectedUserId
);

export const selectCurrentUser = createSelector(
  selectCustomersState,
  selectCurrentCustomer,
  (entites, props) => entites[props.custid]
);