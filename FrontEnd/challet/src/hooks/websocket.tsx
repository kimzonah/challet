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
    const socket = new SockJS(this.socketUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket as WebSocket,
      reconnectDelay: 5000, // 재연결 딜레이 (5초)
      heartbeatIncoming: 4000, // 서버로부터 heartbeat 수신 간격
      heartbeatOutgoing: 4000, // 클라이언트에서 heartbeat 전송 간격
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

    this.stompClient.activate(); // 연결 시작
  }

  // 웹소켓 연결 성공 시 호출
  onConnected() {
    // 필요한 채널 구독 예시
    this.subscribe('/topic/transactions', (message) => {
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
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({ destination, body: JSON.stringify(payload) });
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
