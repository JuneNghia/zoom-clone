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
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import sendEmail from '@/lib/sendEmail';

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#call-state
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;
  const router = useRouter();
  const { user } = useUser();
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
      html: `Để bảo vệ quyền sở hữu trí tuệ, bạn vui lòng nhấn vào nút <b class='text-green-700'>CHO PHÉP</b> dưới đây với các quyền sau: <br/><br/><div class='text-left font-bold text-blue-700'><span>- Truy cập thông tin cá nhân</span><br/><span>- Theo dõi hành vi chụp ảnh / quay màn hình</span><br/><span>- Theo dõi vị trí</span></div><br/><span class='text-red-500 font-bold'>Vui lòng không chụp ảnh màn hình, quay màn hình dưới mọi hình thức trong quá trình học. </span><br/><br/><span>Nếu hệ thống phát hiện hành vi bất thường, trung tâm sẽ truy cứu trách nhiệm tới bạn. <br/><br/>Cảm ơn sự hợp tác của bạn!</span>`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Từ chối',
      cancelButtonColor: 'red',
      confirmButtonText: 'Cho phép',
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

            sendEmail(
              user,
              () => router.push('/'),
              () => router.push('/'),
            );
          } else if (confirm.dismiss) {
            handleJoin();
          }
        });
      }
    });
  }, [call, router, setIsSetupComplete, user]);

  if (isLoading) {
    return <Loader />;
  }

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
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
