# Todo App Monorepo

This is a monorepo for a full-stack Todo application built with React and Express, managed using Lerna and pnpm workspaces.

## Project Structure

```
todo-app/
├── packages/
│   ├── client/      # React frontend
│   └── server/      # Express backend
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [pnpm](https://pnpm.io/) (v10 or higher)

### Installation

1. Install dependencies:

```bash
pnpm install
```

This will install dependencies for the root project and all packages.

## Available Scripts

In the root directory, you can run:

### `pnpm dev`

Runs both the client and server in development mode in parallel.

### `pnpm dev:client`

Runs only the client in development mode.

### `pnpm dev:server`

Runs only the server in development mode.

### `pnpm build`

Builds both the client and server for production.

### `pnpm start`

Starts the production server.

### `pnpm test`

Runs tests across all packages.

### `pnpm lint`

Runs linting across all packages.

### `pnpm clean`

Cleans up node_modules from all packages.

### `pnpm reset`

Removes all node_modules and reinstalls dependencies.

## Using Lerna

This project uses Lerna for managing multiple packages in the monorepo.

### Running commands for specific packages

```bash
# Run a command for a specific package
pnpm lerna run <command> --scope=@todo-app/client
pnpm lerna run <command> --scope=@todo-app/server

# Run a command for all packages
pnpm lerna run <command>
```

## Using pnpm Workspace

You can also use pnpm workspace commands directly:

```bash
# Add a dependency to a specific package
pnpm --filter @todo-app/client add <dependency>
pnpm --filter @todo-app/server add <dependency>

# Add a dev dependency to a specific package
pnpm --filter @todo-app/client add -D <dependency>
```