# About
This is a webapp that allows users to map bank transactions to actual things bought.
It enables the user to understand how much stuff they've accumulated over time.

## Installation
```
npm install
npm install -g dotenv-cli
```

## Configuration
### General
Create a .env file with the following contents
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
SHADOW_DATABASE_URL=
```

### Development
Create a .env.development.local file with the following contents
```
DATABASE_URL=
```
