# Vibe Play

A full-stack application with AI integration capabilities.

## Project Structure

```
vibe-play/
├── ai/                 # AI/ML components and services
├── backend/            # Server-side application
├── frontend/           # Client-side application
├── integrations/       # Third-party integrations
└── docs/              # Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install all dependencies
npm run install:all

# Or install root dependencies only
npm install
```

### Development

```bash
# Start all services
npm run dev

# Start specific services
npm run dev:frontend
npm run dev:backend
npm run dev:ai
```

### Building

```bash
# Build all workspaces
npm run build

# Build specific workspace
npm run build:frontend
npm run build:backend
```

### Testing

```bash
# Run all tests
npm test
```

### Code Quality

```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Workspace Setup

Each workspace (ai, backend, frontend, integrations) should have its own:
- `package.json` with workspace-specific dependencies
- Development and build scripts
- Testing configuration

## Environment Variables

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT