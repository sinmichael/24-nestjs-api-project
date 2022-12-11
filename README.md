# NestJS API Backend 24 Hours Code Challenge

## Demo

Hosted using Railway\
[https://24-nestjs-api-project-production.up.railway.app/api/](https://24-nestjs-api-project-production.up.railway.app/api/)

## Installation

```bash
$ git clone https://github.com/sinmichael/24-nestjs-api-project
$ cd 24-nestjs-api-roject
$ npm install
```

## Configuration
Create a .env file (use .env.development for development environtment) and fill out the values.
```bash
# Database settings. Type, hostname, port, username, password, name
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_NAME=
# JWT Secret
JWT_SECRET=
# JWT expiration in milliseconds
JWT_EXPIRES_IN=
# Pexels API key - https://www.pexels.com/api/new/
PEXELS_API_KEY=
# Cloudinary cloud name, API key and secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# SendGrid API key and verified sender
SENDGRID_API_KEY=
SENDGRID_VERIFIED_SENDER=
```

## API Documentation
Once the server is running, you can view the documentation by going to `http://localhost:port/api`\
You can also view the [documentation here](https://24-nestjs-api-project-production.up.railway.app/api/) hosted on Railway

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## To-do
- Ability to add custom roles and grants
- Unit tests

## Third-party services used

[Cloudinary](https://cloudinary.com) - for storing images

[Pexels](https://pexels.com) - for random images

[SendGrid](https://sendgrid.com) - for sending emails

## Supporting libraries
[cloudinary_npm](https://github.com/cloudinary/cloudinary_npm), [pexels-javascript](https://github.com/pexels/pexels-javascript), [nestjs-access-control](https://github.com/nestjsx/nest-access-control), [@sendgrid/mail](https://github.com/sendgrid/sendgrid-nodejs), [node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)

