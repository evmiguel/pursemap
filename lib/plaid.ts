import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || ''],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
        'Plaid-Version': '2020-09-14',
      },
    },
  })
);

const sessionOptions = {
  cookieName: 'pursemap_cookie',
  password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  secure: process.env.NODE_ENV === 'production' ? true : false,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export { plaidClient, sessionOptions };