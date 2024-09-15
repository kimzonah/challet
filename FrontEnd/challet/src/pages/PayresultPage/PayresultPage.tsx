import { useLocation } from 'react-router-dom'; // useLocation import

const PayResult = () => {
  const location = useLocation(); // 현재 location 정보를 가져옴
  const { qrData } = location.state || {}; // 전달된 state에서 qrData 추출

  return (
    <div className='min-h-screen bg-white flex flex-col items-center p-2'>
      <h1 className='text-black text-xl font-bold'>결과 페이지</h1>
      {qrData ? (
        <div className='w-full mt-4 p-4 bg-gray-100 rounded-lg'>
          <h3 className='text-lg font-semibold'>Scanned QR Data</h3>
          <pre className='text-sm'>{qrData}</pre>
        </div>
      ) : (
        <p className='text-gray-500 text-xs mt-4 text-center'>
          No QR data found.
        </p>
      )}
    </div>
  );
};

export default PayResult;
