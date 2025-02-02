<a id="readme-top"></a>

<h1 align="center">
  <a href="https://typevs.me">
    <img src="app/public/opengraph/home.png" alt="Typing race preview" width="1200">
    <br>
    typevs.me
  </a>
</h1>

<h3 align="center">A realtime head-to-head typing competition game.</h3>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#how-to-install-and-run">How to Install and Run</a> •
  <a href="#license">License</a>
</p>

## Key Features

- Realtime typing races
- Configurable races (source of words, number of words, length)
- System for creating, inviting users to, and joining rooms
- Accounts that track all races played
- Profile page with statistics
- A points and levels system with unlockable items
- Fine-tuned light and dark modes

## Tech Stack

| Tool                | Use                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| SCSS modules        | Styling with scoped namespaces                                                                            |
| TypeScript          | Type safety                                                                                               |
| next-themes         | Persisting theming without flash of incorrect theme                                                       |
| Next.js             | Server and client-side rendering, server-side functions i.e. querying the database                        |
| Socket.io           | Two-way event-based communication between client and server, allowing updates to go from client to client |
| Node.js             | Runtime for Socket.io server                                                                              |
| Prisma ORM          | Type-safe object-relational model for querying the database & migrations                                  |
| PostgresQL          | Database for storing races, scores, users, etc.                                                           |
| Google OAuth 2.0    | Authenticating users without needing to store and maintain passwords                                      |
| Auth.js (next-auth) | Connecting OAuth and database, and providing authentication information                                   |
| Husky               | Automatically linting, formatting, and testing code on commit                                             |
| lint-staged         | Automatically linting, formatting, and testing code on commit                                             |
| ESLint              | Linting TypeScript code for errors & best practices                                                       |
| Prettier            | Formatting code                                                                                           |
| Jest                | Unit testing Socket.io server functionality                                                               |
| npm Workspaces      | Syncing Prisma client between Next.js app and Socket.io server                                            |
| Github Actions      | Automatically migrating the database when pushing new code                                                |

| Platform   | Use                                             |
| ---------- | ----------------------------------------------- |
| Vercel     | Hosting Next.js application                     |
| Render     | Hosting Socket.io server                        |
| Supabase   | Hosting PostgresQL database                     |
| GitHub     | Versioning & issue tracking                     |
| Cloudflare | Domain, DDoS protection, security               |
| Figma      | Mockups, design iterations, and system diagrams |

## How to Install and Run

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

### Installing the repository and dependencies

```bash
# Clone this repository
git clone https://github.com/pnm122/type-versus-me

# Go into the repository
cd type-versus-me

# Install dependencies (because of workspaces, there's no need to run this command in any subfolders)
npm install
```

### Enabling authentication

To enable authentication, you will need a Google OAuth 2.0 token and a Postgres database.

- To set up Google OAuth, follow [these instructions](https://developers.google.com/identity/protocols/oauth2#basicsteps)
- To set up a Postgres database locally, follow [these instructions](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database)
  - I also use [pgAdmin](https://www.pgadmin.org/) to facilitate interacting with the database, but this is optional.

### `.env` Files

In order to connect pieces of the system together without exposing API keys to GitHub or any deployments, I make use of .env files. This project has 3, with the following configurations:

`/.env`:

```sh
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?schema=[SCHEMA] # i.e. DATABASE_URL=postgresql://pnm122:abc123@localhost:5432/typevsme?schema=public
```

`/app/.env`:

```sh
NEXT_PUBLIC_DEV_SOCKET_URL="http://localhost:5000" # the Socket.io server is hosted on port 5000 by default
AUTH_SECRET=[SECRET] # a cryptographically secure random string of at least 32 characters (see https://authjs.dev/getting-started/deployment#auth_secret)
AUTH_GOOGLE_ID=[GOOGLE_CLIENT_ID]
AUTH_GOOGLE_SECRET=[GOOGLE_SECRET]
```

`/realtime/.env`:

```sh
MODE=development # [OPTIONAL] enables debug logs to the console about events being sent to/from the server
```

### Running the app

After enabling authentication and setting up all `.env` files as shown, you're ready to run the app locally!

```bash
# Migrate and generate the Prisma client. This will sync the models described in the app with the structure of your database, as well as generate all the types you need for development.
npm run prisma:migrate:dev

# Run the Next.js app
cd app
npm run dev

# Run the Socket.io server
cd realtime
npm run dev
```

## License

MIT

---

<br>

Created by [Pierce Martin](https://pierce-martin.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
