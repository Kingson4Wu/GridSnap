# Contributing to GridSnap

Thank you for your interest in contributing!

## Getting Started

```bash
git clone https://github.com/Kingson4Wu/GridSnap.git
cd GridSnap
npm install
npm run dev
```

Open `http://localhost:5173/GridSnap/` in your browser.

## Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm test` | Run unit tests (Vitest) |
| `npm run e2e` | Run E2E tests (Playwright) |
| `npm run build` | Production build |
| `npm run lint` | Lint source files |

## Making Changes

1. Fork the repo and create a branch from `main`
2. Make your changes with tests where applicable
3. Run `npm test` and `npm run lint` — both must pass
4. Open a Pull Request

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Add/update tests for new behaviour
- Update README if you change user-facing functionality
- Write a clear PR description explaining the "why"

## Reporting Bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml) template. Include your device, browser, and steps to reproduce.

## Suggesting Features

Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml) template.

## Code Style

- TypeScript strict mode is enforced
- ESLint must pass (`npm run lint`)
- Follow the existing patterns in the codebase (React hooks, Tailwind utility classes)

## License

By contributing you agree that your contributions will be licensed under the [MIT License](LICENSE).
