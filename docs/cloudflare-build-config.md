# Cloudflare Pages Build Configuration

## Dashboard Settings

Configure your Cloudflare Pages project with these exact settings:

### Build Configuration

**Location:** Settings → Builds & deployments → Build configuration

```
Framework preset: None
Root directory: (leave empty - builds from repo root)
Build command: pnpm install --frozen-lockfile && cd apps/hello-dapp && pnpm cf:build
Build output directory: apps/hello-dapp/.vercel/output/static
```

### Alternative Configuration (if above doesn't work)

If workspace dependencies aren't resolving, try this:

```
Framework preset: None
Root directory: apps/hello-dapp
Build command: pnpm install --frozen-lockfile && pnpm cf:build
Build output directory: .vercel/output/static
```

**Note:** The `--frozen-lockfile` flag ensures consistent builds and prevents lockfile updates.

### Environment Variables

**Location:** Settings → Environment variables

Add these for **Production** environment:

| Variable | Description | Example |
|----------|-------------|---------|
| `LOGGER_CONTRACT` | Logger contract address | `0x1234...` |
| `RED_PACKET_CONTRACT` | Red Packet contract address | `0x5678...` |
| `WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | `your-project-id` |
| `NODE_VERSION` | Node.js version (optional) | `18` |

**Important:** Add the same variables for **Preview** environment if you want preview deployments.

### Node.js Version

Cloudflare Pages should automatically detect `.nvmrc` files. If not, you can set:
- Environment variable: `NODE_VERSION=18`
- Or use Node 18+ in build command

## Build Process

The build process:

1. **Install dependencies** (`pnpm install --frozen-lockfile`)
   - Installs all workspace dependencies from root
   - Resolves `contracts` workspace package

2. **Navigate to app directory** (`cd apps/hello-dapp`)
   - Changes to the Next.js app directory

3. **Build for Cloudflare** (`pnpm cf:build`)
   - Runs `next build` to create Next.js build
   - Runs `@cloudflare/next-on-pages` to adapt for Cloudflare Pages
   - Outputs to `.vercel/output/static`

4. **Deploy** (automatic)
   - Cloudflare Pages deploys from `.vercel/output/static`

## Troubleshooting

### Error: "Cannot find module 'contracts'"

**Solution:** Ensure build runs from repository root:
- Root directory should be empty
- Build command should start with `pnpm install` from root

### Error: "pnpm: command not found"

**Solution:** Cloudflare Pages should have pnpm. If not, add to build command:
```bash
npm install -g pnpm && pnpm install --frozen-lockfile && cd apps/hello-dapp && pnpm cf:build
```

### Error: "Build output directory not found"

**Solution:** Check build logs:
1. Verify `next build` completes successfully
2. Verify `@cloudflare/next-on-pages` runs without errors
3. Check that `.vercel/output/static` exists after build
4. Adjust output directory path if needed

### Build Times Out

**Solution:** 
- Check if all dependencies are installing correctly
- Ensure `--frozen-lockfile` is used (faster installs)
- Consider using root directory approach to avoid workspace issues

### Environment Variables Not Available

**Solution:**
1. Verify variables are set for correct environment (Production/Preview)
2. Variable names are case-sensitive
3. Redeploy after adding/changing variables
4. Check build logs for variable access errors

## Testing Locally

Test the build process locally:

```bash
# From repository root
pnpm install --frozen-lockfile
cd apps/hello-dapp
pnpm cf:build

# Verify output exists
ls -la .vercel/output/static
```

## Manual Deployment

If automatic deployments fail, deploy manually:

```bash
# Build
pnpm install --frozen-lockfile
cd apps/hello-dapp
pnpm cf:build

# Deploy
npx wrangler pages deploy .vercel/output/static --project-name=hello-dapp
```

## Build Logs

Monitor build logs in Cloudflare Pages dashboard:
- Go to Deployments → Select deployment → View build logs
- Look for errors in dependency installation or build steps
- Check that output directory is created successfully

