'use client';

import { useState, useMemo } from 'react';
import { Transaction } from '@/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
}

type SortDirection = 'asc' | 'desc';

type SortColumn = 'transaction_date' | 'customer' | 'email' | 'bike' | 'total_cost';

const PAGE_SIZE = 5;

const sortAccessors: Record<SortColumn, (t: Transaction) => string | number> = {
  transaction_date: (t) => new Date(t.transaction_date).getTime(),
  customer: (t) => `${t.customer.first_name} ${t.customer.last_name}`.toLowerCase(),
  email: (t) => t.customer.email.toLowerCase(),
  bike: (t) => `${t.bike.make} ${t.bike.model}`.toLowerCase(),
  total_cost: (t) => t.total_cost,
};

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('transaction_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortedTransactions = useMemo(() => {
    const accessor = sortAccessors[sortColumn];
    return [...transactions].sort((a, b) => {
      const valA = accessor(a);
      const valB = accessor(b);

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedTransactions.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, sortedTransactions.length);
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-1 size-3.5 text-muted-foreground/50" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="ml-1 size-3.5" />
      : <ArrowDown className="ml-1 size-3.5" />;
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No transactions found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Repair Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{endIndex} of {sortedTransactions.length}
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('transaction_date')}>
                <span className="inline-flex items-center">Date<SortIcon column="transaction_date" /></span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('customer')}>
                <span className="inline-flex items-center">Customer Name<SortIcon column="customer" /></span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('email')}>
                <span className="inline-flex items-center">Email<SortIcon column="email" /></span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('bike')}>
                <span className="inline-flex items-center">Bike<SortIcon column="bike" /></span>
              </TableHead>
              <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('total_cost')}>
                <span className="inline-flex items-center justify-end w-full">Cost<SortIcon column="total_cost" /></span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction, i) => (
              <TableRow key={transaction.transaction_id} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                <TableCell className="text-muted-foreground">{formatDate(transaction.transaction_date)}</TableCell>
                <TableCell className="font-medium">
                  {transaction.customer.first_name} {transaction.customer.last_name}
                </TableCell>
                <TableCell className="text-muted-foreground">{transaction.customer.email}</TableCell>
                <TableCell>{transaction.bike.make} {transaction.bike.model}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">{formatCurrency(transaction.total_cost)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 border-t px-6 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
