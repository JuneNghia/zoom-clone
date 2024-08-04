'use client';
import { useCallback, useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
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
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';
import notify from '@/lib/notify';
import Alert from './Alert';
import { listAdmin, listLayout } from '@/constants';
import { useUser } from '@clerk/nextjs';
import { CallLayoutType } from '@/lib/enum';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>(listLayout[1].value);
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState, useCallEndedAt, useCallStartsAt } =
    useCallStateHooks();
  const call = useCall();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;
  const { user } = useUser();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  const CallLayout = useCallback(() => {
    switch (layout) {
      case CallLayoutType.grid:
        return <PaginatedGridLayout />;
      case CallLayoutType.speaker:
        return <SpeakerLayout participantsBarPosition={'top'} />;
    }
  }, [layout]);

  if (callingState !== CallingState.JOINED) return <Loader />;

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
              notify('success', 'Muted all users');
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
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
