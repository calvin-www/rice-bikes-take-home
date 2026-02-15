export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
}

export interface Bike {
  id: number;
  make: string;
  model: string;
}

export interface Transaction {
  transaction_id: number;
  transaction_date: string;
  total_cost: number;
  customer: Customer;
  bike: Bike;
}
