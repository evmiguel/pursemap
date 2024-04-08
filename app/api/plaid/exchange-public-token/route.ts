import { cookies } from 'next/headers';
import { plaidClient, sessionOptions } from '@/lib/plaid';
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';

export interface SessionData {
    access_token: string;
}

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const body = await req.json()

  const exchangeResponse = await plaidClient.itemPublicTokenExchange({
    public_token: body.public_token,
  });

  session.access_token = exchangeResponse.data.access_token;
  await session.save();
  return NextResponse.json(session);
}
