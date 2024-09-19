import { useState, useEffect, useCallback } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/topbar/topbar';

const PaymentPage = () => {
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const startScanning = useCallback(async () => {
    setScanning(true);
    try {
      const codeReader = new BrowserQRCodeReader();
      const videoDevices = (
        await navigator.mediaDevices.enumerateDevices()
      ).filter((device) => device.kind === 'videoinput');

      if (videoDevices.length === 0) {
        throw new Error('No video input devices found.');
      }

      const firstDeviceId = videoDevices[0].deviceId;
      const controls = await codeReader.decodeFromVideoDevice(
        firstDeviceId,
        'video',
        (result, err) => {
          if (result) {
            const text = result.getText();
            controls.stop(); // 스캔 완료 후 스캐너 중지
            navigate('/payresult', { state: { qrData: text } });
          } else if (err && err.name !== 'NotFoundException') {
            console.error('Error during scanning:', err);
          }
        }
      );
    } catch (error) {
      console.error('Error starting scan:', error);
      setScanning(false);
    }
  }, [navigate]);

  useEffect(() => {
    startScanning();
    return () => setScanning(false); // 컴포넌트 언마운트 시 스캔 중지
  }, [startScanning]);

  return (
    <div className='min-h-screen bg-white flex flex-col items-center p-2'>
      <TopBar title='QR 스캔' />

      <div className='flex flex-col items-center justify-center flex-grow'>
        <div
          className='relative'
          style={{
            width: '70vw',
            height: '70vw',
            maxWidth: '600px',
            maxHeight: '600px',
            border: '4px solid white',
          }}
        >
          {scanning && (
            <video
              id='video'
              width='100%'
              height='100%'
              autoPlay
              className='absolute top-0 left-0 w-full h-full object-cover' // object-fit: cover로 설정
            ></video>
          )}
        </div>
        <p className='text-gray-500 text-sm mt-4 text-center'>
          QR코드를 화면에 비추면 <br />
          자동으로 인식 후 다음 화면으로 전환됩니다.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;