'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

export default function   PlaidLink() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch('/api/plaid/create-link-token', {
        method: 'POST',
      });
      const { link_token } = await response.json();
      setToken(link_token);
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback(async (publicToken: string) => {
    await fetch('/api/plaid/exchange-public-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token: publicToken }),
    });
  }, []);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      <strong>Link account</strong>
    </button>
  );
}
