import { NextResponse } from 'next/server';
import { getAllTransactions } from '@/lib/services/transactions';

export async function GET() {
  try {
    const transactions = await getAllTransactions();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
