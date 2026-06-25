# Just AI World Cup

A production-ready, accessible AI World Cup tournament dashboard with responsive standings, knockout fixtures, and optional server-side OpenAI insights through a Cloudflare Worker.

## Features

- Responsive React + Vite frontend for mobile, tablet, and desktop.
- Accessible skip link, semantic landmarks, keyboard-focus styles, responsive table region, and ARIA status/error messaging.
- Code-split AI insights panel to reduce initial bundle work.
- Secure OpenAI integration in `worker/index.ts`; the browser never receives `OPENAI_API_KEY`.
- GitHub Pages workflow with build, typecheck, lint, and test gates.
- SEO assets: meta tags, Open Graph image, favicon, `robots.txt`, and `sitemap.xml`.

## Requirements

- Node.js 22+
- npm 10+
- Cloudflare Wrangler account access for API deployment

## Local setup

```bash
npm install
npm run dev
```

Open the local Vite URL. The frontend calls `/api/insights` by default. For local full-stack development, run the Worker separately:

```bash
npm run worker:dev
```

Set `VITE_API_BASE_URL` if the Worker runs on a different origin:

```bash
VITE_API_BASE_URL=http://localhost:8787 npm run dev
```

## Production checks

```bash
npm run audit:prod
```

This runs TypeScript, ESLint, Vitest, and the production Vite build.

## Deployment

### GitHub Pages

1. Replace `your-github-username` in `index.html`, `public/robots.txt`, `public/sitemap.xml`, and `wrangler.toml` with your real GitHub owner.
2. Push to `main`.
3. Enable GitHub Pages with GitHub Actions as the source.
4. The `.github/workflows/pages.yml` workflow builds and deploys `dist/`.

### Cloudflare Worker

1. Set the OpenAI secret server-side only:

   ```bash
   npx wrangler secret put OPENAI_API_KEY
   ```

2. Update `ALLOWED_ORIGIN` in `wrangler.toml` to your GitHub Pages origin.
3. Deploy:

   ```bash
   npm run worker:deploy
   ```

## OpenAI security model

- `OPENAI_API_KEY` is read exclusively by the Cloudflare Worker environment.
- The frontend only calls the Worker endpoint and does not import or expose secrets.
- If the secret is missing, the Worker returns a deterministic offline fallback so the UI remains usable.

## Troubleshooting

- **Insight request returns 404:** verify the frontend `VITE_API_BASE_URL` points to the Worker origin.
- **OpenAI request failed:** confirm `OPENAI_API_KEY` is configured with `wrangler secret put` and the selected `OPENAI_MODEL` is available.
- **GitHub Pages paths broken:** verify the Vite `base` matches `/just-ai-worldcup/` for Actions builds.
- **CORS blocked:** set `ALLOWED_ORIGIN` in `wrangler.toml` to the exact Pages origin.
