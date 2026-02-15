import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => {
  const mockQuery = vi.fn();
  return {
    default: { query: mockQuery },
  };
});

import pool from '@/lib/db';
import { GET } from '@/app/api/transactions/route';

const mockPool = pool as unknown as { query: ReturnType<typeof vi.fn> };

const fakeRows = [
  {
    transaction_id: 10,
    transaction_date: '2026-01-28',
    total_cost: '55.00',
    customer_id: 4,
    first_name: 'Sophie',
    last_name: 'Kim',
    email: 'sophie.kim@email.com',
    phone_number: '7135550104',
    bike_id: 5,
    make: 'Santa Cruz',
    model: 'Hightower',
  },
  {
    transaction_id: 9,
    transaction_date: '2026-01-25',
    total_cost: '180.00',
    customer_id: 5,
    first_name: 'Daniel',
    last_name: 'Reed',
    email: 'daniel.reed@email.com',
    phone_number: '7135550105',
    bike_id: 4,
    make: 'Cannondale',
    model: 'Synapse',
  },
  {
    transaction_id: 8,
    transaction_date: '2026-01-22',
    total_cost: '95.75',
    customer_id: 2,
    first_name: 'Maria',
    last_name: 'Lopez',
    email: 'maria.lopez@email.com',
    phone_number: '7135550102',
    bike_id: 3,
    make: 'Giant',
    model: 'Defy',
  },
];

beforeEach(() => {
  mockPool.query.mockReset();
  mockPool.query.mockResolvedValue({ rows: fakeRows });
});

describe('GET /api/transactions', () => {
  it('returns 200 with array of transactions in correct shape', async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(3);

    const first = body[0];
    expect(first).toHaveProperty('transaction_id');
    expect(first).toHaveProperty('transaction_date');
    expect(first).toHaveProperty('total_cost');
    expect(first).toHaveProperty('customer');
    expect(first).toHaveProperty('bike');

    expect(first.customer).toHaveProperty('id');
    expect(first.customer).toHaveProperty('first_name');
    expect(first.customer).toHaveProperty('last_name');
    expect(first.customer).toHaveProperty('email');
    expect(first.customer).toHaveProperty('phone_number');

    expect(first.bike).toHaveProperty('id');
    expect(first.bike).toHaveProperty('make');
    expect(first.bike).toHaveProperty('model');
  });

  it('returns total_cost as number type (not string from pg NUMERIC)', async () => {
    const response = await GET();
    const body = await response.json();

    for (const tx of body) {
      expect(typeof tx.total_cost).toBe('number');
    }

    expect(body[0].total_cost).toBe(55.0);
    expect(body[2].total_cost).toBe(95.75);
  });

  it('returns transactions sorted by transaction_date descending', async () => {
    const response = await GET();
    const body = await response.json();

    expect(body[0].transaction_date).toBe('2026-01-28');
    expect(body[1].transaction_date).toBe('2026-01-25');
    expect(body[2].transaction_date).toBe('2026-01-22');
  });

  it('returns 500 when the database query fails', async () => {
    mockPool.query.mockRejectedValue(new Error('connection refused'));

    const response = await GET();
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body).toEqual({ error: 'Failed to fetch transactions' });
  });

  it('returns 200 with empty array when no transactions exist', async () => {
    mockPool.query.mockResolvedValue({ rows: [] });

    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual([]);
  });
});
