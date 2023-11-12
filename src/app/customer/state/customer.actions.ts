import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ICustomer } from '../../shared/model/Customer';
// import { Customer } from './customer.model';

export const loadCustomers = createAction(
  '[Customer List Component] Load Customers'
);

export const loadCustomersSuccess = createAction(
  '[Customer Effect] Load Customers Success',
  props<{ customers: ICustomer[] }>()
);

export const loadCustomersFailure = createAction(
  '[Customer Effect] Load Customers Failure',
  props<{ error: any }>()
);

/** CUSTOMER ANS LIST */

export const loadANSCustomers = createAction(
  '[Customer List Component] Load ANS Customers'
);

export const loadANSCustomersSuccess = createAction(
  '[Customer Effect] Load ANS Customers Success',
  props<{ customers: ICustomer[] }>()
);

export const loadANSCustomersFailure = createAction(
  '[Customer Effect] Load ANS Customers Failure',
  props<{ error: any }>()
);

///
///  LOAD individual PRODUCTS
///***************** */

export const loadCustomer = createAction(
  '[Customer View Component] Load Customer',
  props<{ id: number }>()
);

// export const loadAdminProduct = createAction(
//   '[Product Item Component] Load Product',
//   props<{ id: string }>()
// );

export const loadCustomerSuccess = createAction(
  '[Customer Effect] Load Customer Success',
  props<{ selectedCustomer: ICustomer }>()
);

export const loadCustomerFailure = createAction(
  '[Customer Effect] Load Customer Failure',
  props<{ error: any }>()
);

export const clearCustomer = createAction(
  '[Customer/API] Clear Customer'
);
/*
 ADD INDIVIDUAL PRODUCT *****
*/

export const addCustomer = createAction(
  '[Customer Add Component] Add Customer',
  props<{ customer: ICustomer }>()
);

export const addCustomerSucess = createAction(
  '[Customer Effect] Add Customer Success',
  props<{ customer: ICustomer }>()
);

export const addCustomerFailure = createAction(
  '[Customer Effect] Add Customer Failure',
  props<{ error: any }>()
);

///* UPDATE INDIVIDUAL PRODUCT

// export const updateCustomer = createAction(
//   '[Customer Edit Component] Update Customer',
//   props<{ customer: Update<ICustomer> }>()
// );

export const upsertCustomer = createAction(
  '[Customer/API] Upsert Customer',
  props<{ customer: ICustomer }>()
);

export const upsertCustomerSuccess = createAction(
  '[Customer Effect] Upsert Customer Success',
  props<{ customer: ICustomer }>()
);

export const upsertCustomerFailure = createAction(
  '[Customer Effect] Upsert Customer failure',
  props<{ error: any }>()
);


//Delete Product

export const deleteCustomer = createAction(
  "[Customer Components] Delete Customer",
  props<{ id: number }>()
);

export const deleteCustomerSuccess = createAction(
  "[Customer Delete Effect] Delete Customer Success",
  props<{ id: number }>()
);

export const deleteCustomerFailure = createAction(
  "[Customer Delete Effect] Delete Customer Failure",
  props<{ error: any }>()
);

// export const addCustomers = createAction(
//   '[Customer/API] Add Customers',
//   props<{ customers: ICustomer[] }>()
// );

// export const upsertCustomers = createAction(
//   '[Customer/API] Upsert Customers',
//   props<{ customers: Customer[] }>()
// );

// export const updateCustomer = createAction(
//   '[Customer/API] Update Customer',
//   props<{ customer: Update<Customer> }>()
// );

// export const updateCustomers = createAction(
//   '[Customer/API] Update Customers',
//   props<{ customers: Update<Customer>[] }>()
// );

// export const deleteCustomer = createAction(
//   '[Customer/API] Delete Customer',
//   props<{ id: string }>()
// );

// export const deleteCustomers = createAction(
//   '[Customer/API] Delete Customers',
//   props<{ ids: string[] }>()
// );

// export const clearCustomers = createAction(
//   '[Customer/API] Clear Customers'
// );
