# Kraviona Tools — Frontend Application

This is the Next.js frontend application for **Kraviona Tools** ([https://kraviona.site](https://kraviona.site)).

## Technology Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS
- **Icons**: Lucide React
- **Typography**: Inter (Google Fonts)

## Key Directories
- `app/`: Next.js App Router pages, layouts, and dynamic route handlers (`/robots.txt`, `/llms.txt`, `/sitemap.xml`)
- `components/`: Modular React components (admin, layout, tools, seo, ui)
- `config/`: Central brand, site, and navigation configurations
- `services/`: Typed API client service layer
- `types/`: Global TypeScript definitions
- `lib/`: Utilities, tools registry, and site URL helpers
- `public/`: Static brand assets (`/logo/`, favicons)

## Development
```bash
npm install
npm run dev     # Starts local server on http://localhost:3000
npm run build   # Compiles production bundle
npm run start   # Starts production server
```

For complete platform documentation, architecture diagrams, and operational procedures, refer to the root `README.md` and `docs/` directory.
