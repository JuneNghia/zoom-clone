/* eslint-disable camelcase */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import {
  Call,
  RecordSettingsRequestModeEnum,
  useStreamVideoClient,
} from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input';
import { listAdmin } from '@/constants';
import notify from '@/lib/notify';
import { vi } from 'date-fns/locale/vi';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();

  const createMeeting = async () => {
    if (
      !client ||
      !user ||
      listAdmin.findIndex(
        (email) => email === user.primaryEmailAddress?.emailAddress,
      ) === -1
    )
      return;
    try {
      if (!values.dateTime) {
        notify('info', 'Vui lòng chọn thời gian');
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Đã xảy ra lỗi khi tạo cuộc họp');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Cuộc họp tức thì';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      await call.update({
        settings_override: {
          recording: {
            mode: RecordSettingsRequestModeEnum.DISABLED,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      notify('success', 'Tạo cuộc họp mới thành công');
    } catch (error) {
      console.error(error);
      notify('error', 'Đã xảy ra lỗi khi tạo cuộc họp');
    }
  };

  if (!client || !user) return <Loader />;

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Tham gia cuộc họp"
        description="bằng đường dẫn"
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
              title="Cuộc hợp mới"
              description="Khởi tạo tức thì"
              handleClick={() => setMeetingState('isInstantMeeting')}
            />
            <HomeCard
              img="/icons/schedule.svg"
              title="Lên lịch cuộc họp"
              description="Khởi tạo theo thời gian"
              className="bg-purple-1"
              handleClick={() => setMeetingState('isScheduleMeeting')}
            />
          </>
        )}

      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Tạo cuộc họp"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Thêm mô tả
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Chọn thời gian
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Chọn giờ"
              dateFormat="HH:mm - dd/MM/yyyy"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              locale={vi}
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Cuộc họp đã được lên lịch"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            notify('success', 'Sao chép thành công');
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Sao chép đường dẫn"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Nhập đường dẫn"
        className="text-center"
        buttonText="Tham gia cuộc họp"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder={`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/XXX`}
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Khởi tạo cuộc họp mới"
        className="text-center"
        buttonText="Tạo cuộc họp"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
