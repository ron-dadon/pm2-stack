# Release Process

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automatic version management and package publishing.

## How It Works

The release process is fully automated and triggered by commits to the `master` or `main` branch. Semantic-release analyzes commit messages to determine the next version number and automatically:

- Determines the next version number based on conventional commits
- Generates a changelog
- Creates a git tag
- Publishes to npm
- Creates a GitHub release

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format for your commit messages:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: A new feature (triggers minor version bump)
- `fix`: A bug fix (triggers patch version bump)
- `perf`: A performance improvement (triggers patch version bump)
- `docs`: Documentation changes (triggers patch version bump)
- `style`: Code style changes (triggers patch version bump)
- `refactor`: Code refactoring (triggers patch version bump)
- `test`: Adding or updating tests (triggers patch version bump)
- `build`: Build system changes (triggers patch version bump)
- `ci`: CI configuration changes (triggers patch version bump)
- `chore`: Other changes (triggers patch version bump)

### Breaking Changes
Add `BREAKING CHANGE:` in the footer to trigger a major version bump:

```
feat: add new API

BREAKING CHANGE: The old API is deprecated and will be removed in v2.0.0
```

## Examples

### Patch Release (0.1.0 → 0.1.1)
```bash
git commit -m "fix: resolve memory leak in PM2Stack"
git commit -m "docs: update installation instructions"
git commit -m "chore: update dependencies"
```

### Minor Release (0.1.0 → 0.2.0)
```bash
git commit -m "feat: add PM2App class for individual app management"
git commit -m "feat(api): add new startApp method"
```

### Major Release (0.1.0 → 1.0.0)
```bash
git commit -m "feat: redesign PM2Stack API

BREAKING CHANGE: The PM2Stack constructor now requires a configuration object"
```

## Workflow Triggers

The release workflow only runs when code-related files change:

- `src/**` - Source code changes
- `examples/**` - Example applications
- `package.json` - Dependencies
- `package-lock.json` - Lock file
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Build config
- `.eslintrc.js` - Linting config
- `.prettierrc` - Formatting config
- `vitest.config.*` - Test config
- `*.test.ts` - Test files
- `*.test.js` - Test files

**Note**: Documentation changes (`docs/**`, `README.md`) will NOT trigger releases.

## Prerequisites

### GitHub Secrets
The following secrets must be configured in your GitHub repository:

1. **NPM_TOKEN**: NPM authentication token for publishing
   - Go to [npmjs.com](https://www.npmjs.com/) → Account Settings → Access Tokens
   - Create a new token with "Automation" type
   - Add to GitHub repository secrets as `NPM_TOKEN`

2. **GITHUB_TOKEN**: Automatically provided by GitHub Actions
   - No action required

### NPM Package Access
Ensure the package name `pm2-stack` is available on npm and you have publish permissions.

## Local Testing

You can test the release process locally (dry run):

```bash
# Install dependencies
npm install

# Run semantic-release in dry-run mode
npm run semantic-release:dry-run
```

This will show what would happen without actually creating releases or publishing.

## Release Workflow

1. **Code Changes**: Make changes to source code
2. **Commit**: Use conventional commit format
3. **Push**: Push to `master` or `main` branch
4. **Automation**: GitHub Actions runs the release workflow
5. **Analysis**: Semantic-release analyzes commits
6. **Release**: If changes warrant a release:
   - Version is bumped
   - Changelog is generated
   - Git tag is created
   - Package is published to npm
   - GitHub release is created

## Manual Release

If you need to trigger a release manually (not recommended):

1. Make a commit with a conventional commit message
2. Push to `master` or `main` branch
3. The workflow will automatically run

## Troubleshooting

### Release Not Triggered
- Check that you're pushing to `master` or `main` branch
- Verify commit message follows conventional commit format
- Ensure you're changing code-related files (not just docs)

### NPM Publish Fails
- Verify `NPM_TOKEN` secret is correctly set
- Check that package name is available on npm
- Ensure you have publish permissions for the package

### Version Not Bumped
- Check commit message format
- Verify the commit type triggers a release (see Types section)
- Use `npm run semantic-release:dry-run` to test locally

## Configuration

The semantic-release configuration is in `package.json`:

```json
{
  "release": {
    "branches": ["master", "main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      "@semantic-release/git",
      "@semantic-release/github"
    ],
    "preset": "conventionalcommits",
    "tagFormat": "v${version}",
    "changelogFile": "CHANGELOG.md",
    "changelogTitle": "# Changelog",
    "npmPublish": true,
    "tarballDir": "dist"
  }
}
```

## Generated Files

After a successful release, these files are automatically updated:

- `CHANGELOG.md` - Generated changelog
- `package.json` - Version number updated
- `package-lock.json` - Lock file updated
- Git tag created (e.g., `v1.0.0`)
- GitHub release created
- NPM package published
