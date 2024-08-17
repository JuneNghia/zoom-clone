'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import {
  RecordSettingsRequestModeEnum,
  useStreamVideoClient,
} from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import { Input } from './ui/input';
import { listAdmin } from '@/constants';
import notify from '@/lib/notify';

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);
  const [roomId, setRoomId] = useState<string | null>(null);
  const client = useStreamVideoClient();
  const { user } = useUser();

  const handleCreateMeeting = useCallback(async () => {
    if (
      !client ||
      !user ||
      listAdmin.findIndex(
        (email) => email === user.primaryEmailAddress?.emailAddress,
      ) === -1
    )
      return;
    try {
      if (!roomId) {
        notify('error', 'Mã phòng không được bỏ trống');
      } else {
        const call = client.call('default', roomId);
        if (!call) throw new Error('Đã xảy ra lỗi khi tạo cuộc họp');
        const startsAt = new Date(Date.now()).toISOString();
        await call.getOrCreate({
          data: {
            starts_at: startsAt,
            custom: {
              description: 'Phòng họp được tạo bởi Admin CA STUDIO',
            },
            settings_override: {
              recording: {
                mode: RecordSettingsRequestModeEnum.DISABLED,
              },
              
            },
          },
          
        });
        router.push(`/meeting/${call.id}`);

        notify('success', 'Tạo cuộc họp mới thành công');
      }
    } catch (error) {
      console.error(error);
      notify('error', 'Đã xảy ra lỗi khi tạo cuộc họp');
    }
  }, [client, roomId, router, user]);

  const handleJoinMeeting = useCallback(() => {
    if (roomId) {
      router.push(`/meeting/${roomId}`);
    } else {
      notify("error", "Mã phòng không được để trống")
    }
  }, [roomId, router]);

  if (!client || !user) return <Loader />;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Tham gia cuộc họp"
        description="bằng mã cuộc họp"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      {user.primaryEmailAddress?.emailAddress &&
        listAdmin.findIndex(
          (email) => email === user.primaryEmailAddress?.emailAddress,
        ) !== -1 && (
          <>
            <HomeCard
              img="/icons/add-meeting.svg"
              title="Cuộc họp mới"
              description="Khởi tạo tức thì"
              handleClick={() => setMeetingState('isInstantMeeting')}
            />
          </>
        )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Nhập mã cuộc họp"
        className="text-center"
        buttonText="Tham gia cuộc họp"
        handleClick={handleJoinMeeting}
      >
        <Input
          placeholder="Nhập mã"
          onChange={(e) =>
            setRoomId(e.target.value === '' ? null : e.target.value)
          }
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => {
          setMeetingState(undefined);
          setRoomId(null);
        }}
        title="Đặt mã phòng họp"
        className="text-center"
        buttonText={`Tạo cuộc họp mới với mã phòng ${roomId || ''}`}
        handleClick={handleCreateMeeting}
      >
        <Input
          placeholder="Nhập mã"
          onChange={(e) =>
            setRoomId(e.target.value === '' ? null : e.target.value)
          }
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
