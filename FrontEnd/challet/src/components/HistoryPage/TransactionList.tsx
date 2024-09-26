import React from 'react';
import TransactionItem from './TransactionItem';

interface Transaction {
  id: number;
  transactionDate: string;
  deposit: string;
  transactionBalance: number;
  transactionAmount: number;
}

interface TransactionListProps {
  transactionHistory: Transaction[];
  onTransactionClick: (transactionId: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactionHistory,
  onTransactionClick,
}) => {
  return (
    <div className='divide-y divide-gray-200'>
      {transactionHistory.length > 0 ? (
        transactionHistory.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onClick={onTransactionClick}
          />
        ))
      ) : (
        <p className='text-center text-gray-500 py-4'>거래 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default TransactionList;
