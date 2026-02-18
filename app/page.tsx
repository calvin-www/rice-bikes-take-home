'use client';

import { useEffect, useState } from 'react';
import TransactionsTable from '@/components/TransactionsTable';
import { Transaction } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
            RB
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            Rice Bikes Repair Dashboard
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {loading && (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading transactions...
              </div>
            </CardContent>
          </Card>
        )}
        {!loading && <TransactionsTable transactions={transactions} />}
      </main>
    </div>
  );
}
