type BalanceDisplayProps = {
  accountInfo: { accountBalance: number } | null;
};

const BalanceDisplay = ({ accountInfo }: BalanceDisplayProps) => (
  <div className='p-4 mt-16 ml-2 text-left'>
    <p className='text-sm font-medium text-[#6C6C6C]'>챌렛계좌</p>
    <h2 className='text-3xl font-bold'>
      {accountInfo
        ? `${accountInfo.accountBalance.toLocaleString()}원`
        : '잔액 정보 없음'}
    </h2>
  </div>
);

export default BalanceDisplay;
