# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the PM2Stack project.

## Workflows

### CI (`ci.yml`)
- **Triggers**: Push and pull requests to `main`/`master` branches
- **Purpose**: Run tests, linting, type checking, and build verification
- **Matrix Strategy**: Tests against Node.js versions 20, 22, and 24
- **Concurrency**: Cancels previous runs when new commits are pushed

### Deploy Documentation (`deploy-docs.yml`)
- **Triggers**: Push and pull requests to `main`/`master` branches (only when docs files change)
- **Purpose**: Build and deploy documentation to GitHub Pages
- **Concurrency**: Cancels previous runs when new commits are pushed

## Concurrency Configuration

Both workflows use concurrency control to prevent multiple runs from executing simultaneously:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}-${{ github.event_name }}
  cancel-in-progress: true
```

### How it works:

1. **Group Key**: `${{ github.workflow }}-${{ github.ref }}-${{ github.event_name }}`
   - `github.workflow`: Workflow name (e.g., "CI", "Deploy Documentation")
   - `github.ref`: Branch or tag reference (e.g., "refs/heads/main")
   - `github.event_name`: Event type (e.g., "push", "pull_request")

2. **Cancel in Progress**: `true`
   - When a new workflow run starts, any previous runs in the same group are cancelled
   - This saves CI resources and prevents conflicts

### Benefits:

- **Resource Efficiency**: Prevents multiple CI runs for the same branch
- **Faster Feedback**: Only the latest commit gets tested
- **Cost Savings**: Reduces GitHub Actions minutes usage
- **Cleaner History**: Avoids cluttered workflow run history

### Examples:

- Push to `main` → CI runs → Push again before first completes → First CI is cancelled, second runs
- PR opened → CI runs → New commit pushed to PR → Previous CI cancelled, new CI runs
- Docs changed → Deploy docs runs → Docs changed again → Previous deploy cancelled, new deploy runs

## Workflow Dependencies

- **CI**: Independent, runs on every push/PR
- **Deploy Docs**: Independent, only runs when docs files change
- **No Dependencies**: Workflows don't depend on each other, allowing parallel execution when appropriate

## Best Practices Implemented

1. **Concurrency Control**: Prevents resource waste
2. **Path-based Triggers**: Docs workflow only runs when relevant files change
3. **Matrix Testing**: CI tests against multiple Node.js versions
4. **Proper Permissions**: Minimal required permissions for each workflow
5. **Build Validation**: Ensures build output is correct and dependencies are externalized
6. **Production Builds**: Uses optimized builds for deployment
