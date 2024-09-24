import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// 브라우저 환경에서 global을 정의
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// WebSocket 연결을 위한 URL (서버 엔드포인트에 맞게 수정)
const SOCKET_URL = 'http://localhost:8081/ws';
const token =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMTAxMjM0NTY3OCIsImlhdCI6MTcyNzA2NjkwMCwiZXhwIjoxNzI3MTUzMzAwLCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.6vaY9heBNiW0BEmAJkAZTSCByYV0irSf1W19MroiNV5ESZa8HPRh71GbnFeAvjuG3HWmwOfdQNmrrn7ThvypGw'; // JWT 토큰 값

const WebSocketTest: React.FC = () => {
  const [stompClient, setStompClient] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    image: '',
    withdrawal: '',
    transactionAmount: 0,
    content: '',
  });

  // WebSocket 연결 설정
  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    const stompClientInstance = Stomp.over(socket);

    stompClientInstance.connect(
      { Authorization: `Bearer ${token}` },
      (frame: any) => {
        console.log('Connected: ' + frame);
        stompClientInstance.subscribe(
          '/topic/challenges/1/shared-transactions',
          (message: any) => {
            const response = JSON.parse(message.body);
            console.log('Received Response DTO:', response);
            setTransactions((prevTransactions) => [
              ...prevTransactions,
              response,
            ]);
          }
        );
      },
      (error: any) => {
        console.log('Error connecting to WebSocket: ' + error);
      }
    );

    setStompClient(stompClientInstance);

    return () => {
      stompClientInstance.disconnect(() => {
        console.log('Disconnected');
      });
    };
  }, []);

  // 거래 내역 전송
  const sendTransaction = () => {
    if (stompClient) {
      const transactionData = {
        image: formData.image,
        withdrawal: formData.withdrawal,
        transactionAmount: formData.transactionAmount,
        content: formData.content,
      };

      // 메시지를 보내면서 Authorization 헤더에 JWT 토큰을 포함
      stompClient.send(
        '/app/challenges/1/shared-transactions',
        { Authorization: `Bearer ${token}` },
        JSON.stringify(transactionData)
      );
      console.log('Sent Transaction:', transactionData);
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div>
      <h1>WebSocket Test</h1>

      <div>
        <h3>Send Transaction</h3>
        <label htmlFor='image'>Image URL:</label>
        <input
          type='text'
          id='image'
          value={formData.image}
          onChange={handleInputChange}
          placeholder='image url'
        />
        <br />

        <label htmlFor='withdrawal'>Withdrawal:</label>
        <input
          type='text'
          id='withdrawal'
          value={formData.withdrawal}
          onChange={handleInputChange}
          placeholder='withdrawal'
        />
        <br />

        <label htmlFor='transactionAmount'>Transaction Amount:</label>
        <input
          type='number'
          id='transactionAmount'
          value={formData.transactionAmount}
          onChange={handleInputChange}
          placeholder='amount'
        />
        <br />

        <label htmlFor='content'>Content:</label>
        <input
          type='text'
          id='content'
          value={formData.content}
          onChange={handleInputChange}
          placeholder='content'
        />
        <br />

        <button onClick={sendTransaction}>Send Transaction</button>
      </div>

      <div>
        <h3>Received Transactions</h3>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index}>
              Response DTO - Image: {transaction.image}, Withdrawal:{' '}
              {transaction.withdrawal}, Amount: {transaction.transactionAmount},
              Content: {transaction.content}, Sender: {transaction.userId}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketTest;
