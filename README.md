# Gorda Admin

Gorda Admin is a Vue 3 dashboard used to manage drivers, users and WhatsApp connections for the **Gorda** platform.  It relies on Firebase services for data storage/authentication and communicates with a separate API for administrative tasks.  A Socket.IO service is used for WhatsApp integration.

[![codecov](https://codecov.io/gh/DevAlexandreCR/gorda-admin/graph/badge.svg?token=WJNHXTDZMF)](https://codecov.io/gh/DevAlexandreCR/gorda-admin)

## Project Overview

This project provides an admin interface to control several entities:

- User and driver management
- Place and service management
- Metrics and statistics
- WhatsApp clients and chat interface

The application is written in TypeScript using the Vue CLI and Pinia for state management.  Firebase Realtime Database and Firestore store most of the data, while a separate Node/Express API (defined by the `VUE_APP_GORDA_API_URL` variable) handles authentication and other privileged operations.  WhatsApp connections are managed through a Socket.IO service (`VUE_APP_WP_CLIENT_API_URL`).

## Tech Stack

- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/) for state management
- [Bootstrap 5](https://getbootstrap.com/) UI components
- [Firebase](https://firebase.google.com/) (Auth, Realtime DB, Firestore, Storage)
- [Axios](https://axios-http.com/) for HTTP calls
- [Socket.IO](https://socket.io/) for WhatsApp events
- Jest and Vue Test Utils for unit tests

## Installation

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust the environment variables for your Firebase project, API URLs and ports.
3. If you plan to use the Firebase emulators locally, copy `firebase.example.json` to `firebase.json` and adjust the configuration as needed.

## Running Locally

```bash
npm run serve
```

This starts the development server on port `5000` (configured in `package.json`). The app will connect to the Firebase project and APIs specified in your `.env` file.

### Tests and Linting

```bash
npm run lint      # format and check code with ESLint
npm run test:unit # run Jest unit tests
```

## Building for Production

```bash
npm run build
```

The compiled files will be placed in the `dist` directory.  These files can be deployed to Firebase Hosting or any other static host.  The Firebase configuration in `firebase.json` can be used to deploy with the Firebase CLI.

## API Endpoints

The frontend expects an external API specified by `VUE_APP_GORDA_API_URL`.  The default value in `.env.example` points to Firebase Functions:

```
http://localhost:5001/gorda-driver/us-central1/api
```

Some available routes used by the repositories are:

- `POST /auth/create-user/`
- `POST /auth/enable-user/`
- `POST /auth/update-email/`
- `POST /auth/update-password/`

A Socket.IO service handles WhatsApp clients.  Its URL and port are defined by `VUE_APP_WP_CLIENT_API_URL` and `VUE_APP_WP_CLIENT_API_PORT`.

## Components

### Frontend

- Vue 3 single page application located in the `src/` directory.
- Uses Pinia stores for data such as drivers, users, services and WhatsApp chats.
- Views are placed in `src/views/` and reusable components in `src/components/`.

### Backend / Services

- Firebase project for authentication, realtime database and storage.
- REST API (serverless functions) referenced by `VUE_APP_GORDA_API_URL` for privileged operations.
- Socket.IO server for WhatsApp interaction (`WhatsAppClient.ts`).

### Mobile App

A separate mobile driver application (not included in this repository) consumes the same Firebase data.

## WhatsApp Integration Flow

1. Each WhatsApp client is configured in the **WhatsApp** settings view.
2. A `WhatsAppClient` instance (see `src/services/gordaApi/WhatsAppClient.ts`) opens a Socket.IO connection to the WhatsApp service.
3. The service emits events such as QR code generation, connection state and incoming messages.  The frontend updates the UI via Pinia stores.
4. Messages can be sent directly from the admin interface using the `send-message` event.

## Contributing

1. Fork the repository and create a branch for your feature or fix.
2. Run `npm run lint` and `npm run test:unit` before committing.
3. Submit a pull request describing your changes.

## License

No explicit license file is provided in this repository.  All rights reserved by the original authors.

