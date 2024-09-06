'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, MicOff } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import { cn } from '@/lib/utils';
import notify from '@/lib/notify';
import Alert from './Alert';
import { listAdmin, listLayout } from '@/constants';
import { useUser } from '@clerk/nextjs';
import { CallLayoutType } from '@/lib/enum';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>(listLayout[1].value);
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState, useCallEndedAt, useCallStartsAt } =
    useCallStateHooks();
  const call = useCall();
  const callEndedAt = useCallEndedAt();
  const callHasEnded = !!callEndedAt;
  const { user } = useUser();
  const participants = call?.state.participants;

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  const CallLayout = useCallback(() => {
    switch (layout) {
      case CallLayoutType.grid:
        return <PaginatedGridLayout />;
      case CallLayoutType.speaker:
        return (
          <SpeakerLayout
            participantsBarLimit={2}
            participantsBarPosition={'top'}
          />
        );
    }
  }, [layout]);

  useEffect(() => {
    if (call) {
      const audio = new Audio('/audio/beep.mp3');

      const unsubscribe = call.on('call.reaction_new', () => audio.play());

      return () => {
        unsubscribe();
      };
    }
  }, [call]);

  if (callingState !== CallingState.JOINED) return <Loader />;

  if (callHasEnded)
    return (
      <Alert
        title="Phòng họp đã kết thúc bởi chủ phòng"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <section>
      <CallLayout />

      <div
        className={cn('h-[calc(100vh-86px)] fixed right-0 top-5 hidden ml-2', {
          'show-block': showParticipants,
        })}
      >
        <CallParticipantsList onClose={() => setShowParticipants(false)} />
      </div>

      <div className="flex items-center justify-center gap-x-5">
        <CallControls onLeave={() => router.push(`/`)} />
        <CallStatsButton />
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {listLayout.map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className={`hover:cursor-pointer ${layout === item.value && 'bg-[#4c535b]'}`}
                  onClick={() => setLayout(item.value)}
                >
                  {item.label}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {listAdmin.findIndex(
          (email) => email === user?.primaryEmailAddress?.emailAddress,
        ) !== -1 && (
          <button
            onClick={async () => {
              await call?.muteAllUsers('audio');
              notify('success', 'Đã tắt Micro toàn bộ thành viên');
            }}
          >
            <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <MicOff size={20} className="text-white" />
            </div>
          </button>
        )}
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
          </div>
        </button>
      </div>

      <div>
        {participants?.map((participant) => (
          <div key={participant.userId}></div>
        ))}
      </div>
    </section>
  );
};

export default MeetingRoom;
