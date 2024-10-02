import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';
import { TopBar } from '../../components/topbar/topbar';
import BalanceDisplay from '../../components/HistoryPage/BalanceDisplay';
import TransactionSearch from '../../components/HistoryPage/TransactionSearch';
import TransactionList from '../../components/HistoryPage/TransactionList';

interface Transaction {
  id: number;
  transactionDate: string;
  deposit: string;
  transactionBalance: number;
  transactionAmount: number;
}

interface TransactionResponse {
  transactionCount: number;
  accountBalance: number;
  transactionResponseDTO: Transaction[];
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const { accountInfo } = useAccountStore();
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!accountInfo) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await AxiosInstance.get<TransactionResponse>(
          `api/ch-bank/accounts`,
          {
            headers: { AccountId: accountInfo.id.toString() },
          }
        );

        console.log('Transaction history:', response.data);
        setTransactionHistory(response.data.transactionResponseDTO);
      } catch (error: unknown) {
        console.error('Failed to fetch transaction history:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [accountInfo]);

  const handleTransactionClick = (transactionId: number) => {
    navigate(`/history-detail/${transactionId}`);
  };
  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
      </div>
    );
  }

  if (error) {
    return <p>거래 내역을 불러오는 데 문제가 발생했습니다.</p>;
  }

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='거래 내역' />
      <BalanceDisplay accountInfo={accountInfo} />
      <TransactionSearch />
      <TransactionList
        transactionHistory={transactionHistory}
        onTransactionClick={handleTransactionClick}
      />
    </div>
  );
};

export default HistoryPage;
