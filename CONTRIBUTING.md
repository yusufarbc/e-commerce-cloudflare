# Contributing to E-Market

Thank you for your interest in contributing to E-Market! This guide explains
how to set up the project and get a change merged.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md).

---

## 🛠️ Getting Started

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/e-commerce-cloudflare.git
   cd e-commerce-cloudflare
   ```
2. **Install dependencies** (Node.js 22 or later):
   ```bash
   npm run install:all
   ```
3. **Install the pre-commit secret scanner.** The hook refuses commits when
   Gitleaks is missing:
   ```bash
   sh scripts/install-gitleaks.sh
   ```
4. **Configure local secrets** (optional): copy `api/.dev.vars.example` to
   `api/.dev.vars`. It is gitignored; never commit it.
5. **Initialize the local database:**
   ```bash
   (cd api && npx prisma generate)
   npm run db:migrate
   npm run db:seed
   ```
6. **Start the dev servers** (API, storefront and admin):
   ```bash
   npm run dev
   ```

---

## 📐 Development Guidelines

### Branching Policy

- `production` is the default branch and runs the live demo; `staging` runs
  the staging environment. Both are protected.
- Create a topic branch from `staging`, e.g. `feature/amazing-feature`,
  `fix/issue-description` or `docs/update-guide`, and open your pull request
  against `staging`.
- Maintainers promote `staging` to `production` with a separate pull request.

### Commit Message Standards

We use the **Conventional Commits** format:

```text
<type>(<scope>): <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`.

**Example:** `feat(payment): add iyzico 3D secure payment gateway strategy`

---

## 📥 Submitting a Pull Request

1. **Keep it focused:** one issue or feature per pull request.
2. **Run the checks locally:**
   ```bash
   npm test --prefix api
   npm run lint --prefix client
   npm run lint --prefix admin
   npm run build --prefix client
   npm run build --prefix admin
   ```
3. **Reference issues** with GitHub keywords (e.g. `Closes #123`).
4. **Pass the pipeline:** every pull request runs the DevSecOps pipeline
   (Gitleaks, OSV-Scanner, npm audit, Semgrep, Opengrep, CodeQL, Trivy,
   Conftest, build and tests). All gate checks must be green before merging.
   If a security tool reports a false positive, explain it in the pull request
   rather than disabling the rule.
