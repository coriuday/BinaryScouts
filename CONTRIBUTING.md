# Contributing to GloryX

Thank you for your interest in contributing to the GloryX Full-Stack Platform! Please review these guidelines before making changes or submitting pull requests.

## 🚀 Setting Up the Development Stack

The project operates as a hybrid full-stack system. Make sure you set up all three components for local development:

### 1. Next.js Frontend
- **Runtime**: Node.js 18.x+ / Bun 1.0+
- **Commands**:
  ```bash
  bun install
  bun run dev
  ```

### 2. Rust API Gateway (`backend-rust/`)
- **Runtime**: Cargo / Rust Edition 2021+
- **Commands**:
  ```bash
  cd backend-rust
  cargo run
  ```

### 3. Python AI Microservice (`backend-python/`)
- **Runtime**: Python 3.10+
- **Commands**:
  ```bash
  cd backend-python
  python -m venv .venv
  .venv\Scripts\activate   # Or source .venv/bin/activate on Unix
  pip install -r requirements.txt
  python -m uvicorn app:app --port 5000
  ```

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: ...` for new features (e.g. `feat: add CRM trigger to planner`)
- `fix: ...` for bug fixes (e.g. `fix: resolve terminal window offset`)
- `docs: ...` for documentation updates (e.g. `docs: update setup guides`)
- `style: ...` for changes that do not affect code logic (formatting, layout)
- `refactor: ...` for structural rewrites (e.g. `refactor: organize components directory`)
- `test: ...` for adding or updating test cases

## 🧪 Submission Process

1. **Fork** the repository and create a feature branch (`git checkout -b feature/AmazingFeature`).
2. Implement your changes and verify that the build is green:
   - Next.js: `bun run build`
   - Rust: `cargo check`
3. Commit your changes with a descriptive commit message adhering to conventions.
4. Push to your fork and submit a **Pull Request** targeting the `main` branch.
