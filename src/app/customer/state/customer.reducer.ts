import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// import { Customer } from './customer.model';
import * as CustomerActions from './customer.actions';
import { ICustomer } from 'src/app/shared/model/Customer';
import { state } from '@angular/animations';

//import { Action } from 'rxjs/internal/scheduler/Action';
//import { Action } from 'rxjs/internal/scheduler/Action';

export const customersFeatureKey = 'customersState';

export interface CustomerState extends EntityState<ICustomer> {
  // additional entities state properties
  //customers: ICustomer[];
  //selectedCustomerId: number | null;
  selectedCustomer: ICustomer;
  error: any;
}

/** */
export function selectCustID(a: ICustomer): number {
  return a.custid;
  //In this case this would be optional since primary key is id
}
export function sortByName(a: ICustomer, b: ICustomer): number {
  return a.custname.localeCompare(b.custname);
}
export const adapter: EntityAdapter<ICustomer> = createEntityAdapter<ICustomer>(
  {
    selectId: selectCustID,
    sortComparer: sortByName,
  }
);
/** */

export const initialState = adapter.getInitialState({
  //customers: null,
  selectedCustomer: null,
  error: undefined
  // additional entity state properties
});


//export const reducer = createReducer(
const customerReducer = createReducer(
  initialState,
  on(CustomerActions.loadCustomersSuccess,
    CustomerActions.loadANSCustomersSuccess,
    (state, action) => {
      return adapter.setAll(action.customers, state)
    }
  ),
  on(CustomerActions.loadCustomerSuccess, (state, action) => {
    return {
      ...state,
      selectedCustomer: action.selectedCustomer
    };
  }),
  on(CustomerActions.addCustomerSucess, (state, action) =>
    adapter.addOne(action.customer, state)
  ),
  on(CustomerActions.upsertCustomerSuccess,
    (state, action) =>
      adapter.upsertOne(action.customer, state)
  ),
  on(CustomerActions.deleteCustomer,
    (state, action) =>
      adapter.removeOne(action.id, state)
  ),
  on(CustomerActions.addCustomerFailure,
    CustomerActions.loadCustomersFailure,
    CustomerActions.loadANSCustomersFailure,
    CustomerActions.upsertCustomerFailure,
    CustomerActions.deleteCustomerFailure,
    (state, action) => {
      return {
        ...state,
        error: action.error
      };
    }),
  // on(CustomerActions.loadCustomerSuccess,
  //   (state, action) =>
  //     adapter.addOne(action.customer, state)
  // )
  // on(CustomerActions.addCustomer,
  //   (state, action) => adapter.addOne(action.customer, state)
  // ),
  // on(CustomerActions.upsertCustomer,
  //   (state, action) => adapter.upsertOne(action.customer, state)
  // ),
  // on(CustomerActions.addCustomers,
  //   (state, action) => adapter.addMany(action.customers, state)
  // ),
  // on(CustomerActions.upsertCustomers,
  //   (state, action) => adapter.upsertMany(action.customers, state)
  // ),
  // on(CustomerActions.updateCustomer,
  //   (state, action) => adapter.updateOne(action.customer, state)
  // ),
  // on(CustomerActions.updateCustomers,
  //   (state, action) => adapter.updateMany(action.customers, state)
  // ),
  // on(CustomerActions.deleteCustomer,
  //   (state, action) => adapter.removeOne(action.id, state)
  // ),
  // on(CustomerActions.deleteCustomers,
  //   (state, action) => adapter.removeMany(action.ids, state)
  // ),
  // // on(CustomerActions.loadCustomers,
  // //   (state, action) => adapter.setAll(action.customers, state)
  // // ),
  on(CustomerActions.clearCustomer,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: CustomerState | undefined, action: Action) {
  return customerReducer(state, action);
}

export const getSelectedUserId = (state: CustomerState) => state.selectedCustomer;

//export const {
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
// select the array of user ids
//export const selectCustIds = selectIds;

// select the dictionary of user entities
export const selectCustomerEntities = selectEntities;

// select the array of users
export const selectAllCustomers = selectAll;

// select the total user count
export const selectCustomersTotal = selectTotal;
