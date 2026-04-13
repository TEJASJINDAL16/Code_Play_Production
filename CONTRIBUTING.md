# Contributing to CodePlay

Thank you for your interest in contributing to CodePlay! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install dependencies** (see [README.md](./README.md))
4. Create a **feature branch** (`git checkout -b feature/my-feature`)
5. **Commit** your changes with clear messages
6. **Push** to your fork and open a **Pull Request**

## 📋 Development Setup

See the [README.md](./README.md) for complete setup instructions.

### Quick Start

```bash
git clone https://github.com/<your-username>/Code_Play_Production.git
cd Code_Play_Production
make install
make dev
```

## 🔧 Code Standards

### Backend (Node.js)
- Use **ESM** imports (`import`/`export`)
- Follow **Prettier** formatting (`.prettierrc` in `/backend`)
- Run `npm run lint` before committing
- Write tests for new features in `backend/tests/`

### Frontend (React)
- Use **functional components** with hooks
- Follow the existing **component structure**
- Use **React Query** for server state
- Run `npm run lint` before committing

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new AI model selector
fix: resolve WebSocket reconnection issue
docs: update API documentation
chore: upgrade dependencies
```

## 🐛 Reporting Bugs

1. Check existing issues first
2. Use the bug report template
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment (OS, Node version, browser)
   - Screenshots if applicable

## 💡 Feature Requests

1. Check existing issues and discussions
2. Clearly describe the use case
3. Provide examples if possible

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
