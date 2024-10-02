import { useState, useEffect } from 'react';
import AxiosInstance from '../../api/axiosInstance';

interface Transaction {
  id: number;
  transaction_datetime: string; // ISO 포맷의 날짜 문자열로 가정
  transaction_amount: number;
  category: string;
  description: string;
}

const CalendarSpendingPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  // Fetch transactions when the component mounts or the month changes
  useEffect(() => {
    fetchTransactions(currentDate.getFullYear(), currentDate.getMonth() + 1); // Adjust month to 1-based (Jan = 1, Dec = 12)
  }, [currentDate]);

  // Fetch transactions from the backend for the specified year and month
  const fetchTransactions = async (year: number, month: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AxiosInstance.post('/api/transactions/monthly', {
        year: year, // Send year to backend
        month: month, // Send month to backend
      });
      setTransactions(response.data.transactions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.'); // string 타입으로 error 처리
      setIsLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const formatDate = (date: Date, format: string) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    switch (format) {
      case 'MMMM yyyy':
        return `${monthNames[month]} ${year}`;
      case 'd':
        return day;
      case 'yyyy-MM-dd':
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      default:
        return `${year}-${month + 1}-${day}`;
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return formatDate(date1, 'yyyy-MM-dd') === formatDate(date2, 'yyyy-MM-dd');
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const getDailyTotal = (date: Date) => {
    return transactions
      .filter((t) => isSameDay(new Date(t.transaction_datetime), date))
      .reduce((sum, t) => sum + t.transaction_amount, 0);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = daysInMonth[0].getDay();

    return (
      <div className='grid grid-cols-7 gap-1'>
        {daysOfWeek.map((day) => (
          <div key={day} className='text-center font-bold p-2'>
            {day}
          </div>
        ))}
        {[...Array(firstDayOfMonth)].map((_, index) => (
          <div key={`empty-${index}`} className='p-2'></div>
        ))}
        {daysInMonth.map((date) => {
          const dailyTotal = getDailyTotal(date);
          return (
            <div
              key={date.toString()}
              onClick={() => handleDateClick(date)}
              className={`p-2 text-center cursor-pointer flex flex-col items-center
                ${isToday(date) ? 'bg-blue-100' : ''}
                ${selectedDate && isSameDay(date, selectedDate) ? 'bg-blue-500 text-white' : ''}
              `}
            >
              <span>{formatDate(date, 'd')}</span>
              {dailyTotal !== 0 && (
                <span
                  className={`text-xs ${dailyTotal > 0 ? 'text-blue-500' : 'text-red-500'}`}
                >
                  {Math.abs(dailyTotal).toLocaleString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const filteredTransactions = selectedDate
    ? transactions.filter((t) =>
        isSameDay(new Date(t.transaction_datetime), selectedDate)
      )
    : transactions.filter((t) => {
        const transactionDate = new Date(t.transaction_datetime);
        return (
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()
        );
      });

  const totalSpending = filteredTransactions.reduce(
    (sum, t) => sum + t.transaction_amount,
    0
  );

  return (
    <div className='max-w-md mx-auto p-4'>
      {isLoading && <div className='text-center'>Loading transactions...</div>}
      {error && <div className='text-center text-red-500'>{error}</div>}
      {!isLoading && !error && (
        <>
          <div className='flex justify-between items-center mb-4'>
            <button
              onClick={handlePrevMonth}
              className='px-2 py-1 bg-gray-200 rounded'
            >
              &lt;
            </button>
            <h2 className='text-xl font-bold'>
              {formatDate(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleNextMonth}
              className='px-2 py-1 bg-gray-200 rounded'
            >
              &gt;
            </button>
          </div>

          <div className='mb-4 text-2xl font-bold'>
            <span
              className={totalSpending > 0 ? 'text-blue-500' : 'text-red-500'}
            >
              {Math.abs(totalSpending).toLocaleString()} 원
            </span>
          </div>

          {renderCalendar()}

          <div className='mt-4'>
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className='flex items-center justify-between py-2 border-b'
              >
                <div className='flex items-center'>
                  <div
                    className={`p-2 rounded-full mr-2 ${transaction.transaction_amount > 0 ? 'bg-blue-100' : 'bg-red-100'}`}
                  >
                    {transaction.transaction_amount > 0 ? '+' : '-'}
                  </div>
                  <div>
                    <div>
                      {new Date(
                        transaction.transaction_datetime
                      ).toLocaleString()}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {transaction.category}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    transaction.transaction_amount > 0
                      ? 'text-blue-500'
                      : 'text-red-500'
                  }
                >
                  {Math.abs(transaction.transaction_amount).toLocaleString()} 원
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarSpendingPage;
