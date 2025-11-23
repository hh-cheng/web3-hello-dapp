# Cloudflare Pages Setup - Quick Reference

## ⚡ Quick Setup (Copy & Paste)

### Step 1: Build Configuration

Go to: **Settings → Builds & deployments → Build configuration**

**Copy these exact settings:**

```
Framework preset: None
Root directory: (leave empty)
Build command: pnpm install --frozen-lockfile && cd apps/hello-dapp && pnpm cf:build
Build output directory: apps/hello-dapp/.vercel/output/static
```

### Step 2: Set Compatibility Flags

**IMPORTANT:** Cloudflare Pages doesn't read `wrangler.toml` from the project root. You need to set compatibility flags in the dashboard:

1. Go to: **Settings → Functions → Compatibility flags**
2. Add compatibility flag: `nodejs_compat`
3. Set compatibility date: `2025-11-23` (or latest)

**Alternative:** The project includes a `functions/wrangler.toml` file that should be automatically picked up. If it's not working, use the dashboard method above.

### Step 3: Environment Variables

Go to: **Settings → Environment variables**

Add these variables for **Production**:

```
LOGGER_CONTRACT = <your-contract-address>
RED_PACKET_CONTRACT = <your-contract-address>
WALLETCONNECT_PROJECT_ID = <your-project-id>
```

**Also add for Preview** (if you want preview deployments to work)

### Step 4: Deploy

1. Go to **Deployments** tab
2. Click **"Retry deployment"** or push a commit
3. Monitor build logs

---

## 🔧 Alternative Configuration

If the above doesn't work (workspace dependency issues), try:

**Build Configuration:**
```
Framework preset: None
Root directory: apps/hello-dapp
Build command: pnpm install --frozen-lockfile && pnpm cf:build
Build output directory: .vercel/output/static
```

---

## 📋 What Each Setting Does

- **Framework preset: None** - We use custom build command
- **Root directory: empty** - Builds from repo root (needed for workspace deps)
- **Build command** - Installs deps, navigates to app, builds for Cloudflare
- **Build output directory** - Where Cloudflare looks for built files

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module 'contracts'"
**Fix:** Use root directory = empty, build from root

### Issue: "pnpm: command not found"  
**Fix:** Add to build command: `npm install -g pnpm &&`

### Issue: Build output not found
**Fix:** Check build logs, verify `.vercel/output/static` exists after build

### Issue: Environment variables not working
**Fix:** Ensure variables are set for Production AND Preview environments

### Issue: Compatibility flags not working
**Fix:** 
1. Go to Settings → Functions → Compatibility flags in Cloudflare Dashboard
2. Manually add `nodejs_compat` flag
3. Set compatibility date to `2025-11-23` or latest
4. Redeploy your project

**Note:** The `wrangler.toml` in the project root is NOT read by Cloudflare Pages. You must set compatibility flags either:
- In the dashboard (Settings → Functions → Compatibility flags), OR
- Via a `functions/wrangler.toml` file (which this project includes)

---

## 📚 More Details

See `cloudflare-build-config.md` for detailed troubleshooting and explanations.

