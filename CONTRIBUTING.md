# Contributing to E-Market

Thank you for your interest in contributing to E-Market! We want to make contributing to this serverless e-commerce framework as easy and transparent as possible.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to [security@e-market-domain.com](mailto:security@e-market-domain.com).

---

## 🛠️ Getting Started

1. **Fork the Repository:** Fork E-Market to your personal GitHub account.
2. **Clone the Repo:** Clone the fork to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/e-commerce-cloudflare.git
   cd e-commerce-cloudflare
   ```
3. **Install Dependencies:** Setup all workspace directories cleanly:
   ```bash
   npm run install:all
   ```
4. **Configure Local Environment:** Set up your local settings in the `api/.env` file.
5. **Initialize Database:** Apply local migrations and seed standard products/configs:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
6. **Start Dev Servers:** Run backend, storefront, and admin panel concurrently:
   ```bash
   npm run dev
   ```

---

## 📐 Development Guidelines

### Branching Policy
- Create descriptive topic branches from `main` or `master`.
- Format: `feature/amazing-feature`, `bugfix/issue-description`, or `docs/update-guide`.

### Commit Message Standards
We enforce **Conventional Commits** format. Your commit messages must follow this structure:
```text
<type>(<scope>): <description>

[optional body]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code formatting, missing semi-colons (no logical changes)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or correcting tests
- `chore`: Updating build tasks, package configurations

**Example:**
`feat(payment): add iyzico 3D secure payment gateway strategy`

---

## 📥 Submitting a Pull Request (PR)

1. **Keep it focused:** Each PR should address a single issue or implement one specific feature.
2. **Run validations:** Ensure your code compiles without error by running build validations locally:
   ```bash
   npm run build --prefix client
   npm run build --prefix admin
   ```
3. **Reference Issues:** Link the PR to the relevant issue using standard GitHub keywords (e.g. `Closes #123`).
4. **Obtain Approvals:** Do not merge code directly into the protected `main` branch. At least 1-2 code reviews and approved status checks are required for merging.
