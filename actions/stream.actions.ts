'use server';

import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) {
    console.error('User is not authenticated');
    throw new Error('User is not authenticated');
  }

  if (!STREAM_API_KEY) {
    console.error('Stream API key secret is missing');
    throw new Error('Stream API key secret is missing');
  }
  if (!STREAM_API_SECRET) {
    console.error('Stream API secret is missing');
    throw new Error('Stream API secret is missing');
  }

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  const token = streamClient.createToken(user.id, expirationTime, issuedAt);

  return token;
};
