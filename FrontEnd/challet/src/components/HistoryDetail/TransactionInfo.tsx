type TransactionInfoProps = {
  deposit: string;
  transactionAmount: number;
};

const TransactionInfo = ({
  deposit,
  transactionAmount,
}: TransactionInfoProps) => (
  <div className='p-4 mt-20 text-left ml-2 mb-12'>
    <p className='text-sm text-[#6C6C6C]'>{deposit}</p>
    <h2
      className={`text-3xl font-semibold ${transactionAmount < 0 ? 'text-[#373A3F]' : 'text-[#373A3F]'}`}
    >
      {Math.abs(transactionAmount).toLocaleString()}원
    </h2>
  </div>
);

export default TransactionInfo;
