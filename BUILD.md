# Build & Publish

## Prerequisites

- Node.js >= 15.0.0
- npm >= 6

## Install Dependencies

```bash
npm install
```

## Build

The project uses Babel to compile ES module source (`lib/`) into CommonJS output (`dist/`). The `dist/` directory is gitignored but included in the npm package.

```bash
npm run build
```

This runs two steps:

1. **`build:lib`** — compiles `lib/` to `dist/lib/` (compact, no comments)
2. **`build:bin`** — compiles `bin/` to `dist/bin/` (CLI tooling)

## Run Tests

```bash
npm test
```

For coverage:

```bash
npm run test:coverage
```

For linting (standard):

```bash
npm run test:standard
```

## Publish a New Version

The project has `preversion` and `postversion` hooks wired up in `package.json`:

- **preversion** — runs linting + tests (must pass before version bump)
- **postversion** — pushes the commit and tag to the remote

### Steps

1. Make your changes in `lib/` (source) and `lib/types/index.d.ts` (TypeScript declarations).

2. Run tests to verify nothing is broken:
   ```bash
   npm test
   ```

3. Build the dist output:
   ```bash
   npm run build
   ```

4. Bump the version (patch/minor/major). This automatically runs lint + tests via the `preversion` hook, commits the version bump, tags it, and pushes via the `postversion` hook:
   ```bash
   npm version patch   # e.g. 3.2.4 -> 3.2.5
   # or
   npm version minor   # e.g. 3.2.4 -> 3.3.0
   # or
   npm version major   # e.g. 3.2.4 -> 4.0.0
   ```

5. Publish to the npm registry:
   ```bash
   npm publish
   ```

   The package is published as `@technweb/node-dependency-injection` to the GitHub Packages registry. If your `.npmrc` is not already configured for the GitHub registry, add:
   ```
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   @technweb:registry=https://npm.pkg.github.com/
   ```

## Project Structure

```
lib/                  # ES module source (edit here)
  Loader/
    FileLoader.js     # Base loader with sync/async parse methods
    YamlFileLoader.js # YAML loader (load + loadSync)
    JsFileLoader.js   # JS config loader
    JsonFileLoader.js # JSON config loader
  types/
    index.d.ts        # TypeScript declarations (edit here)
  ContainerBuilder.js
  ...
bin/                  # CLI source
dist/                 # Built output (gitignored, npm-published)
test/                 # Mocha test suite
```

## Key Notes

- Always edit source in `lib/`, never in `dist/`. The `dist/` directory is regenerated on every build.
- TypeScript declarations live at `lib/types/index.d.ts` and are copied to `dist/lib/types/index.d.ts` during build.
- The `.npmignore` excludes `lib/` and `test/` from the published package — only `dist/` ships to consumers.
