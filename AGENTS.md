# Repository Guidelines

## Project Structure & Module Organization
Core SvelteKit routes live in `src/routes`, with shared UI, data, and utilities in `src/lib` (`components/`, `data/`, `utils/`, and server logic under `server/db/`). `src/lib/paraglide` stores translation bundles, and `src/lib/styles` centralizes Tailwind configuration. Keep Playwright specs in `e2e/` and co-locate Vitest specs beside the code they cover (e.g., `src/lib/utils/example.spec.ts`). Public assets reside in `static/`, while deployment helpers such as Vercel edge handlers belong in `app/api`.

## Build, Test, and Development Commands
Use `pnpm install` after cloning. `pnpm dev` starts the Vite dev server, and `pnpm build` produces the production bundle. Run `pnpm preview` to smoke-test the built site. Quality gates: `pnpm check` performs type and Svelte component analysis, `pnpm lint` runs Prettier + ESLint, and `pnpm format` rewrites code to the shared style. For data layer work, `pnpm db:push` syncs schema changes and `pnpm db:migrate` applies migrations.

## Coding Style & Naming Conventions
Formatting is enforced by Prettier (tabs, single quotes, 100-character width) with Tailwind and Svelte plugins—always run `pnpm format` before commits. ESLint extends the Svelte + TypeScript recommended rules; address warnings rather than silencing them. Favor PascalCase for Svelte components, camelCase for utilities, and uppercase snake case for environment constants. Keep Tailwind classes sorted via the Prettier plugin, and export shared building blocks through `src/lib/index.ts` for consistent imports.

## Testing Guidelines
Vitest powers unit and integration tests; follow the `*.spec.ts` suffix and mirror the module’s folder. Tests should cover component rendering states and exported utilities; include accessibility assertions when relevant. Playwright handles end-to-end flows from `e2e/*.test.ts`; install browsers once with `pnpm exec playwright install`. Run `pnpm test` before opening a PR, and capture videos or traces (`pnpm test:e2e -- --trace=on`) for flaky cases.

## Commit & Pull Request Guidelines
Write commits in the imperative mood and keep them focused (e.g., “Refactor hero animation pipeline”). Before pushing, ensure `pnpm lint`, `pnpm check`, and `pnpm test` pass locally. Pull requests must describe the change, list testing performed, and reference related issues. Attach screenshots or recordings for UI-facing work, and mention any database migration or env var impact. Request review from at least one maintainer and wait for automated checks to turn green before merging.

## Environment & Configuration Tips
Copy `.env.example` to `.env` and populate secrets such as `DATABASE_URL` before running Drizzle commands. Keep sensitive keys out of commits. Update `drizzle.config.ts` and `src/lib/server/db/schema.ts` together to maintain parity. For localization, manage messages via the Paraglide files in `project.inlang` and regenerate language assets with `pnpm check` when adding locales.
