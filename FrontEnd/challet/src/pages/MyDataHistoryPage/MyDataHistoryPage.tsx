// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import useAccountStore from '../../store/useAccountStore';
// import axiosInstance from '../../api/axiosInstance';

// interface Transaction {
//   id: number;
//   transactionDate: string;
//   deposit: string;
//   transactionBalance: number;
//   transactionAmount: number;
// }

// interface TransactionResponse {
//   transactionCount: number;
//   accountBalance: number;
//   transactionResponseDTO: Transaction[];
// }

// const MyDataHistoryPage: React.FC = () => {
//   const location = useLocation();
//   const { accountInfo } = useAccountStore();
//   const { bankKey } = location.state;
//   const [transactionData, setTransactionData] =
//     useState<TransactionResponse | null>(null);
//   const [loading, setLoading] = useState(true); // 로딩 상태 추가
//   const [error, setError] = useState(false); // 에러 상태 추가

//   useEffect(() => {
//     const fetchTransactionHistory = async () => {
//       if (!accountInfo) return;

//       const apiEndpoints: Record<string, string> = {
//         nh: '/api/nh-bank/account',
//         kb: '/api/kb-bank/account',
//         sh: '/api/sh-bank/account',
//       };

//       const apiUrl = apiEndpoints[bankKey];

//       try {
//         // 요청 값 콘솔에 출력
//         console.log('Request URL:', apiUrl);
//         console.log('AccountId in headers:', accountInfo.id);

//         const response = await axiosInstance.get(apiUrl, {
//           headers: { AccountId: accountInfo.id.toString() },
//         });

//         // 응답 값 콘솔에 출력
//         console.log('API Response:', response.data);

//         setTransactionData(response.data);
//       } catch (error) {
//         console.error('Error fetching transaction data:', error);
//         setError(true); // 에러 상태 설정
//       } finally {
//         setLoading(false); // 로딩 상태 해제
//       }
//     };

//     fetchTransactionHistory();
//   }, [accountInfo, bankKey]);

//   if (loading) return <p>Loading...</p>; // 로딩 중 처리
//   if (error) return <p>Error fetching data</p>; // 에러 발생 처리

//   if (!transactionData || !transactionData.transactionResponseDTO?.length) {
//     return <p>거래 내역이 없습니다.</p>;
//   }

//   return (
//     <div>
//       <h2>계좌 잔액: {transactionData.accountBalance.toLocaleString()}원</h2>
//       {/* 거래 내역 렌더링 */}
//       {transactionData.transactionResponseDTO.map((transaction) => (
//         <div key={transaction.id}>
//           <p>{transaction.transactionDate}</p>
//           <p>Amount: {transaction.transactionAmount.toLocaleString()}원</p>
//           <p>Balance: {transaction.transactionBalance.toLocaleString()}원</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MyDataHistoryPage;
