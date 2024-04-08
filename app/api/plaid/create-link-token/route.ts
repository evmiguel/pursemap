import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { Products, CountryCode } from 'plaid';

export async function POST() {
  const tokenResponse = await plaidClient.linkTokenCreate({
    user: { 
        client_user_id: process.env.PLAID_CLIENT_ID || '' 
    },
    client_name: "PurseMap",
    language: 'en',
    products: [Products.Auth],
    country_codes: [CountryCode.Us],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  });

  return NextResponse.json(tokenResponse.data);
}