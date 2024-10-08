'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import Alert from './Alert';
import { Button } from './ui/button';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#call-state
  const { useCallEndedAt } = useCallStateHooks();
  const callEndedAt = useCallEndedAt();
  const callHasEnded = !!callEndedAt;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const call = useCall();

  if (!call) {
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  }

  // https://getstream.io/video/docs/react/ui-cookbook/replacing-call-controls/
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.enable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [call.camera, call.microphone, isMicCamToggled]);

  const handleJoin = useCallback(() => {
    Swal.fire({
      title: 'Thông báo',
      html: `Để bảo vệ quyền sở hữu trí tuệ, bạn vui lòng nhấn vào nút <b class='text-green-700'>TÔI ĐỒNG Ý</b> dưới đây để cam kết: 
      <br/></div><br/><span class='text-red-500 font-bold'>Không chụp ảnh màn hình, quay màn hình dưới mọi hình thức trong quá trình học. </span><br/><br/><span>Nếu hệ thống phát hiện hành vi bất thường, trung tâm sẽ truy cứu trách nhiệm tới bạn. <br/><br/>Cảm ơn sự hợp tác của bạn!</span>`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Từ chối',
      cancelButtonColor: 'red',
      confirmButtonText: 'Tôi đồng ý',
      confirmButtonColor: 'green',
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        call.join();

        setIsSetupComplete(true);
      } else if (confirm.dismiss) {
        Swal.fire({
          title: 'Xác nhận từ chối',
          html: `Bạn có chắc chắn muốn thoát khỏi phòng họp ?`,
          confirmButtonText: 'Thoát',
          cancelButtonText: 'Hủy',
          showCancelButton: true,
          cancelButtonColor: 'grey',
          confirmButtonColor: 'red',
          allowEscapeKey: false,
          allowOutsideClick: false,
          icon: 'warning',
        }).then((confirm) => {
          if (confirm.isConfirmed) {
            setIsLoading(true);

            router.push('/')
          } else if (confirm.dismiss) {
            handleJoin();
          }
        });
      }
    });
  }, [call, router, setIsSetupComplete]);

  if (isLoading) {
    return <Loader />;
  }


  if (callHasEnded)
    return (
      <Alert
        title="Cuộc họp đã kết thúc bởi chủ phòng"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-center text-2xl font-bold">Cài đặt</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => {
              setIsMicCamToggled(e.target.checked);
            }}
          />
          Tắt camera khi tham gia
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={handleJoin}
      >
        Tham gia cuộc họp
      </Button>
    </div>
  );
};

export default MeetingSetup;
