'use client';

import { useEffect, useState } from 'react';
import TransactionsTable from '@/components/TransactionsTable';
import { Transaction } from '@/types';
import { toast } from 'sonner';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        toast.error('Failed to load transactions', { description: message });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight">
        Rice Bikes Repair Dashboard
      </h1>

      {loading && (
        <div className="flex justify-center py-12 text-muted-foreground">
          Loading transactions...
        </div>
      )}
      {!loading && <TransactionsTable transactions={transactions} />}
    </main>
  );
}
