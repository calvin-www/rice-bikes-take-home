import pool from '@/lib/db';
import { Transaction } from '@/types';

/**
 * Fetches all repair transactions with joined customer and bike data,
 * sorted by transaction_date descending (most recent first).
 */
export async function getAllTransactions(): Promise<Transaction[]> {
  const result = await pool.query(`
    SELECT
      rt.transaction_id,
      rt.transaction_date,
      rt.total_cost,
      c.customer_id,
      c.first_name,
      c.last_name,
      c.email,
      c.phone_number,
      b.bike_id,
      b.make,
      b.model
    FROM repair_transactions rt
    JOIN customers c ON rt.customer_id = c.customer_id
    JOIN bikes b ON rt.bike_id = b.bike_id
    ORDER BY rt.transaction_date DESC
  `);

  return result.rows.map((row) => ({
    transaction_id: row.transaction_id,
    transaction_date:
      row.transaction_date instanceof Date
        ? row.transaction_date.toISOString().split('T')[0]
        : row.transaction_date,
    total_cost: parseFloat(row.total_cost),
    customer: {
      id: row.customer_id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone_number: row.phone_number,
    },
    bike: {
      id: row.bike_id,
      make: row.make,
      model: row.model,
    },
  }));
}
