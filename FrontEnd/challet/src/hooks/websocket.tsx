import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  private stompClient: Client | null = null;
  private socketUrl: string;
  private subscriptions: { [key: string]: () => void } = {};

  constructor(socketUrl: string) {
    this.socketUrl = socketUrl;
  }

  // 웹소켓 연결 설정
  connect() {
    if (this.stompClient && this.stompClient.connected) {
      console.log('WebSocket 이미 연결되어 있습니다.');
      return; // 이미 연결되어 있으면 아무 작업도 하지 않음
    }
    const socket = new SockJS(this.socketUrl);
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMTA3MTA1NzY0MiIsImlhdCI6MTcyNzE3Mjk5MSwiZXhwIjoxNzI3MjU5MzkxLCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.94oU6D2Y2P5IF76R_2f2Y1UJqo2JaM-bWCmWZanOo532Pk-QcKKt9e1Dfou1aQkMxxvB0ZNE90yUVeFJBUP7_w';
    const headers = { Authorization: `Bearer ${token}` };
    this.stompClient = new Client({
      // brokerURL: webSocketUrl, // SockJS 대신 brokerURL 사용
      webSocketFactory: () => socket as WebSocket,
      connectHeaders: headers,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP debug:', str);
      },
    });

    this.stompClient.onConnect = (frame) => {
      console.log('WebSocket 연결 성공:', frame);
      this.onConnected();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP 오류:', frame.headers['message']);
    };

    this.stompClient.onDisconnect = (frame) => {
      console.log('WebSocket 연결 종료:', frame);
    };

    console.log('WebSocket 연결 시도:', this.stompClient);
    this.stompClient.activate(); // 연결 시작
  }

  // 웹소켓 연결 성공 시 호출
  onConnected() {
    // 필요한 채널 구독 예시
    this.subscribe('/topic/challenges/1/shared-transactions', (message) => {
      console.log('받은 거래 메시지:', message.body);
      const transaction = JSON.parse(message.body);
      // 받은 메시지 처리 로직 추가
      console.log('거래 내역:', transaction);
    });
  }

  // 특정 채널 구독
  subscribe(destination: string, callback: (message: any) => void) {
    if (this.stompClient && this.stompClient.connected) {
      const subscription = this.stompClient.subscribe(destination, callback);
      this.subscriptions[destination] = () => subscription.unsubscribe();
    } else {
      console.warn('WebSocket 연결이 되지 않았습니다.');
    }
  }

  // 서버로 메시지 전송
  sendMessage(destination: string, payload: any) {
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMTA3MTA1NzY0MiIsImlhdCI6MTcyNzE3Mjk5MSwiZXhwIjoxNzI3MjU5MzkxLCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.94oU6D2Y2P5IF76R_2f2Y1UJqo2JaM-bWCmWZanOo532Pk-QcKKt9e1Dfou1aQkMxxvB0ZNE90yUVeFJBUP7_w';

    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(payload),
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      console.error('WebSocket 연결되지 않았습니다.');
    }
  }

  // 웹소켓 연결 종료
  disconnect() {
    if (this.stompClient) {
      Object.keys(this.subscriptions).forEach((key) => {
        this.subscriptions[key](); // 모든 구독 해제
      });
      this.stompClient.deactivate();
    }
  }
}

// WebSocketService 인스턴스 생성
const webSocketUrl = 'http://localhost:8000/api/challet/ws'; // 서버에서 웹소켓 연결을 처리하는 URL
const webSocketService = new WebSocketService(webSocketUrl);

export default webSocketService;
