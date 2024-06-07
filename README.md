## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Deployed API

POST https://reconcile-production.up.railway.app/identify

```json
{
    "email": "someone@gmail.com",
    "phoneNumber": "+919876543233"
}
```

## Environment Variables

Add the env variables to `.env`. Fallbacks to system environment.

```
PORT
DATABASE_HOST
DATABASE_PORT
DATABASE_USER
DATABASE_PASSWORD
DATABASE_NAME
```

## Setup

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
